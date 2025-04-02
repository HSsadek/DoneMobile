import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';

type Props = DrawerScreenProps<DrawerStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
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

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genel</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Bildirimler</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Tema</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Profil Bilgileri</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Şifre Değiştir</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygulama</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Hakkında</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Gizlilik Politikası</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
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
});

export default SettingsScreen; 