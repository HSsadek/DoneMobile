import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Button, useTheme, FAB } from 'react-native-paper';
import { TeamMember, TaskStatus } from '../../types/project';
import { CustomTheme } from '../../theme';

type Props = DrawerScreenProps<DrawerStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

// Örnek proje verileri
export const sampleProjects: Array<{
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  tasks: number;
  members: number;
  startDate: string;
  endDate: string;
  team: TeamMember[];
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    assignedTo: string;
    progress: number;
  }>;
}> = [
  {
    id: '1',
    title: 'E-ticaret Uygulaması',
    description: 'Online alışveriş platformu geliştirme projesi',
    status: 'devam',
    progress: 65,
    tasks: 12,
    members: 5,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    team: [
      { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Ayşe Demir', role: 'Frontend Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Mehmet Kaya', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'Zeynep Şahin', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '5', name: 'Can Özkan', role: 'Test Mühendisi', department: 'Test' },
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
      { id: '1', name: 'Ali Yıldız', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Fatma Kaya', role: 'Mobil Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Murat Demir', role: 'Backend Geliştirici', department: 'Yazılım' },
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
      { id: '1', name: 'Ayşe Yılmaz', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Mehmet Demir', role: 'Frontend Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Can Kaya', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'Zeynep Şahin', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '5', name: 'Ali Özkan', role: 'Test Mühendisi', department: 'Test' },
      { id: '6', name: 'Fatma Yıldız', role: 'Veri Analisti', department: 'Analiz' },
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
      { id: '1', name: 'Ahmet Demir', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Ayşe Kaya', role: 'Frontend Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Mehmet Yılmaz', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'Zeynep Özkan', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '5', name: 'Can Şahin', role: 'Test Mühendisi', department: 'Test' },
      { id: '6', name: 'Ali Yıldız', role: 'DevOps Mühendisi', department: 'Operasyon' },
      { id: '7', name: 'Fatma Demir', role: 'Veri Analisti', department: 'Analiz' },
      { id: '8', name: 'Murat Kaya', role: 'Güvenlik Uzmanı', department: 'Güvenlik' },
    ],
    recentTasks: [
      { id: '1', title: 'Son kullanıcı testleri', status: 'tamamlandi', assignedTo: '5', progress: 100 },
      { id: '2', title: 'Dokümantasyon', status: 'tamamlandi', assignedTo: '7', progress: 100 },
      { id: '3', title: 'Canlıya alma', status: 'tamamlandi', assignedTo: '6', progress: 100 },
    ],
  },
  {
    id: '5',
    title: 'Akıllı Ev Otomasyonu',
    description: 'IoT tabanlı ev otomasyon sistemi',
    status: 'yapilacak' as TaskStatus,
    progress: 15,
    tasks: 18,
    members: 7,
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    team: [
      { id: '1', name: 'Emre Yıldırım', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Selin Arslan', role: 'IoT Uzmanı', department: 'IoT' },
      { id: '3', name: 'Burak Aydın', role: 'Mobil Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'Deniz Şahin', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '5', name: 'Elif Demir', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '6', name: 'Onur Kaya', role: 'Elektronik Mühendisi', department: 'Donanım' },
      { id: '7', name: 'Merve Çelik', role: 'Test Mühendisi', department: 'Test' },
    ],
    recentTasks: [
      { id: '1', title: 'Sistem mimarisi tasarımı', status: 'devam', assignedTo: '2', progress: 40 },
      { id: '2', title: 'Sensör entegrasyonu', status: 'beklemede', assignedTo: '6', progress: 0 },
      { id: '3', title: 'Mobil uygulama arayüzü', status: 'devam', assignedTo: '5', progress: 25 },
    ],
  },
  {
    id: '6',
    title: 'Online Eğitim Platformu',
    description: 'Uzaktan eğitim ve kurs yönetim sistemi',
    status: 'devam' as TaskStatus,
    progress: 45,
    tasks: 16,
    members: 6,
    startDate: '2024-02-15',
    endDate: '2024-07-30',
    team: [
      { id: '1', name: 'Canan Yılmaz', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Serkan Demir', role: 'Frontend Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Aylin Kaya', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'Tolga Şahin', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '5', name: 'Pınar Arslan', role: 'İçerik Yöneticisi', department: 'İçerik' },
      { id: '6', name: 'Mert Özkan', role: 'Test Mühendisi', department: 'Test' },
    ],
    recentTasks: [
      { id: '1', title: 'Video streaming altyapısı', status: 'devam', assignedTo: '3', progress: 60 },
      { id: '2', title: 'Kullanıcı dashboard tasarımı', status: 'tamamlandi', assignedTo: '4', progress: 100 },
      { id: '3', title: 'Ödeme sistemi entegrasyonu', status: 'beklemede', assignedTo: '2', progress: 0 },
    ],
  },
  {
    id: '7',
    title: 'Sağlık Takip Uygulaması',
    description: 'Kişisel sağlık ve fitness takip sistemi',
    status: 'test' as TaskStatus,
    progress: 75,
    tasks: 14,
    members: 5,
    startDate: '2024-01-01',
    endDate: '2024-05-30',
    team: [
      { id: '1', name: 'Berk Yıldız', role: 'Proje Yöneticisi', department: 'Yönetim' },
      { id: '2', name: 'Gamze Demir', role: 'Mobil Geliştirici', department: 'Yazılım' },
      { id: '3', name: 'Ozan Kaya', role: 'Backend Geliştirici', department: 'Yazılım' },
      { id: '4', name: 'İrem Şahin', role: 'UI/UX Tasarımcı', department: 'Tasarım' },
      { id: '5', name: 'Kemal Çelik', role: 'Sağlık Danışmanı', department: 'Sağlık' },
    ],
    recentTasks: [
      { id: '1', title: 'Fitness tracker entegrasyonu', status: 'tamamlandi', assignedTo: '2', progress: 100 },
      { id: '2', title: 'Sağlık raporu oluşturma', status: 'devam', assignedTo: '3', progress: 80 },
      { id: '3', title: 'Kullanıcı testleri', status: 'devam', assignedTo: '5', progress: 50 },
    ],
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('yapilacak');
  const theme = useTheme() as CustomTheme;

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return theme.colors.primary;
      case 'devam':
        return theme.colors.secondary;
      case 'test':
        return theme.colors.tertiary;
      case 'tamamlanan':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  const statusItems: { id: TaskStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'yapilacak', label: 'Yapılacak', icon: 'time-outline' },
    { id: 'devam', label: 'Devam Ediyor', icon: 'play-outline' },
    { id: 'test', label: 'Test Edilecek', icon: 'checkmark-circle-outline' },
    { id: 'tamamlanan', label: 'Tamamlanan', icon: 'checkmark-done-circle-outline' },
  ];

  // Projeyi bir sonraki aşamaya taşıma fonksiyonu
  const moveToNextStage = (projectId: string) => {
    const projectIndex = sampleProjects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const project = sampleProjects[projectIndex];
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
        return;
    }

    // Projeyi güncelle
    const updatedProjects = [...sampleProjects];
    updatedProjects[projectIndex] = {
      ...project,
      status: nextStatus,
    };

    // State'i güncelle
    setSelectedStatus(nextStatus);
  };

  // Projeyi bir önceki aşamaya taşıma fonksiyonu
  const moveToPreviousStage = (projectId: string) => {
    const projectIndex = sampleProjects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const project = sampleProjects[projectIndex];
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
        return;
    }

    // Projeyi güncelle
    const updatedProjects = [...sampleProjects];
    updatedProjects[projectIndex] = {
      ...project,
      status: previousStatus,
    };

    // State'i güncelle
    setSelectedStatus(previousStatus);
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

  const filteredProjects = sampleProjects.filter(project => project.status === selectedStatus);

  const handleNewProject = () => {
    navigation.navigate('NewProject');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.text === '#000000' ? 'dark' : 'light'} />
      <View style={styles.container}>
        <View style={[styles.header, { 
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border 
        }]}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu-outline" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Projelerim</Text>
          </View>
        </View>

        <View style={[styles.statusContainer, { 
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border 
        }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.statusBar}
          >
            {(['yapilacak', 'devam', 'test', 'tamamlanan'] as TaskStatus[]).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusItem,
                  { backgroundColor: theme.colors.surface },
                  selectedStatus === status && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.background },
                  selectedStatus === status && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                ]}>
                  <Ionicons
                    name={
                      status === 'yapilacak'
                        ? 'list-outline'
                        : status === 'devam'
                        ? 'time-outline'
                        : status === 'test'
                        ? 'flask-outline'
                        : 'checkmark-circle-outline'
                    }
                    size={18}
                    color={selectedStatus === status ? theme.colors.onPrimary : theme.colors.text}
                  />
                </View>
                <Text style={[
                  styles.statusText,
                  { color: theme.colors.text },
                  selectedStatus === status && { color: theme.colors.onPrimary }
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.contentContainer}>
          <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
            {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Projeler
          </Text>
          {sampleProjects.filter(project => project.status === selectedStatus).length > 0 ? (
            sampleProjects
              .filter(project => project.status === selectedStatus)
              .map(project => (
                <View key={project.id} style={[styles.projectCard, { 
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.shadow
                }]}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                  >
                    <View style={styles.projectHeader}>
                      <Text style={[styles.projectTitle, { color: theme.colors.text }]}>
                        {project.title}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                        <Text style={[styles.statusBadgeText, { color: theme.colors.onPrimary }]}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.projectDescription, { color: theme.colors.text + '99' }]}>
                      {project.description}
                    </Text>
                    <View style={styles.projectFooter}>
                      <Text style={[styles.progressText, { color: theme.colors.text + '99' }]}>
                        İlerleme ({project.progress}%)
                      </Text>
                      <View style={[styles.progressContainer, { backgroundColor: theme.colors.border }]}>
                        <View
                          style={[
                            styles.progressBar,
                            { backgroundColor: getStatusColor(project.status), width: `${project.progress}%` }
                          ]}
                        />
                      </View>
                      <View style={styles.projectStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="list-outline" size={16} color={theme.colors.text + '99'} />
                          <Text style={[styles.statText, { color: theme.colors.text + '99' }]}>
                            {project.tasks} Görev
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="people-outline" size={16} color={theme.colors.text + '99'} />
                          <Text style={[styles.statText, { color: theme.colors.text + '99' }]}>
                            {project.members} Üye
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="calendar-outline" size={16} color={theme.colors.text + '99'} />
                          <Text style={[styles.statText, { color: theme.colors.text + '99' }]}>
                            {project.endDate}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.navigationButtonsContainer}>
                        {project.status !== 'yapilacak' && (
                          <Button
                            mode="outlined"
                            style={[styles.navigationButton, { borderColor: theme.colors.primary }]}
                            contentStyle={styles.navigationButtonContent}
                            textColor={theme.colors.primary}
                            onPress={() => moveToPreviousStage(project.id)}
                          >
                            {getPreviousStageButtonText(project.status)}
                          </Button>
                        )}
                        {project.status !== 'tamamlanan' && (
                          <Button
                            mode="contained"
                            style={[styles.navigationButton, { backgroundColor: theme.colors.secondary }]}
                            contentStyle={styles.navigationButtonContent}
                            onPress={() => moveToNextStage(project.id)}
                          >
                            {getNextStageButtonText(project.status)}
                          </Button>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={48} color={theme.colors.text + '33'} />
              <Text style={[styles.emptyStateText, { color: theme.colors.text + '66' }]}>
                Bu kategoride proje bulunmuyor
              </Text>
            </View>
          )}
        </ScrollView>
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleNewProject}
          color={theme.colors.onPrimary}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    borderBottomWidth: 1,
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
    marginBottom: 4,
  },
  statusContainer: {
    borderBottomWidth: 1,
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
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  projectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  projectFooter: {
    marginTop: 8,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
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
  // nextButton stil kaldırıldı - tema rengi doğrudan kullanılıyor
  navigationButtonContent: {
    paddingVertical: 6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;