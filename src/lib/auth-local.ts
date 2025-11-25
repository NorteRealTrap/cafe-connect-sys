export const DEMO_USERS = {
  'admin@cafeconnect.com': {
    password: 'admintester12345',
    role: 'admin'
  }
};

export function authenticateLocal(email: string, password: string, role: string) {
  const user = DEMO_USERS[email.toLowerCase()];
  
  if (!user || user.password !== password || user.role !== role) {
    return { success: false, error: 'Credenciais inválidas' };
  }
  
  return {
    success: true,
    user: { email, role },
    token: 'demo-token-' + Date.now()
  };
}
