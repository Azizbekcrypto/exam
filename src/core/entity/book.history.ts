import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Book } from "./book.entity";

@Entity('book_histories')
export class BookHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Book FK
  @Column()
  bookId: string;

  @ManyToOne(() => Book, (book) => book.histories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  // 🔹 User FK
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.histories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  action_date: Date;

  @Column()
  action: string; // borrow | return

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
