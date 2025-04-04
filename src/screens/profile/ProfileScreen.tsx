import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Avatar, TextInput, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { DrawerStackParamList } from '../../navigation/types';
import { CustomTheme } from '../../theme';

type Props = DrawerScreenProps<DrawerStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation, route }: Props) => {
  const theme = useTheme() as CustomTheme;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+90 555 123 4567');
  const [role, setRole] = useState('Proje Yöneticisi');
  const [image, setImage] = useState<string | null>(null);

  // Sayfadan çıkıldığında düzenleme modunu kapat
  useFocusEffect(
    React.useCallback(() => {
      // Sayfa odağı kaybedildiğinde çalışacak
      return () => {
        setIsEditing(false);
      };
    }, [])
  );

  const handleBack = () => {
    // Geri tuşuna basıldığında düzenleme modunu kapat
    setIsEditing(false);
    if (route.params?.from === 'settings') {
      navigation.navigate('Settings');
    } else {
      navigation.goBack();
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Burada profil bilgilerini kaydetme işlemi yapılabilir
      // API çağrısı vb.
    }
    setIsEditing(!isEditing);
  };

  const pickImage = async () => {
    try {
      // Kamera izni iste
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Fotoğraf seçmek için galeri iznine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return;
      }

      // Galeriyi aç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Hata',
        'Fotoğraf seçilirken bir hata oluştu.',
        [{ text: 'Tamam' }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        marginTop: 24,
        marginHorizontal: 16,
        borderRadius: 12,
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text variant="titleLarge" style={[styles.title, { color: theme.colors.text }]}>
          Profil
        </Text>
        <IconButton
          icon={isEditing ? "check" : "pencil"}
          iconColor={theme.colors.primary}
          size={24}
          onPress={handleEdit}
        />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={
                image 
                  ? { uri: image }
                  : { uri: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random` }
              }
            />
            {isEditing && (
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary }]}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={20} color={theme.colors.onPrimary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Ad Soyad</Text>
              {isEditing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                />
              ) : (
                <Text variant="bodyLarge" style={{ color: theme.colors.text }}>{name}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>E-posta</Text>
              {isEditing ? (
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  style={styles.input}
                />
              ) : (
                <Text variant="bodyLarge" style={{ color: theme.colors.text }}>{email}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Telefon</Text>
              {isEditing ? (
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              ) : (
                <Text variant="bodyLarge" style={{ color: theme.colors.text }}>{phone}</Text>
              )}
            </View>

            <View style={styles.infoItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>Pozisyon</Text>
              {isEditing ? (
                <TextInput
                  value={role}
                  onChangeText={setRole}
                  mode="outlined"
                  style={styles.input}
                />
              ) : (
                <Text variant="bodyLarge" style={{ color: theme.colors.text }}>{role}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    marginLeft: 16,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '30%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  infoSection: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    gap: 24,
  },
  infoItem: {
    gap: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default ProfileScreen;