import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Button } from 'react-native-paper';

type Props = DrawerScreenProps<DrawerStackParamList, 'Home'>;

export type TaskStatus = 'yapilacak' | 'devam' | 'test' | 'tamamlanan';

const { width } = Dimensions.get('window');

// Örnek proje verileri
export const sampleProjects = [
  {
    id: '1',
    title: 'E-ticaret Uygulaması',
    description: 'Online alışveriş platformu geliştirme projesi',
    status: 'devam' as TaskStatus,
    progress: 65,
    tasks: 12,
    members: 5,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    team: [
      { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi' },
      { id: '2', name: 'Ayşe Demir', role: 'Frontend Geliştirici' },
      { id: '3', name: 'Mehmet Kaya', role: 'Backend Geliştirici' },
      { id: '4', name: 'Zeynep Şahin', role: 'UI/UX Tasarımcı' },
      { id: '5', name: 'Can Özkan', role: 'Test Mühendisi' },
    ],
    recentTasks: [
      { id: '1', title: 'Kullanıcı arayüzü tasarımı', status: 'tamamlandi', assignedTo: '4', progress: 100 },
      { id: '2', title: 'Veritabanı şeması oluşturma', status: 'devam', assignedTo: '3', progress: 75 },
      { id: '3', title: 'API entegrasyonu', status: 'beklemede', assignedTo: '2', progress: 0 },
    ],
  },
  {
    id: '2',
    title: 'Mobil Bankacılık',
    description: 'Finansal işlemler için mobil uygulama',
    status: 'yapilacak' as TaskStatus,
    progress: 0,
    tasks: 8,
    members: 3,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    team: [
      { id: '1', name: 'Ali Yıldız', role: 'Proje Yöneticisi' },
      { id: '2', name: 'Fatma Kaya', role: 'Mobil Geliştirici' },
      { id: '3', name: 'Murat Demir', role: 'Backend Geliştirici' },
    ],
    recentTasks: [
      { id: '1', title: 'Proje planlaması', status: 'beklemede', assignedTo: '1', progress: 0 },
      { id: '2', title: 'Tasarım dokümanı', status: 'beklemede', assignedTo: '2', progress: 0 },
    ],
  },
  {
    id: '3',
    title: 'CRM Sistemi',
    description: 'Müşteri ilişkileri yönetim sistemi',
    status: 'test' as TaskStatus,
    progress: 85,
    tasks: 15,
    members: 6,
    startDate: '2023-11-01',
    endDate: '2024-03-30',
    team: [
      { id: '1', name: 'Ayşe Yılmaz', role: 'Proje Yöneticisi' },
      { id: '2', name: 'Mehmet Demir', role: 'Frontend Geliştirici' },
      { id: '3', name: 'Can Kaya', role: 'Backend Geliştirici' },
      { id: '4', name: 'Zeynep Şahin', role: 'UI/UX Tasarımcı' },
      { id: '5', name: 'Ali Özkan', role: 'Test Mühendisi' },
      { id: '6', name: 'Fatma Yıldız', role: 'Veri Analisti' },
    ],
    recentTasks: [
      { id: '1', title: 'Kullanıcı testleri', status: 'devam', assignedTo: '5', progress: 60 },
      { id: '2', title: 'Performans optimizasyonu', status: 'devam', assignedTo: '3', progress: 45 },
      { id: '3', title: 'Hata düzeltmeleri', status: 'tamamlandi', assignedTo: '2', progress: 100 },
    ],
  },
  {
    id: '4',
    title: 'Sosyal Medya Platformu',
    description: 'Yeni nesil sosyal medya uygulaması',
    status: 'tamamlanan' as TaskStatus,
    progress: 100,
    tasks: 20,
    members: 8,
    startDate: '2023-06-01',
    endDate: '2024-01-15',
    team: [
      { id: '1', name: 'Ahmet Demir', role: 'Proje Yöneticisi' },
      { id: '2', name: 'Ayşe Kaya', role: 'Frontend Geliştirici' },
      { id: '3', name: 'Mehmet Yılmaz', role: 'Backend Geliştirici' },
      { id: '4', name: 'Zeynep Özkan', role: 'UI/UX Tasarımcı' },
      { id: '5', name: 'Can Şahin', role: 'Test Mühendisi' },
      { id: '6', name: 'Ali Yıldız', role: 'DevOps Mühendisi' },
      { id: '7', name: 'Fatma Demir', role: 'Veri Analisti' },
      { id: '8', name: 'Murat Kaya', role: 'Güvenlik Uzmanı' },
    ],
    recentTasks: [
      { id: '1', title: 'Son kullanıcı testleri', status: 'tamamlandi', assignedTo: '5', progress: 100 },
      { id: '2', title: 'Dokümantasyon', status: 'tamamlandi', assignedTo: '7', progress: 100 },
      { id: '3', title: 'Canlıya alma', status: 'tamamlandi', assignedTo: '6', progress: 100 },
    ],
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>('yapilacak');
  const [projects, setProjects] = useState(sampleProjects);

  const statusItems: { id: TaskStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'yapilacak', label: 'Yapılacak', icon: 'time-outline' },
    { id: 'devam', label: 'Devam Ediyor', icon: 'play-outline' },
    { id: 'test', label: 'Test Edilecek', icon: 'checkmark-circle-outline' },
    { id: 'tamamlanan', label: 'Tamamlanan', icon: 'checkmark-done-circle-outline' },
  ];

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return '#FF9500';
      case 'devam':
        return '#007AFF';
      case 'test':
        return '#5856D6';
      case 'tamamlanan':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  // Projeyi bir sonraki aşamaya taşıma fonksiyonu
  const moveToNextStage = (projectId: string) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const project = projects[projectIndex];
    let nextStatus: TaskStatus;

    // Mevcut duruma göre bir sonraki durumu belirle
    switch (project.status) {
      case 'yapilacak':
        nextStatus = 'devam';
        break;
      case 'devam':
        nextStatus = 'test';
        break;
      case 'test':
        nextStatus = 'tamamlanan';
        break;
      default:
        return; // Tamamlanan projeler için bir sonraki aşama yok
    }

    // Projeyi güncelle
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = {
      ...project,
      status: nextStatus,
    };

    setProjects(updatedProjects);
  };

  // Projeyi bir önceki aşamaya taşıma fonksiyonu
  const moveToPreviousStage = (projectId: string) => {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const project = projects[projectIndex];
    let previousStatus: TaskStatus;

    // Mevcut duruma göre bir önceki durumu belirle
    switch (project.status) {
      case 'tamamlanan':
        previousStatus = 'test';
        break;
      case 'test':
        previousStatus = 'devam';
        break;
      case 'devam':
        previousStatus = 'yapilacak';
        break;
      default:
        return; // Yapılacak projeler için bir önceki aşama yok
    }

    // Projeyi güncelle
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = {
      ...project,
      status: previousStatus,
    };

    setProjects(updatedProjects);
  };

  // Bir sonraki aşama butonunun metnini belirle
  const getNextStageButtonText = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return 'Devam Et';
      case 'devam':
        return 'Test Et';
      case 'test':
        return 'Tamamla';
      default:
        return '';
    }
  };

  // Bir önceki aşama butonunun metnini belirle
  const getPreviousStageButtonText = (status: TaskStatus) => {
    switch (status) {
      case 'tamamlanan':
        return 'Test Et';
      case 'test':
        return 'Devam Et';
      case 'devam':
        return 'Yapılacak';
      default:
        return '';
    }
  };

  const filteredProjects = projects.filter(project => project.status === activeStatus);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Projelerim</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusBar}
          >
            {statusItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.statusItem,
                  activeStatus === item.id && styles.statusItemActive
                ]}
                onPress={() => setActiveStatus(item.id)}
              >
                <View style={[
                  styles.iconContainer,
                  activeStatus === item.id && styles.iconContainerActive
                ]}>
                  <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={activeStatus === item.id ? '#fff' : '#007AFF'} 
                  />
                </View>
                <Text style={[
                  styles.statusText,
                  activeStatus === item.id && styles.statusTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.contentContainer}>
          <Text style={styles.contentTitle}>
            {statusItems.find(item => item.id === activeStatus)?.label} Görevler
          </Text>
          
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                >
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                      <Text style={styles.statusBadgeText}>
                        {statusItems.find(item => item.id === project.status)?.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.projectDescription}>{project.description}</Text>
                  <View style={styles.projectFooter}>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: `${project.progress}%` }]} />
                      <Text style={styles.progressText}>{project.progress}%</Text>
                    </View>
                    <View style={styles.projectStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="list-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{project.tasks} Görev</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{project.members} Üye</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <View style={styles.navigationButtonsContainer}>
                  {project.status !== 'yapilacak' && (
                    <Button 
                      mode="outlined" 
                      onPress={() => moveToPreviousStage(project.id)}
                      style={styles.navigationButton}
                      contentStyle={styles.navigationButtonContent}
                      icon={({ size, color }) => (
                        <Ionicons name="arrow-back" size={size} color={color} />
                      )}
                    >
                      {getPreviousStageButtonText(project.status)}
                    </Button>
                  )}
                  
                  {project.status !== 'tamamlanan' && (
                    <Button 
                      mode="contained" 
                      onPress={() => moveToNextStage(project.id)}
                      style={[styles.navigationButton, styles.nextButton]}
                      contentStyle={styles.navigationButtonContent}
                      icon={({ size, color }) => (
                        <Ionicons name="arrow-forward" size={size} color={color} />
                      )}
                    >
                      {getNextStageButtonText(project.status)}
                    </Button>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Bu kategoride proje bulunmuyor</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButton: {
    marginRight: 15,
    padding: 5,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
  },
  statusItemActive: {
    backgroundColor: '#007AFF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  statusTextActive: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectFooter: {
    marginTop: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  navigationButton: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  navigationButtonContent: {
    paddingVertical: 6,
  },
});

export default HomeScreen; 