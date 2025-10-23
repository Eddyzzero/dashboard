import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    id: string;             // uid de Firebase Auth
    email: string;
    displayName: string | null;
    photoURL: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastLoginAt: Timestamp;
    provider: 'google' | 'password';
}