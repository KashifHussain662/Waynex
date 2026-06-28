import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { getWaynexAuth } from "./firebaseApp";
import { AuthProvider } from "../../types";
import { ApiError } from "../../api/errors";

export function mapFirebaseAuthError(error: unknown): ApiError {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "auth/unknown";
  const message =
    code === "auth/invalid-credential"
      ? "The email or password is incorrect."
      : code === "auth/user-not-found"
        ? "No account exists for this email."
      : code === "auth/email-already-in-use"
        ? "An account already exists for this email."
        : code === "auth/weak-password"
          ? "Use a stronger password."
          : code === "auth/network-request-failed"
            ? "Network error. Check your connection and try again."
            : code === "auth/too-many-requests"
              ? "Too many attempts. Please try again later."
              : "Authentication failed. Please try again.";

  return new ApiError(message, code === "auth/network-request-failed" ? "NETWORK_ERROR" : "AUTH_REQUIRED", undefined, error);
}

export const firebaseAuthService = {
  async signIn(provider: AuthProvider, identifier = "guest") {
    const auth = getWaynexAuth();
    if (!auth) {
      return null;
    }

    if (provider === "guest") {
      const credential = await signInAnonymously(auth);
      return credential.user;
    }

    if (provider === "email") {
      const [email, password = "waynex-development-password"] = identifier.split("|");
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
      } catch (error) {
        throw mapFirebaseAuthError(error);
      }
    }

    throw new ApiError(`${provider} auth requires a native provider adapter.`, "VALIDATION_ERROR");
  },
  async signInWithEmail(email: string, password: string) {
    const auth = getWaynexAuth();
    if (!auth) {
      return null;
    }

    try {
      return (await signInWithEmailAndPassword(auth, email, password)).user;
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },
  async signInOrCreateDemoEmail(email: string, password: string, displayName = "Waynex Traveler") {
    const auth = getWaynexAuth();
    if (!auth) {
      return null;
    }

    try {
      return (await signInWithEmailAndPassword(auth, email, password)).user;
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      if (email === "traveler@waynex.app" && ["auth/user-not-found", "auth/invalid-credential"].includes(code)) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName });
        return credential.user;
      }

      throw mapFirebaseAuthError(error);
    }
  },
  async registerWithEmail(email: string, password: string, displayName?: string) {
    const auth = getWaynexAuth();
    if (!auth) {
      return null;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }
      return credential.user;
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },
  async sendPasswordReset(email: string) {
    const auth = getWaynexAuth();
    if (!auth) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },
  getCurrentUser() {
    return getWaynexAuth()?.currentUser ?? null;
  },
  onAuthStateChanged(onUser: (user: User | null) => void) {
    const auth = getWaynexAuth();
    return auth ? onAuthStateChanged(auth, onUser) : () => undefined;
  },
  async signOut() {
    const auth = getWaynexAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
  },
};
