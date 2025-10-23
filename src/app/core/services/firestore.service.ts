import { Injectable } from '@angular/core';
import { collection, addDoc, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, onSnapshot, DocumentData, QuerySnapshot, QueryDocumentSnapshot, orderBy, Timestamp as FireTimestamp } from 'firebase/firestore';
import { db } from './firebase-init';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    constructor() { }

    // Generic add document to a collection reference
    async addDocument(path: string, data: any) {
        const colRef = collection(db, path);
        const docRef = await addDoc(colRef, data);
        return docRef.id;
    }

    // Transaction-specific helpers
    private userTransactionsPath(userId: string) {
        return `users/${userId}/transactions`;
    }

    async getTransactionsByMonth(userId: string, month: number, year: number): Promise<Transaction[]> {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 1);
        const colRef = collection(db, this.userTransactionsPath(userId));
        const q = query(colRef, where('date', '>=', FireTimestamp.fromDate(start)), where('date', '<', FireTimestamp.fromDate(end)), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({ id: d.id, ...(d.data() as any) })) as Transaction[];
    }

    async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
        const colRef = collection(db, this.userTransactionsPath(userId));
        const now = FireTimestamp.now();
        const toSave = { ...transaction, createdAt: now, updatedAt: now } as any;
        const docRef = await addDoc(colRef, toSave);
        return { id: docRef.id, ...toSave } as Transaction;
    }

    async updateTransaction(userId: string, transactionId: string, data: Partial<Transaction>) {
        const docRef = doc(db, this.userTransactionsPath(userId), transactionId);
        await setDoc(docRef, { ...data, updatedAt: FireTimestamp.now() }, { merge: true });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        const docRef = doc(db, this.userTransactionsPath(userId), transactionId);
        await deleteDoc(docRef);
    }

    async setDocument(path: string, id: string, data: any) {
        const docRef = doc(db, path, id);
        await setDoc(docRef, data, { merge: true });
    }

    async deleteDocument(path: string, id: string) {
        const docRef = doc(db, path, id);
        await deleteDoc(docRef);
    }

    async getDocument(path: string, id: string) {
        const docRef = doc(db, path, id);
        const snapshot = await getDoc(docRef as any);
        if (!snapshot.exists()) return null;
        const data = snapshot.data() as DocumentData | undefined;
        return { id: snapshot.id, ...(data || {}) };
    }

    async getCollection(path: string) {
        const colRef = collection(db, path);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({ id: d.id, ...d.data() }));
    }

    // Real-time listener for a collection
    onCollectionSnapshot(path: string, callback: (docs: DocumentData[]) => void) {
        const colRef = collection(db, path);
        return onSnapshot(colRef, (snapshot: QuerySnapshot<DocumentData>) => {
            const docs = snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({ id: d.id, ...d.data() }));
            callback(docs);
        });
    }
}
