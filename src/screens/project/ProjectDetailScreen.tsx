import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { sampleProjects } from '../home/HomeScreen';

type Props = DrawerScreenProps<'ProjectDetail'>;

const ProjectDetailScreen = ({ navigation, route }: Props) => {
  const { projectId } = route.params;
  const project = sampleProjects.find(p => p.id === projectId);

  if (!project) {
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
            <Text style={styles.headerTitle}>Proje Detayları</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Proje bulunamadı</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
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
          <Text style={styles.headerTitle}>Proje Detayları</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProject', { projectId: project.id })}
          >
            <View style={styles.editButtonContent}>
              <Ionicons name="pencil-outline" size={20} color="#007AFF" />
              <Text style={styles.editButtonText}>Düzenle</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
              <Text style={styles.statusBadgeText}>
                {project.status === 'devam' ? 'Devam Ediyor' : project.status}
              </Text>
            </View>
          </View>

          <Text style={styles.projectDescription}>{project.description}</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>İlerleme</Text>
              <Text style={styles.progressText}>{project.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Başlangıç</Text>
                <Text style={styles.statValue}>{new Date(project.startDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flag-outline" size={24} color="#007AFF" />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Bitiş</Text>
                <Text style={styles.statValue}>{new Date(project.endDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={24} color="#007AFF" />
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>Ekip</Text>
                <Text style={styles.statValue}>{project.members} Üye</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ekip Üyeleri</Text>
            {project.team.map((member) => (
              <View key={member.id} style={styles.teamMember}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitial}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  <View style={styles.memberTasks}>
                    <Text style={styles.memberTasksTitle}>Görevler:</Text>
                    {project.recentTasks
                      .filter(task => task.assignedTo === member.id)
                      .map(task => (
                        <View key={task.id} style={styles.memberTaskItem}>
                          <View style={[styles.memberTaskStatus, { backgroundColor: getStatusColor(task.status) }]} />
                          <View style={styles.memberTaskContent}>
                            <Text style={styles.memberTaskTitle}>{task.title}</Text>
                            <View style={styles.memberTaskProgressBar}>
                              <View style={[styles.memberTaskProgressFill, { width: `${task.progress || 0}%` }]} />
                            </View>
                            <Text style={styles.memberTaskProgressText}>{task.progress || 0}%</Text>
                          </View>
                        </View>
                      ))}
                    {project.recentTasks.filter(task => task.assignedTo === member.id).length === 0 && (
                      <Text style={styles.noTaskText}>Henüz görev atanmamış</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  editButton: {
    padding: 8,
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
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
    fontSize: 16,
    color: '#666',
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
    color: '#333',
  },
  progressText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
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
    backgroundColor: '#f8f9fa',
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
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: '#333',
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
    borderBottomColor: '#f0f0f0',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  memberTasks: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  memberTasksTitle: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    marginBottom: 4,
  },
  memberTaskProgressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  memberTaskProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  memberTaskProgressText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  noTaskText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ProjectDetailScreen; 