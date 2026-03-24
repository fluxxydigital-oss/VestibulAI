import { NextResponse } from "next/server";
import { ZodError } from "zod";

// =====================================================
// ERROR TYPES
// =====================================================

export class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    message: string = "Erro interno do servidor",
    public code: string = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Dados inválidos",
    public fields?: Record<string, string[]>
  ) {
    super(400, message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Não autenticado") {
    super(401, message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(403, message, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado") {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Recurso já existe") {
    super(409, message, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Muitas requisições, tente novamente mais tarde") {
    super(429, message, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

// =====================================================
// ERROR RESPONSE BUILDER
// =====================================================

interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

function buildErrorResponse(
  statusCode: number,
  code: string,
  message: string,
  fields?: Record<string, string[]>
): ErrorResponse {
  return {
    success: false,
    code,
    message,
    ...(fields && { errors: fields }),
    timestamp: new Date().toISOString(),
  };
}

// =====================================================
// ERROR HANDLER
// =====================================================

/**
 * Handle API errors and return appropriate response
 */
export function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error("API Error:", error);

  // Zod validation error
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      if (!fields[field]) {
        fields[field] = [];
      }
      fields[field].push(issue.message);
    });

    return NextResponse.json(
      buildErrorResponse(
        400,
        "VALIDATION_ERROR",
        "Validação de entrada falhou",
        fields
      ),
      { status: 400 }
    );
  }

  // Custom app error
  if (error instanceof AppError) {
    return NextResponse.json(
      buildErrorResponse(
        error.statusCode,
        error.code,
        error.message,
        error instanceof ValidationError ? error.fields : undefined
      ),
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error instanceof Error) {
    if (error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        buildErrorResponse(
          409,
          "CONFLICT",
          "Este registro já existe"
        ),
        { status: 409 }
      );
    }

    if (error.message.includes("Record to update not found")) {
      return NextResponse.json(
        buildErrorResponse(
          404,
          "NOT_FOUND",
          "Registro não encontrado"
        ),
        { status: 404 }
      );
    }
  }

  // Unknown error
  return NextResponse.json(
    buildErrorResponse(
      500,
      "INTERNAL_SERVER_ERROR",
      "Erro interno do servidor"
    ),
    { status: 500 }
  );
}

// =====================================================
// SUCCESS RESPONSE BUILDER
// =====================================================

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export function buildSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(buildSuccessResponse(data), { status: statusCode });
}

// =====================================================
// COMMON ERROR THROWERS
// =====================================================

export function throwValidationError(
  message: string,
  fields?: Record<string, string[]>
): never {
  throw new ValidationError(message, fields);
}

export function throwAuthenticationError(message?: string): never {
  throw new AuthenticationError(message);
}

export function throwAuthorizationError(message?: string): never {
  throw new AuthorizationError(message);
}

export function throwNotFoundError(message?: string): never {
  throw new NotFoundError(message);
}

export function throwConflictError(message?: string): never {
  throw new ConflictError(message);
}
