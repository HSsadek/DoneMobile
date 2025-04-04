import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch, ScrollView, Alert, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Divider, useTheme } from 'react-native-paper';
import { ThemeContext } from '../../../App';
import { CustomTheme } from '../../theme';

type Props = DrawerScreenProps<DrawerStackParamList, 'Settings'>;

// Dil tipi
type LanguageType = 'tr' | 'en';

// Bildirim ayarları tipi
type NotificationSettings = {
  projectUpdates: boolean;
  taskAssignments: boolean;
  dueDateReminders: boolean;
  emailNotifications: boolean;
};

const SettingsScreen = ({ navigation }: Props) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const paperTheme = useTheme() as CustomTheme;
  
  // Dil ayarı
  const [language, setLanguage] = useState<LanguageType>('tr');
  
  // Dil seçeneklerinin görünürlüğü
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  
  // Bildirim ayarları
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    projectUpdates: true,
    taskAssignments: true,
    dueDateReminders: true,
    emailNotifications: false,
  });

  // Tema değiştirme fonksiyonu
  const handleThemeChange = () => {
    toggleTheme();
  };

  // Dil değiştirme fonksiyonu
  const handleLanguageChange = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    setShowLanguageOptions(false);
    // Burada dil değişikliğini uygulamaya yansıtacak kod eklenecek
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
    navigation.navigate('Profile', { from: 'settings' });
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: paperTheme.colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={24} color={paperTheme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: paperTheme.colors.text }]}>Ayarlar</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Tema Ayarları */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>Görünüm</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Tema</Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleThemeChange}
                trackColor={{ false: '#767577', true: paperTheme.colors.primary }}
                thumbColor={theme === 'dark' ? paperTheme.colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>Genel</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="language-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Dil</Text>
              </View>
              <TouchableOpacity 
                style={styles.languageSelector}
                onPress={() => setShowLanguageOptions(!showLanguageOptions)}
              >
                <Text style={styles.languageText}>
                  {language === 'tr' ? 'Türkçe' : 'English'}
                </Text>
                <Ionicons 
                  name={showLanguageOptions ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={paperTheme.colors.text} 
                />
              </TouchableOpacity>
            </View>
            
            {showLanguageOptions && (
              <View style={styles.languageOptionsContainer}>
                <TouchableOpacity 
                  style={[styles.languageOption, language === 'tr' && styles.languageOptionActive]}
                  onPress={() => handleLanguageChange('tr')}
                >
                  <Text style={[styles.languageOptionText, language === 'tr' && styles.languageOptionTextActive]}>
                    Türkçe
                  </Text>
                  {language === 'tr' && (
                    <Ionicons name="checkmark" size={20} color={paperTheme.colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.languageOption, language === 'en' && styles.languageOptionActive]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextActive]}>
                    English
                  </Text>
                  {language === 'en' && (
                    <Ionicons name="checkmark" size={20} color={paperTheme.colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>Bildirimler</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="notifications-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Proje Güncellemeleri</Text>
              </View>
              <Switch
                value={notificationSettings.projectUpdates}
                onValueChange={() => toggleNotificationSetting('projectUpdates')}
                trackColor={{ false: '#767577', true: paperTheme.colors.primary }}
                thumbColor={notificationSettings.projectUpdates ? paperTheme.colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="person-add-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Görev Atamaları</Text>
              </View>
              <Switch
                value={notificationSettings.taskAssignments}
                onValueChange={() => toggleNotificationSetting('taskAssignments')}
                trackColor={{ false: '#767577', true: paperTheme.colors.primary }}
                thumbColor={notificationSettings.taskAssignments ? paperTheme.colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="calendar-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Son Tarih Hatırlatıcıları</Text>
              </View>
              <Switch
                value={notificationSettings.dueDateReminders}
                onValueChange={() => toggleNotificationSetting('dueDateReminders')}
                trackColor={{ false: '#767577', true: paperTheme.colors.primary }}
                thumbColor={notificationSettings.dueDateReminders ? paperTheme.colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="mail-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>E-posta Bildirimleri</Text>
              </View>
              <Switch
                value={notificationSettings.emailNotifications}
                onValueChange={() => toggleNotificationSetting('emailNotifications')}
                trackColor={{ false: '#767577', true: paperTheme.colors.primary }}
                thumbColor={notificationSettings.emailNotifications ? paperTheme.colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>Hesap</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleUpdateProfile}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="person-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Profil Bilgileri</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={paperTheme.colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem} 
              onPress={handleChangePassword}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Şifre Değiştir</Text>
                  <Text style={styles.settingSubtext}>Son değişiklik: 3 ay önce</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={paperTheme.colors.text} />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.text }]}>Uygulama</Text>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="information-circle-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Hakkında</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={paperTheme.colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Gizlilik Politikası</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={paperTheme.colors.text} />
            </TouchableOpacity>
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={[styles.settingIconContainer, { backgroundColor: paperTheme.colors.primary + '20' }]}>
                  <Ionicons name="code-slash-outline" size={20} color={paperTheme.colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: paperTheme.colors.text }]}>Uygulama Sürümü</Text>
              </View>
              <Text style={styles.settingValueText}>1.0.0</Text>
            </View>
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
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
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
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    marginRight: 8,
  },
  languageOptionsContainer: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageOptionActive: {
    backgroundColor: '#f0f8ff',
  },
  languageOptionText: {
    fontSize: 16,
  },
  languageOptionTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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