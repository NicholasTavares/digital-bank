import { hashSync } from 'bcrypt';
import { Account } from '../../accounts/entities/account.entity';
import { ResetPasswordToken } from '../../reset_password_token/entities/reset_password_token.entity';
import { VerificationMailToken } from '../../verification_mail_tokens/entities/verification_mail_token.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  avatar_url: string;

  @Column({ default: null })
  avatar_key: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp' })
  birth_date: Date;

  @Column({ default: null })
  verified_at: Date | null;

  @Column({ default: null })
  reseted_password_at: Date | null;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
  })
  account: Account;

  @OneToMany(
    () => VerificationMailToken,
    (verificationMailToken) => verificationMailToken.user,
    {
      cascade: true,
    },
  )
  verificationMailToken: VerificationMailToken;

  @OneToMany(
    () => ResetPasswordToken,
    (resetPasswordToken) => resetPasswordToken.user,
    {
      cascade: true,
    },
  )
  resetPasswordToken: ResetPasswordToken;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
