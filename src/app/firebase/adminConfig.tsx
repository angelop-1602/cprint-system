// src/app/firebase/adminConfig.ts
import admin from 'firebase-admin';

// Check if the default app has already been initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Use an environment variable for the database URL
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw new Error("Failed to initialize Firebase Admin SDK");
  }
}

// Export the auth object
export const auth = admin.auth();
