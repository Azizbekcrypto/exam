import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { Book } from './book.entity';


@Entity('borrows')
export class Borrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Borrow → User (reader)
  @ManyToOne(() => User, (user) => user.borrows, { onDelete: 'CASCADE' })
  user: User;

  // Borrow → Book
  @ManyToOne(() => Book, (book) => book.borrows, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;

  @Column()
  due_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column({ default: false })
  overdue: boolean;
}
