import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './barrow.entity';
import { BookHistory } from './book.history';
import { UserSRole } from 'src/common/enum/users.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserSRole,
    default: UserSRole.READER,
  })
  role: UserSRole;

  @OneToMany(() => Borrow, (borrow) => borrow.user)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.user)
  histories: BookHistory[];
}
