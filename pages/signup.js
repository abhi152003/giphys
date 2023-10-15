"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../src/app/firebase';
import styles from './signup.module.css';
import '../src/app/globals.css'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []); 

  const handleSignup = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      router.push('/');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to create an account. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      {error && <p className={styles.error}>{error}</p>} 
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <div className={styles.loginLink}>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}
