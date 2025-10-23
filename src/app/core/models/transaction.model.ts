import { Timestamp } from 'firebase/firestore';

export interface Transaction {
    id?: string;
    date: Timestamp;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    note?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}
