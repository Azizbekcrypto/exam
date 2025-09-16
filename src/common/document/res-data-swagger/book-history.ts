import { HistoryAction } from "src/api/book-history/dto/create-book-history.dto";

export const bookHistoryData = {
    id: 'f1a2b3c4-5d6e-7f8g-9h0i-j1k2l3m4n5o6',
    userId: 'e6b189ff-1d45-44e9-a252-5a0b48f3678f', // adminData.id yoki boshqa user
    bookId: 'b1f1c8e7-3f1a-4a2b-8d3f-9a2b1c7e8f4a', // bookData.id
    action: HistoryAction.BORROW,
    createdAt: '2025-09-15T10:05:00.000Z',
    updatedAt: '2025-09-15T10:05:00.000Z',
  };