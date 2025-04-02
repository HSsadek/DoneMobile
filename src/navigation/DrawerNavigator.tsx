import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
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
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>Kullanıcı Adı</Text>
            <Text style={styles.userEmail}>kullanici@email.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.drawerContent}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Projelerim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('NewProject')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Yeni Proje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Ayarlar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Help')}
        >
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Yardım</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Logout')}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default DrawerNavigator; 