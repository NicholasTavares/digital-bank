import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('verification_mail_tokens')
export class VerificationMailToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'bigint' })
  expires_at: number;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
