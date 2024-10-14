import { NextResponse } from "next/server";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const auth = getAuth(); // Get the auth instance
    const decodedToken = await auth.verifyIdToken(token); // Verify the token
    
    return NextResponse.json({ message: "Protected API access granted", user: decodedToken });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
