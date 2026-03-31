"use client";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export async function waitForInitialAuthState() {
  await getFirebaseAuth().authStateReady();
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function logout() {
  return signOut(getFirebaseAuth());
}
