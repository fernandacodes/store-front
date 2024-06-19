// src/utils/logout.ts
import router from "@/router/route";
export async function logout() {
  localStorage.removeItem('token');
  setTimeout(() => {
     router.push('/login');
  }, 3000);
}
