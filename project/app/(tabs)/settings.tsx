import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut, Bell, ExternalLink, Mail, User, Volume2, Vibrate as Vibration } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import AuthService from '@/services/AuthService';

export default function Settings() {
  const router = useRouter();
  const { isDark, toggleTheme, theme } = useTheme();
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [earlyNotifications, setEarlyNotifications] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            await AuthService.logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };
  
  const openHelp = () => {
    Linking.openURL('https://example.com/help');
  };
  
  const contactSupport = () => {
    Linking.openURL('mailto:support@example.com');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { backgroundColor: '#7B2CBF' }]}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>Teacher</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
              teacher@example.com
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              {isDark ? <Moon size={20} color={theme.text} /> : <Sun size={20} color={theme.text} />}
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.switchTrack, true: '#7B2CBF' }}
              thumbColor={isDark ? '#fff' : theme.switchThumb}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Early Notifications</Text>
            </View>
            <Switch
              value={earlyNotifications}
              onValueChange={setEarlyNotifications}
              trackColor={{ false: theme.switchTrack, true: '#7B2CBF' }}
              thumbColor={earlyNotifications ? '#fff' : theme.switchThumb}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Volume2 size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Sound Alerts</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.switchTrack, true: '#7B2CBF' }}
              thumbColor={soundEnabled ? '#fff' : theme.switchThumb}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Vibration size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Vibration</Text>
            </View>
            <Switch
              value={vibrateEnabled}
              onValueChange={setVibrateEnabled}
              trackColor={{ false: theme.switchTrack, true: '#7B2CBF' }}
              thumbColor={vibrateEnabled ? '#fff' : theme.switchThumb}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={() => {}}
          >
            <View style={styles.settingInfo}>
              <User size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Edit Profile</Text>
            </View>
            <ExternalLink size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={openHelp}
          >
            <View style={styles.settingInfo}>
              <ExternalLink size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Help & Support</Text>
            </View>
            <ExternalLink size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={contactSupport}
          >
            <View style={styles.settingInfo}>
              <Mail size={20} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Contact Us</Text>
            </View>
            <ExternalLink size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontSize: 24,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutText: {
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});