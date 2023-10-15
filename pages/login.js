"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../src/app/firebase';
import styles from './login.module.css';
import '../src/app/globals.css'

export default function Login() {
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

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <div className={styles.signupLink}>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}
