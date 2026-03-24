import { NextRequest } from "next/server";
import { clearAuthCookies, getSession } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";

/**
 * POST /api/auth/logout
 * Clear authentication cookies and end session
 */
export async function POST(request: NextRequest) {
  try {
    // Clear cookies regardless of session state to ensure user is logged out.
    await clearAuthCookies();

    // Return success response
    return successResponse({ message: "Logout realizado com sucesso" }, 200);
  } catch (error) {
    return handleError(error);
  }
}
