import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Divider } from 'react-native-paper';

type Props = DrawerScreenProps<DrawerStackParamList, 'Settings'>;

// Tema tipi
type ThemeType = 'light' | 'dark' | 'system';

// Bildirim ayarları tipi
type NotificationSettings = {
  projectUpdates: boolean;
  taskAssignments: boolean;
  dueDateReminders: boolean;
  emailNotifications: boolean;
};

const SettingsScreen = ({ navigation }: Props) => {
  // Tema ayarı
  const [theme, setTheme] = useState<ThemeType>('light');
  
  // Bildirim ayarları
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    projectUpdates: true,
    taskAssignments: true,
    dueDateReminders: true,
    emailNotifications: false,
  });

  // Tema değiştirme fonksiyonu
  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    // Burada tema değişikliğini uygulamaya yansıtacak kod eklenecek
  };

  // Bildirim ayarını değiştirme fonksiyonu
  const toggleNotificationSetting = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Profil bilgilerini güncelleme
  const handleUpdateProfile = () => {
    navigation.navigate('Profile');
  };

  // Şifre değiştirme
  const handleChangePassword = () => {
    Alert.alert(
      'Şifre Değiştir',
      'Şifre değiştirme işlemi için e-posta adresinize bir bağlantı gönderilecektir.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Gönder', 
          onPress: () => {
            // Şifre değiştirme e-postası gönderme işlemi
            Alert.alert('Başarılı', 'Şifre değiştirme bağlantısı e-posta adresinize gönderildi.');
          }
        }
      ]
    );
  };

  // Uygulama hakkında bilgi
  const handleAbout = () => {
    Alert.alert(
      'Uygulama Hakkında',
      'Proje Yönetim Uygulaması v1.0.0\n\nBu uygulama, projelerinizi ve görevlerinizi yönetmenize yardımcı olmak için tasarlanmıştır.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  // Gizlilik politikası
  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  // Çıkış yapma
  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            // Çıkış işlemi
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ayarlar</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genel</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Tema</Text>
              <View style={styles.themeSelector}>
                <TouchableOpacity 
                  style={[styles.themeOption, theme === 'light' && styles.themeOptionActive]}
                  onPress={() => handleThemeChange('light')}
                >
                  <Ionicons 
                    name="sunny-outline" 
                    size={20} 
                    color={theme === 'light' ? '#fff' : '#666'} 
                  />
                  <Text style={[styles.themeText, theme === 'light' && styles.themeTextActive]}>Açık</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.themeOption, theme === 'dark' && styles.themeOptionActive]}
                  onPress={() => handleThemeChange('dark')}
                >
                  <Ionicons 
                    name="moon-outline" 
                    size={20} 
                    color={theme === 'dark' ? '#fff' : '#666'} 
                  />
                  <Text style={[styles.themeText, theme === 'dark' && styles.themeTextActive]}>Koyu</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.themeOption, theme === 'system' && styles.themeOptionActive]}
                  onPress={() => handleThemeChange('system')}
                >
                  <Ionicons 
                    name="settings-outline" 
                    size={20} 
                    color={theme === 'system' ? '#fff' : '#666'} 
                  />
                  <Text style={[styles.themeText, theme === 'system' && styles.themeTextActive]}>Sistem</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Dil</Text>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>Türkçe</Text>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bildirimler</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Proje Güncellemeleri</Text>
              <Switch
                value={notificationSettings.projectUpdates}
                onValueChange={() => toggleNotificationSetting('projectUpdates')}
                trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                thumbColor={notificationSettings.projectUpdates ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Görev Atamaları</Text>
              <Switch
                value={notificationSettings.taskAssignments}
                onValueChange={() => toggleNotificationSetting('taskAssignments')}
                trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                thumbColor={notificationSettings.taskAssignments ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Son Tarih Hatırlatıcıları</Text>
              <Switch
                value={notificationSettings.dueDateReminders}
                onValueChange={() => toggleNotificationSetting('dueDateReminders')}
                trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                thumbColor={notificationSettings.dueDateReminders ? '#007AFF' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>E-posta Bildirimleri</Text>
              <Switch
                value={notificationSettings.emailNotifications}
                onValueChange={() => toggleNotificationSetting('emailNotifications')}
                trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
                thumbColor={notificationSettings.emailNotifications ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleUpdateProfile}>
              <Text style={styles.settingText}>Profil Bilgileri</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
              <Text style={styles.settingText}>Şifre Değiştir</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygulama</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
              <Text style={styles.settingText}>Hakkında</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
              <Text style={styles.settingText}>Gizlilik Politikası</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Uygulama Sürümü</Text>
              <Text style={styles.settingValueText}>1.0.0</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
  },
  themeOptionActive: {
    backgroundColor: '#007AFF',
  },
  themeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  themeTextActive: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});

export default SettingsScreen; 