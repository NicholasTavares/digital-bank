import { hashSync } from 'bcrypt';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { VerificationMailToken } from 'src/modules/verification_mail_tokens/entities/verification_mail_token.entity';
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
  verified_at: Date | null;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp' })
  birth_date: Date;

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
