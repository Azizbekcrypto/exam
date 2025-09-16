import { Repository } from 'typeorm';
import { Borrow } from '../entity/barrow.entity';

export type barrowRepository = Repository<Borrow>;
