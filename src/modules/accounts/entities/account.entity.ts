import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Saving } from 'src/modules/savings/entities/saving.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  balance: number;

  @Column({ name: 'user_id' })
  user_id: string;

  @OneToOne(() => User, (user) => user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => Transaction,
    (debitedTransactions) => debitedTransactions.debitedAccount,
    {
      cascade: true,
    },
  )
  debitedTransactions: Transaction[];

  @OneToMany(
    () => Transaction,
    (creditedTransactions) => creditedTransactions.creditedAccount,
    {
      cascade: true,
    },
  )
  creditedTransactions: Transaction[];

  @OneToOne(() => Saving, (saving) => saving.account, {
    cascade: true,
  })
  saving: Saving;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
