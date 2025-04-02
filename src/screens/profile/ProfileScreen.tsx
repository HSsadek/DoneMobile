import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';

type Props = DrawerScreenProps<DrawerStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
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
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john.doe@example.com</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={24} color="#666" />
                <Text style={styles.menuItemText}>Ad Soyad</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="mail-outline" size={24} color="#666" />
                <Text style={styles.menuItemText}>E-posta</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="call-outline" size={24} color="#666" />
                <Text style={styles.menuItemText}>Telefon</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İstatistikler</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Proje</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Görev</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Tamamlanma</Text>
              </View>
            </View>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen; 