import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import KanbanBoard from '../../components/KanbanBoard';
import { useTheme } from 'react-native-paper';
import { CustomTheme } from '../../theme';
import { Task, TeamMember, TaskStatus } from '../../types/project';
import { useProjects } from '../../context/ProjectContext';

type Props = DrawerScreenProps<DrawerStackParamList, 'ProjectDetail'> & {
  route: {
    params: {
      projectId: string;
    };
  };
};

const ProjectDetailScreen = ({ navigation, route }: Props) => {
  const theme = useTheme() as CustomTheme;
  const { projectId } = route.params;
  const { projects } = useProjects();
  const [viewMode, setViewMode] = useState<'details' | 'kanban'>('details');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (projects !== undefined) {
      // Data is available, no need to wait
      setLoading(false);
    } else {
      // Add a small delay to prevent flash
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  // If projects is undefined, show loading
  if (projects === undefined || loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.colors.text === '#000000' ? 'dark' : 'light'} />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Proje Detayları</Text>
            {projectId && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProject', { projectId })}
              >
                <View style={styles.editButtonContent}>
                  <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Düzenle</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>Yükleniyor...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Find project after we know projects is defined
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.colors.text === '#000000' ? 'dark' : 'light'} />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Proje Detayları</Text>
            {projectId && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProject', { projectId })}
              >
                <View style={styles.editButtonContent}>
                  <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
                  <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Düzenle</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>Proje bulunamadı</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleTaskPress = (task: Task) => {
    // TODO: Implement task detail view
    console.log('Task pressed:', task);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.text === '#000000' ? 'dark' : 'light'} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Proje Detayları</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProject', { projectId: project.id })}
          >
            <View style={styles.editButtonContent}>
              <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>Düzenle</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'details' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => setViewMode('details')}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === 'details' ? theme.colors.primary : theme.colors.text}
            />
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'details' ? theme.colors.primary : theme.colors.text }
              ]}
            >
              Detaylar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'kanban' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => setViewMode('kanban')}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={viewMode === 'kanban' ? theme.colors.primary : theme.colors.text}
            />
            <Text
              style={[
                styles.viewToggleText,
                { color: viewMode === 'kanban' ? theme.colors.primary : theme.colors.text }
              ]}
            >
              Kanban
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {viewMode === 'details' ? (
            <>
              <View style={styles.projectHeader}>
                <Text style={[styles.projectTitle, { color: theme.colors.text }]}>{project.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                  <Text style={[styles.statusBadgeText, { color: theme.colors.onPrimary }]}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={[styles.projectDescription, { color: theme.colors.text }]}>
                {project.description}
              </Text>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>İlerleme</Text>
                  <Text style={[styles.progressText, { color: theme.colors.text }]}>
                    {project.progress}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: getStatusColor(project.status),
                        width: `${project.progress}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statsSection}>
                <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
                  <Ionicons name="list-outline" size={24} color={theme.colors.primary} />
                  <View style={styles.statContent}>
                    <Text style={[styles.statLabel, { color: theme.colors.text + '99' }]}>
                      Görevler
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                      {project.tasks} Görev
                    </Text>
                  </View>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
                  <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
                  <View style={styles.statContent}>
                    <Text style={[styles.statLabel, { color: theme.colors.text + '99' }]}>
                      Ekip
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                      {project.members} Üye
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ekip Üyeleri</Text>
                {project.team.map((member: TeamMember) => (
                  <View key={member.id} style={[styles.teamMember, { borderBottomColor: theme.colors.border }]}>
                    <View style={[styles.memberAvatar, { backgroundColor: theme.colors.primary }]}>
                      <Text style={[styles.memberInitial, { color: theme.colors.onPrimary }]}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={[styles.memberName, { color: theme.colors.text }]}>
                        {member.name}
                      </Text>
                      <Text style={[styles.memberRole, { color: theme.colors.text + '99' }]}>
                        {member.role}
                      </Text>
                      <View style={[styles.memberTasks, { borderTopColor: theme.colors.border }]}>
                        <Text style={[styles.memberTasksTitle, { color: theme.colors.text + '99' }]}>
                          Görevler
                        </Text>
                        {project.recentTasks.filter(task => task.assignedTo === member.id).length > 0 ? (
                          project.recentTasks
                            .filter(task => task.assignedTo === member.id)
                            .map(task => (
                              <View key={task.id} style={styles.memberTaskItem}>
                                <View
                                  style={[
                                    styles.memberTaskStatus,
                                    {
                                      backgroundColor:
                                        task.status === 'tamamlandi'
                                          ? theme.colors.primary
                                          : task.status === 'devam'
                                          ? theme.colors.secondary
                                          : theme.colors.tertiary,
                                    },
                                  ]}
                                />
                                <View style={styles.memberTaskContent}>
                                  <Text style={[styles.memberTaskTitle, { color: theme.colors.text }]}>
                                    {task.title}
                                  </Text>
                                  <View style={[styles.memberTaskProgressBar, { backgroundColor: theme.colors.border }]}>
                                    <View
                                      style={[
                                        styles.memberTaskProgressFill,
                                        {
                                          backgroundColor: theme.colors.primary,
                                          width: `${task.progress}%`,
                                        },
                                      ]}
                                    />
                                  </View>
                                  <Text style={[styles.memberTaskProgressText, { color: theme.colors.text + '66' }]}>
                                    {task.progress}%
                                  </Text>
                                </View>
                              </View>
                            ))
                        ) : (
                          <Text style={[styles.noTaskText, { color: theme.colors.text + '66' }]}>
                            Atanmış görev yok
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <KanbanBoard 
              tasks={project.recentTasks.map(task => ({
                id: task.id,
                title: task.title,
                description: '',
                assignee: task.assignedTo,
                dueDate: new Date(),
                startDate: new Date(),
                status: task.status as TaskStatus,
                progress: task.progress
              }))} 
              onTaskPress={handleTaskPress} 
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
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
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    marginLeft: 15,
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  viewToggleText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontSize: 16,
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    minHeight: 70,
  },
  statContent: {
    marginLeft: 8,
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
  },
  memberTasks: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  memberTasksTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberTaskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  memberTaskStatus: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 6,
  },
  memberTaskContent: {
    flex: 1,
  },
  memberTaskTitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  memberTaskProgressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  memberTaskProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  memberTaskProgressText: {
    fontSize: 11,
    textAlign: 'right',
  },
  noTaskText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProjectDetailScreen;