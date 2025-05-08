import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import AuthService from '@/services/AuthService';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation values
  const logoScale = React.useRef(new Animated.Value(0)).current;
  const formOpacity = React.useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      
      // Start animations
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded, fontError, logoScale, formOpacity]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Basic validation
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }
      
      // Call login service
      const loggedIn = await AuthService.login(email, password, rememberMe);
      
      if (loggedIn) {
        router.replace('/(tabs)');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
          <Bell color="#7B2CBF" size={64} strokeWidth={1.5} />
          <Text style={styles.appTitle}>ClassAlarm</Text>
          <Text style={styles.appSubtitle}>Smart Scheduling for Teachers</Text>
        </Animated.View>
        
        <Animated.View style={[styles.formContainer, { opacity: formOpacity }]}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
          
          <View style={styles.rememberContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#ccc', true: '#7B2CBF' }}
              thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1a1a1a',
    marginTop: 16,
  },
  appSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: '#FEECEC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberText: {
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  loginButton: {
    backgroundColor: '#7B2CBF',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Inter-Bold',
    color: '#7B2CBF',
    fontSize: 14,
  },
});