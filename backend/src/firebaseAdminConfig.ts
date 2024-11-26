import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Check for required environment variables using process.env
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;


if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase configuration in environment variables");
}

// Initialize Firebase Admin SDK with credentials from environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"), // Replace escaped newlines
    }),
});

export const verifyToken = async (
    token: string,
): Promise<admin.auth.DecodedIdToken> => {
    try {
        return await admin.auth().verifyIdToken(token);
    } catch (error) {
        throw new Error("Unauthorized");
    }
};

export default verifyToken;