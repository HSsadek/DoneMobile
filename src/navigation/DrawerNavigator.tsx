import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import ProjectDetailScreen from '../screens/project/ProjectDetailScreen';
import EditProjectScreen from '../screens/project/EditProjectScreen';
import NewProjectScreen from '../screens/project/NewProjectScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import HelpScreen from '../screens/help/HelpScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';
import type { DrawerStackParamList } from './types';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const CustomDrawerContent = (props: any) => {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>Kullanıcı Adı</Text>
            <Text style={styles.userEmail}>kullanici@email.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.drawerContent}>
        <TouchableOpacity
          style={[styles.drawerItem, props.state.index === 0 && styles.drawerItemActive]}
          onPress={() => props.navigation.navigate('Home')}
        >
          <View style={[styles.iconContainer, props.state.index === 0 && styles.iconContainerActive]}>
            <Ionicons 
              name="home-outline" 
              size={22} 
              color={props.state.index === 0 ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.drawerItemText, props.state.index === 0 && styles.drawerItemTextActive]}>
            Projelerim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.drawerItem, props.state.index === 3 && styles.drawerItemActive]}
          onPress={() => props.navigation.navigate('NewProject')}
        >
          <View style={[styles.iconContainer, props.state.index === 3 && styles.iconContainerActive]}>
            <Ionicons 
              name="add-circle-outline" 
              size={22} 
              color={props.state.index === 3 ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.drawerItemText, props.state.index === 3 && styles.drawerItemTextActive]}>
            Yeni Proje
          </Text>
        </TouchableOpacity>

        <View style={styles.drawerDivider} />

        <TouchableOpacity
          style={[styles.drawerItem, props.state.index === 4 && styles.drawerItemActive]}
          onPress={() => props.navigation.navigate('Settings')}
        >
          <View style={[styles.iconContainer, props.state.index === 4 && styles.iconContainerActive]}>
            <Ionicons 
              name="settings-outline" 
              size={22} 
              color={props.state.index === 4 ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.drawerItemText, props.state.index === 4 && styles.drawerItemTextActive]}>
            Ayarlar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.drawerItem, props.state.index === 5 && styles.drawerItemActive]}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <View style={[styles.iconContainer, props.state.index === 5 && styles.iconContainerActive]}>
            <Ionicons 
              name="person-outline" 
              size={22} 
              color={props.state.index === 5 ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.drawerItemText, props.state.index === 5 && styles.drawerItemTextActive]}>
            Profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.drawerItem, props.state.index === 6 && styles.drawerItemActive]}
          onPress={() => props.navigation.navigate('Help')}
        >
          <View style={[styles.iconContainer, props.state.index === 6 && styles.iconContainerActive]}>
            <Ionicons 
              name="help-circle-outline" 
              size={22} 
              color={props.state.index === 6 ? '#007AFF' : '#666'} 
            />
          </View>
          <Text style={[styles.drawerItemText, props.state.index === 6 && styles.drawerItemTextActive]}>
            Yardım
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => props.navigation.navigate('Logout')}
      >
        <View style={styles.logoutContent}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '80%',
          backgroundColor: '#fff',
        },
        drawerLabelStyle: {
          fontSize: 16,
          color: '#333',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen as any}
        options={{
          drawerItemStyle: { display: 'none' },
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen 
        name="EditProject" 
        component={EditProjectScreen as any}
        options={{
          drawerItemStyle: { display: 'none' },
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen 
        name="NewProject" 
        component={NewProjectScreen as any}
        options={{
          drawerItemStyle: { display: 'none' },
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen as any} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: '#f0f8ff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  iconContainerActive: {
    backgroundColor: '#e6f2ff',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
    overflow: 'hidden',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 12,
  },
});

export default DrawerNavigator; 