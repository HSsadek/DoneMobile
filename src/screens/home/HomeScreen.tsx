import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { Button, useTheme, FAB } from 'react-native-paper';
import { TeamMember, TaskStatus } from '../../types/project';
import { CustomTheme } from '../../theme';
import { useProjects, Project } from '../../context/ProjectContext';

type Props = DrawerScreenProps<DrawerStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: Props) => {
  const { projects, moveProjectToNextStage, moveProjectToPreviousStage } = useProjects();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const theme = useTheme() as CustomTheme;

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Durum renklerini belirle
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return '#f59e0b'; // amber
      case 'devam':
        return '#3b82f6'; // blue
      case 'test':
        return '#8b5cf6'; // violet
      case 'tamamlanan':
        return '#10b981'; // emerald
      default:
        return '#6b7280'; // gray
    }
  };

  // Durum metinlerini belirle
  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return 'Yapılacak';
      case 'devam':
        return 'Devam Ediyor';
      case 'test':
        return 'Test';
      case 'tamamlanan':
        return 'Tamamlandı';
      default:
        return '';
    }
  };

  // Projeyi bir sonraki aşamaya taşıma fonksiyonu
  const moveToNextStage = (projectId: string) => {
    moveProjectToNextStage(projectId);
  };

  // Projeyi bir önceki aşamaya taşıma fonksiyonu
  const moveToPreviousStage = (projectId: string) => {
    moveProjectToPreviousStage(projectId);
  };

  // Bir sonraki aşama butonunun metnini belirle
  const getNextStageButtonText = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return 'Başlat';
      case 'devam':
        return 'Teste Gönder';
      case 'test':
        return 'Tamamla';
      case 'tamamlanan':
        return '';
      default:
        return '';
    }
  };

  // Bir önceki aşama butonunun metnini belirle
  const getPreviousStageButtonText = (status: TaskStatus) => {
    switch (status) {
      case 'yapilacak':
        return '';
      case 'devam':
        return 'Planlama';
      case 'test':
        return 'Geliştirme';
      case 'tamamlanan':
        return 'Teste Geri Gönder';
      default:
        return '';
    }
  };

  // Yeni proje ekranına git
  const handleNewProject = () => {
    navigation.navigate('NewProject');
  };

  // Filtrelenmiş projeleri al
  const getFilteredProjects = () => {
    if (selectedStatus === 'all') {
      return projects;
    }
    return projects.filter(project => project.status === selectedStatus);
  };

  // Ekranı yenile
  const onRefresh = () => {
    setRefreshing(true);
    // Gerçek bir uygulamada burada API çağrısı yapılabilir
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
              Projeler yükleniyor...
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
              >
                <Ionicons name="menu-outline" size={28} color={theme.colors.onBackground} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: theme.colors.onBackground }]}>Projelerim</Text>
              </View>
            </View>

            <View style={[styles.statusContainer, { borderBottomColor: theme.colors.outline }]}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statusBar}
              >
                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus === 'all' && { backgroundColor: theme.colors.primary + '20' }
                  ]}
                  onPress={() => setSelectedStatus('all')}
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: theme.colors.primary }
                  ]}>
                    <Ionicons name="layers-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[
                    styles.statusText, 
                    { color: selectedStatus === 'all' ? theme.colors.primary : theme.colors.onBackground }
                  ]}>
                    Tümü
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus === 'yapilacak' && { backgroundColor: getStatusColor('yapilacak') + '20' }
                  ]}
                  onPress={() => setSelectedStatus('yapilacak')}
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: getStatusColor('yapilacak') }
                  ]}>
                    <Ionicons name="time-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[
                    styles.statusText, 
                    { color: selectedStatus === 'yapilacak' ? getStatusColor('yapilacak') : theme.colors.onBackground }
                  ]}>
                    Yapılacak
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus === 'devam' && { backgroundColor: getStatusColor('devam') + '20' }
                  ]}
                  onPress={() => setSelectedStatus('devam')}
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: getStatusColor('devam') }
                  ]}>
                    <Ionicons name="reload-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[
                    styles.statusText, 
                    { color: selectedStatus === 'devam' ? getStatusColor('devam') : theme.colors.onBackground }
                  ]}>
                    Devam Ediyor
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus === 'test' && { backgroundColor: getStatusColor('test') + '20' }
                  ]}
                  onPress={() => setSelectedStatus('test')}
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: getStatusColor('test') }
                  ]}>
                    <Ionicons name="flask-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[
                    styles.statusText, 
                    { color: selectedStatus === 'test' ? getStatusColor('test') : theme.colors.onBackground }
                  ]}>
                    Test
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusItem,
                    selectedStatus === 'tamamlanan' && { backgroundColor: getStatusColor('tamamlanan') + '20' }
                  ]}
                  onPress={() => setSelectedStatus('tamamlanan')}
                >
                  <View style={[
                    styles.iconContainer, 
                    { backgroundColor: getStatusColor('tamamlanan') }
                  ]}>
                    <Ionicons name="checkmark-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[
                    styles.statusText, 
                    { color: selectedStatus === 'tamamlanan' ? getStatusColor('tamamlanan') : theme.colors.onBackground }
                  ]}>
                    Tamamlandı
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <ScrollView 
              style={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
            >
              <Text style={[styles.contentTitle, { color: theme.colors.onBackground }]}>
                {selectedStatus === 'all' ? 'Tüm Projeler' : getStatusText(selectedStatus)}
              </Text>

              {getFilteredProjects().length > 0 ? (
                getFilteredProjects().map(project => (
                  <View key={project.id}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                    >
                      <View style={[
                        styles.projectCard, 
                        { backgroundColor: theme.colors.surface }
                      ]}>
                        <View style={styles.projectHeader}>
                          <Text style={[styles.projectTitle, { color: theme.colors.onSurface }]}>
                            {project.title}
                          </Text>
                          <View style={[
                            styles.statusBadge, 
                            { backgroundColor: getStatusColor(project.status) + '20' }
                          ]}>
                            <Text style={[
                              styles.statusBadgeText, 
                              { color: getStatusColor(project.status) }
                            ]}>
                              {getStatusText(project.status)}
                            </Text>
                          </View>
                        </View>

                        <Text style={[
                          styles.projectDescription, 
                          { color: theme.colors.onSurfaceVariant }
                        ]}>
                          {project.description}
                        </Text>

                        <View style={styles.projectFooter}>
                          <View style={[
                            styles.progressContainer, 
                            { backgroundColor: theme.colors.surfaceVariant }
                          ]}>
                            <View 
                              style={[
                                styles.progressBar, 
                                { 
                                  backgroundColor: getStatusColor(project.status),
                                  width: `${project.progress}%`
                                }
                              ]} 
                            />
                          </View>

                          <Text style={[
                            styles.progressText, 
                            { color: theme.colors.onSurfaceVariant }
                          ]}>
                            İlerleme: {project.progress}%
                          </Text>

                          <View style={styles.projectStats}>
                            <View style={styles.statItem}>
                              <Ionicons name="list-outline" size={16} color={theme.colors.onSurfaceVariant} />
                              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                                {project.tasks} Görev
                              </Text>
                            </View>

                            <View style={styles.statItem}>
                              <Ionicons name="people-outline" size={16} color={theme.colors.onSurfaceVariant} />
                              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                                {project.members} Üye
                              </Text>
                            </View>

                            <View style={styles.statItem}>
                              <Ionicons name="calendar-outline" size={16} color={theme.colors.onSurfaceVariant} />
                              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                                {project.endDate}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.navigationButtonsContainer}>
                            {project.status !== 'yapilacak' && (
                              <Button 
                                mode="outlined"
                                style={[styles.navigationButton, { borderColor: theme.colors.outline }]}
                                contentStyle={styles.navigationButtonContent}
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
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
