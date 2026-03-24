import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

// =====================================================
// CONSTANTS
// =====================================================

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION || "86400"); // 24 hours
const REFRESH_TOKEN_EXPIRATION = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION || "2592000"
); // 30 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: JWT_EXPIRATION,
};

// =====================================================
// PASSWORD HASHING
// =====================================================

/**
 * Hash a password using bcryptjs
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(12);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare a plain text password with a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

// =====================================================
// JWT TOKENS
// =====================================================

export interface AuthTokenPayload {
  userId: string;
  email: string;
  type: "access" | "refresh";
}

/**
 * Generate a JWT token
 * @param payload - Token payload
 * @param isRefreshToken - Whether this is a refresh token
 * @returns JWT token
 */
export function generateToken(
  payload: Omit<AuthTokenPayload, "type">,
  isRefreshToken: boolean = false
): string {
  const expiresIn = isRefreshToken ? REFRESH_TOKEN_EXPIRATION : JWT_EXPIRATION;

  return jwt.sign(
    {
      ...payload,
      type: isRefreshToken ? "refresh" : "access",
    },
    JWT_SECRET,
    {
      expiresIn,
      algorithm: "HS256",
    }
  );
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Generate both access and refresh tokens
 * @param payload - Token payload
 * @returns Object with both tokens
 */
export function generateTokenPair(payload: Omit<AuthTokenPayload, "type">) {
  return {
    accessToken: generateToken(payload, false),
    refreshToken: generateToken(payload, true),
  };
}

// =====================================================
// COOKIE MANAGEMENT
// =====================================================

/**
 * Set authentication cookies
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: JWT_EXPIRATION,
  });

  cookieStore.set("refresh_token", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_EXPIRATION,
  });
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 0,
  });
}


/**
 * Get auth token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token || null;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;
  return token || null;
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Create a session for a user
 * Stores tokens in cookies and returns user data
 */
export async function createSession(userId: string, email: string) {
  const { accessToken, refreshToken } = generateTokenPair({
    userId,
    email,
  });

  await setAuthCookies(accessToken, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: userId,
      email,
    },
  };
}

/**
 * Get current session from token
 */
export async function getSession(): Promise<AuthTokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== "refresh") return null;

  const newAccessToken = generateToken(
    { userId: payload.userId, email: payload.email },
    false
  );

  const cookieStore = await cookies();
  cookieStore.set("auth_token", newAccessToken, {
    ...COOKIE_OPTIONS,
    maxAge: JWT_EXPIRATION,
  });

  return newAccessToken;
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Deve conter letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Deve conter letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Deve conter número");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Deve conter caractere especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
