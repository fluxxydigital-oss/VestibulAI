import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  exam?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string; // Kept for backwards compatibility
  message?: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  targetCourse?: string;
  targetDate?: string;
  phone?: string;
  birthDate?: string;
  plan?: 'FREE' | 'PRO' | 'PREMIUM';
  xp?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// =====================================================
// AUTHENTICATION HOOKS
// =====================================================

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      const result: ApiResponse<{user: User}> = await response.json();

      if (result.success && result.data && result.data.user) {
        setUser(result.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, targetCourse: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword: password, targetCourse }),
      });

      const result: ApiResponse<AuthResponse> = await response.json();

      if (result.success && result.data) {
        setUser(result.data.user);
        return true;
      } else {
        // Extract specific validation messages from Zod formatting
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join(' | ');
          setError(errorMessages);
        } else if (result.message) {
          setError(result.message);
        } else {
          setError(result.error || 'Erro ao criar conta');
        }
        return false;
      }
    } catch (err) {
      setError('Erro de conexão ao criar conta');
      console.error('Registration failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result: ApiResponse<AuthResponse> = await response.json();

      if (result.success && result.data) {
        setUser(result.data.user);
        return true;
      } else {
        setError(result.message || result.error || 'Erro no login');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Login failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        setUser(null);
        return true;
      } else {
        setError(result.error || 'Erro no logout');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Logout failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };
}

// =====================================================
// QUESTIONS HOOKS
// =====================================================

export function useQuestions(filters?: {
  subject?: string;
  difficulty?: string;
  exam?: string;
  limit?: number;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.subject) params.append('subject', filters.subject);
        if (filters?.difficulty) params.append('difficulty', filters.difficulty);
        if (filters?.exam) params.append('exam', filters.exam);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(`/api/questions?${params.toString()}`);
        const result: ApiResponse<Question[]> = await response.json();

        if (result.success && result.data) {
          setQuestions(result.data);
        } else {
          setError(result.error || 'Erro ao carregar questões');
        }
      } catch (err) {
        setError('Erro de conexão');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters?.subject, filters?.difficulty, filters?.exam, filters?.limit]);

  return { questions, loading, error, refetch: () => {
    setLoading(true);
    // Re-trigger the effect by updating a dependency
    setQuestions([]);
  }};
}

export function useSubmitAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async (questionId: string, answer: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });

      const result: ApiResponse<{ correct: boolean; xpGained: number; explanation: string }> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Erro ao enviar resposta');
        return null;
      }
    } catch (err) {
      setError('Erro de conexão');
      console.error('Error submitting answer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitAnswer, loading, error };
}