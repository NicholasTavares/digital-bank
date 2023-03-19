import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PaginationUsersDTO } from './dto/pagination-users.dto';
import { SendMailProducerService } from '../jobs/send-mail-producer.service';
import { CreateResetPasswordUserDTO } from './dto/create-reset-password-user.dto';
import { ResetPasswordTokenService } from '../reset_password_token/reset_password_token.service';
import { VerificationMailTokensService } from '../verification_mail_tokens/verification_mail_tokens.service';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
const redisClient = new Redis();

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sendMailProducerService: SendMailProducerService,
    private readonly verificationMailTokensService: VerificationMailTokensService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
    private readonly configService: ConfigService,
  ) {}

  async findAll({ text }: PaginationUsersDTO): Promise<User[]> {
    const users = await this.userRepository.findAll(text);

    return users;
  }

  async findMe(user_id: string) {
    const user = await this.userRepository.findMe(user_id);

    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findUser(id);

    return user;
  }

  async findUserByEmailForResetPassword(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmailForResetPassword(
      email,
    );

    return user;
  }

  async findUserByEmailForAuth(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmailForAuth(email);

    return user;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const birth_date = new Date(createUserDTO.birth_date);
    const today = new Date();
    const over18 = new Date(
      birth_date.getUTCFullYear() + 18,
      birth_date.getUTCMonth(),
      birth_date.getUTCDate(),
    );

    if (over18 >= today) {
      throw new BadRequestException('Usuário menor de 18 anos!');
    }

    const user = await this.userRepository.createUser(createUserDTO);

    await this.sendMailProducerService.sendMailToken({
      user_id: user.id,
      email: user.email,
      subject: 'Verify your email',
      endpoint: 'users/verify-mail',
      valid_time: '24 hours',
      type: 'VERIFY_EMAIL',
    });

    return user;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.updateUser(id, updateUserDTO);

    return user;
  }

  async avatar(
    user_id: string,
    dataBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<User> {
    const s3 = new S3();

    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      select: ['id', 'avatar_key', 'avatar_url'],
    });

    if (user.avatar_url) {
      await s3
        .deleteObject({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Key: user.avatar_key,
        })
        .promise();
    }

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        ACL: 'public-read-write',
        Body: dataBuffer,
        Key: `${randomUUID()}-${filename}`,
        ContentType: mimetype,
      })
      .promise();

    const updatedUser = await this.userRepository.preload({
      id: user.id,
      avatar_url: uploadResult.Location,
      avatar_key: uploadResult.Key,
    });

    return this.userRepository.save(updatedUser);
  }

  async removeAvatar(user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
      select: ['id', 'avatar_key', 'avatar_url'],
    });

    const s3 = new S3();

    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: user.avatar_key,
      })
      .promise();

    const updatedUser = await this.userRepository.preload({
      id: user.id,
      avatar_key: null,
      avatar_url: null,
    });

    await this.userRepository.save(updatedUser);
  }

  async verifyMail(hash: string): Promise<User> {
    const token = await this.verificationMailTokensService.findOne(hash);

    const now = Date.now();

    if (token.expires_at <= now) {
      await this.verificationMailTokensService.delete(token.id);
      throw new BadRequestException('Expired token!');
    }

    const user = await this.userRepository.preload({
      id: token.user_id,
      verified_at: new Date(),
    });

    await this.userRepository.save(user);

    await this.verificationMailTokensService.delete(token.id);

    return user;
  }

  async resendVerifyMail(user_id: string, user_email: string) {
    await this.verificationMailTokensService.deleteMany(user_id);

    await this.sendMailProducerService.sendMailToken({
      user_id,
      email: user_email,
      subject: 'Verify your email',
      endpoint: 'users/verify-mail',
      valid_time: '24 hours',
      type: 'VERIFY_EMAIL',
    });

    return {
      status: HttpStatus.CREATED,
      message: `Reset token sent to ${user_email}! Don't forget to check span folder!`,
    };
  }

  async resetPassword({ email }: CreateResetPasswordUserDTO) {
    const user = await this.findUserByEmailForResetPassword(email);

    if (!user) return;

    return await this.sendMailProducerService.sendMailToken({
      user_id: user.id,
      email,
      subject: 'Reset password',
      endpoint: 'users/reset-password',
      valid_time: '10 minutes',
      type: 'PASSWORD',
    });
  }

  async verifyResetPassword(hash: string, password: string) {
    const token = await this.resetPasswordTokenService.findOne(hash);

    const now = Date.now();

    if (token.expires_at <= now) {
      await this.resetPasswordTokenService.delete(token.id);
      throw new BadRequestException('Expired token!');
    }

    const newPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.preload({
      id: token.user_id,
      password: newPassword,
      reseted_password_at: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    await this.resetPasswordTokenService.delete(token.id);

    const formatedDate = new Date(now).toLocaleString('pt-br', {
      timeZone: 'America/Sao_paulo',
    });

    const keys = await redisClient.keys(`user:${user.id}:jwt:*`);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    return await this.sendMailProducerService.sendMail({
      email: savedUser.email,
      subject: 'Password redifined',
      text: `Hello, ${savedUser.username}! Your password has been successfully redifined at ${formatedDate}.`,
    });
  }

  async remove(id: string) {
    await this.userRepository.softRemoveUser(id);
  }
}
