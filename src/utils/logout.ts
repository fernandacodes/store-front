// src/utils/logout.ts
import router from "@/router/route";
export function logout() {
  localStorage.removeItem('token');
  router.push('/login');
}
