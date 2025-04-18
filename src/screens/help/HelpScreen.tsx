import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Text, useTheme } from 'react-native-paper';

type Props = DrawerScreenProps<DrawerStackParamList, 'Help'>;

const HelpScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yardım</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Proje nasıl oluşturulur?</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Görev ataması nasıl yapılır?</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Proje durumu nasıl güncellenir?</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim</Text>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactItemLeft}>
                <Ionicons name="mail-outline" size={24} color="#666" />
                <Text style={styles.contactItemText}>E-posta Desteği</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <View style={styles.contactItemLeft}>
                <Ionicons name="call-outline" size={24} color="#666" />
                <Text style={styles.contactItemText}>Telefon Desteği</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diğer</Text>
            <TouchableOpacity style={styles.otherItem}>
              <View style={styles.otherItemLeft}>
                <Ionicons name="document-text-outline" size={24} color="#666" />
                <Text style={styles.otherItemText}>Kullanım Kılavuzu</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.otherItem}>
              <View style={styles.otherItemLeft}>
                <Ionicons name="information-circle-outline" size={24} color="#666" />
                <Text style={styles.otherItemText}>Hakkında</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    borderBottomColor: theme.colors.surfaceVariant,
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: 15,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  faqQuestion: {
    fontSize: 16,
    color: theme.colors.onBackground,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItemText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    marginLeft: 15,
  },
  otherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  otherItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherItemText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    marginLeft: 15,
  },
});

export default HelpScreen; 