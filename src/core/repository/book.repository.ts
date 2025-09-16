


import { Repository } from 'typeorm';
import { BookHistory } from '../entity/book.history';

export type bookRepository = Repository<BookHistory>;
