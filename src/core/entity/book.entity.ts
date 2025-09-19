import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookHistory } from './book.history';
import { Borrow } from './barrow.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  published_year: number;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];

  @OneToMany(() => BookHistory, (history) => history.book)
  histories: BookHistory[];
}
