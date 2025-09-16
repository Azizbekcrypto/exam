import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';

export type bookHistoryRepository = Repository<Book>;