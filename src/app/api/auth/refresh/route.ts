import { NextRequest } from "next/server";
import { refreshAccessToken, getRefreshToken } from "@/lib/auth";
import {
  handleError,
  successResponse,
  throwAuthenticationError,
} from "@/lib/api-error";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ Verify refresh token exists
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throwAuthenticationError("Refresh token não encontrado");
    }

    // ✅ Refresh the access token
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throwAuthenticationError("Falha ao renovar token");
    }

    // ✅ Return success response with new access token
    return successResponse({ accessToken: newAccessToken }, 200);
  } catch (error) {
    return handleError(error);
  }
}
