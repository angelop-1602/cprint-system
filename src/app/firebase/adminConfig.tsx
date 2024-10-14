// src/app/firebase/adminConfig.ts
import admin from 'firebase-admin';

// Check if the default app has already been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // You can specify databaseURL if you are using Firestore or Realtime Database
    databaseURL: "https://console.firebase.google.com/u/2/project/cprint-automation/database/cprint-automation-default-rtdb/data/~2F",
  });
}

export const auth = admin.auth();
