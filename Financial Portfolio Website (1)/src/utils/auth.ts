import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const MOCK_USER = {
  id: 'test-user-id',
  email: 'dev@example.com',
  user_metadata: { name: 'Dev User' }
};

const MOCK_SESSION = {
  access_token: 'mock-dev-token',
  user: MOCK_USER,
};

export const authService = {
  // Check if dev mode is enabled
  isDevMode() {
    return localStorage.getItem('devMode') === 'true';
  },

  // Toggle dev mode
  setDevMode(enabled: boolean) {
    if (enabled) {
      localStorage.setItem('devMode', 'true');
    } else {
      localStorage.removeItem('devMode');
    }
  },

  // Sign up new user
  async signUp(email: string, password: string, name: string) {
    if (this.isDevMode()) return { user: MOCK_USER, session: MOCK_SESSION };
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    if (this.isDevMode()) return { user: MOCK_USER, session: MOCK_SESSION, accessToken: 'mock-dev-token' };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user,
        session: data.session,
        accessToken: data.session?.access_token,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    this.setDevMode(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current session
  async getSession() {
    if (this.isDevMode()) return MOCK_SESSION as any;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  // Get current user
  async getUser() {
    if (this.isDevMode()) return MOCK_USER as any;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (session: any) => void) {
    if (this.isDevMode()) {
      callback(MOCK_SESSION);
      return { data: { subscription: { unsubscribe: () => { } } } };
    }
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },
};
