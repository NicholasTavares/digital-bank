import { Account } from '../../accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('savings')
export class Saving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  balance: number;

  @Column({ default: 0 })
  yield: number;

  @Column({ name: 'account_id' })
  account_id: string;

  @OneToOne(() => Account, (account) => account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
