import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'auth';
const USER_KEY = 'user';

// Mock user credentials for demo purposes
const MOCK_USERS = [
  {
    email: 'teacher@example.com',
    password: 'password123',
    name: 'Teacher',
  },
];

class AuthService {
  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const auth = await AsyncStorage.getItem(STORAGE_KEY);
      return !!auth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Log in a user
   */
  async login(email: string, password: string, rememberMe: boolean): Promise<boolean> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Store auth token
        await AsyncStorage.setItem(STORAGE_KEY, 'mock-auth-token');
        
        // Store user info
        const userData = {
          email: user.email,
          name: user.name,
        };
        
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        return false;
      }
      
      // In a real app, we would add the user to the database
      // For this demo, we'll just pretend it worked
      
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export default new AuthService();