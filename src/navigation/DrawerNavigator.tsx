import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import HomeScreen from '../screens/home/HomeScreen';
import ProjectDetailScreen from '../screens/project/ProjectDetailScreen';
import EditProjectScreen from '../screens/project/EditProjectScreen';
import NewProjectScreen from '../screens/project/NewProjectScreen';
import HelpScreen from '../screens/help/HelpScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';
import SettingsStack from './StackNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import type { DrawerStackParamList } from './types';
import { CustomTheme } from '../theme';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const theme = useTheme() as CustomTheme;

  return (
    <SafeAreaView style={[styles.drawerContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.drawerHeader, { 
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface
      }]}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="person" size={32} color={theme.colors.onPrimary} />
            </View>
            <View style={[styles.onlineIndicator, { borderColor: theme.colors.background }]} />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>Kullanıcı Adı</Text>
            <Text style={[styles.userEmail, { color: theme.colors.text + '99' }]}>kullanici@email.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.drawerContent}>
        {props.state.routes.map((route, index) => {
          // Gizli ekranları atlayalım
          if (route.name === 'ProjectDetail' || route.name === 'EditProject' || 
              route.name === 'NewProject' || route.name === 'Logout') {
            return null;
          }

          const isFocused = props.state.index === index;
          let iconName: any = 'home-outline';
          let label = '';

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              label = 'Projelerim';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              label = 'Ayarlar';
              break;
            case 'Profile':
              iconName = 'person-outline';
              label = 'Profil';
              break;
            case 'Help':
              iconName = 'help-circle-outline';
              label = 'Yardım';
              break;
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.drawerItem,
                isFocused && { backgroundColor: theme.colors.primary + '20' }
              ]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              <View style={[
                styles.iconContainer,
                isFocused && { backgroundColor: theme.colors.primary + '20' }
              ]}>
                <Ionicons 
                  name={iconName}
                  size={22}
                  color={isFocused ? theme.colors.primary : theme.colors.text + '99'}
                />
              </View>
              <Text style={[
                styles.drawerItemText,
                { color: theme.colors.text + '99' },
                isFocused && { color: theme.colors.primary, fontWeight: '600' }
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => props.navigation.navigate('Logout')}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>
              Çıkış Yap
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  const theme = useTheme() as CustomTheme;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: false
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          swipeEnabled: true
        }}
      />
      <Drawer.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen 
        name="EditProject" 
        component={EditProjectScreen as any}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen 
        name="NewProject" 
        component={NewProjectScreen}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{
          swipeEnabled: true
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          swipeEnabled: true
        }}
      />
      <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          swipeEnabled: true
        }}
      />
      <Drawer.Screen 
        name="Logout" 
        component={LogoutScreen as any}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
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
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  drawerDivider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
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
    marginLeft: 12,
  },
});

export default DrawerNavigator;