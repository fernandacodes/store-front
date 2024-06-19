// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir, false caso contrário
  };
  