import { Injectable } from '@angular/core';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    browserPopupRedirectResolver
} from 'firebase/auth';
import { auth, db } from './firebase-init';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { UserProfile } from '../models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        // Vérifier l'état de l'authentification au démarrage
        onAuthStateChanged(auth, async (user) => {
            this.currentUserSubject.next(user);
            if (user) {
                await this.updateUserProfile(user);
            }
        });
    }

    private async updateUserProfile(user: User) {
        const userRef = doc(db, 'users', user.uid);
        const now = Timestamp.now();

        // Vérifier si le profil existe déjà
        const userDoc = await getDoc(userRef);
        const isNewUser = !userDoc.exists();

        const profile: Partial<UserProfile> = {
            email: user.email || '',
            displayName: user.displayName,
            photoURL: user.photoURL,
            updatedAt: now,
            lastLoginAt: now
        };

        if (isNewUser) {
            profile.createdAt = now;
            profile.provider = user.providerData[0]?.providerId === 'google.com' ? 'google' : 'password';
        }

        await setDoc(userRef, profile, { merge: true });
    }

    async login(email: string, password: string) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        this.currentUserSubject.next(cred.user);
        return cred.user;
    }

    async signup(email: string, password: string) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        this.currentUserSubject.next(cred.user);
        return cred.user;
    }

    async logout() {
        await signOut(auth);
        this.currentUserSubject.next(null);
    }

    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            const result = await signInWithPopup(auth, provider);
            if (result && result.user) {
                this.currentUserSubject.next(result.user);
                // Le profil sera mis à jour par le onAuthStateChanged listener
                return result.user;
            }
            return null;
        } catch (error: any) {
            console.error('Google Sign In Error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('La fenêtre de connexion a été fermée');
            } else if (error.code === 'auth/popup-blocked') {
                throw new Error('La fenêtre pop-up a été bloquée. Veuillez autoriser les popups pour ce site.');
            }
            throw error;
        }
    }

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
