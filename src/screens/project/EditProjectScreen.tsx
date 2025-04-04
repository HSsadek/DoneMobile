import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Platform, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { sampleProjects } from '../home/HomeScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TeamMember, Task } from '../../types/project';
import { useTheme } from 'react-native-paper';
import { CustomTheme } from '../../theme';

type Props = DrawerScreenProps<DrawerStackParamList, 'EditProject'>;

const EditProjectScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme() as CustomTheme;
  const { projectId } = route.params;
  const project = sampleProjects.find(p => p.id === projectId);
  const [projectTitle, setProjectTitle] = useState(project?.title || 'Proje Adı');
  const [projectDescription, setProjectDescription] = useState(project?.description || 'Proje açıklaması buraya gelecek...');
  const [startDate, setStartDate] = useState(new Date(project?.startDate || Date.now()));
  const [endDate, setEndDate] = useState(new Date(project?.endDate || Date.now()));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Ekip üyeleri için state'ler
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    project?.team?.map(member => ({
      ...member,
      department: member.department || 'Genel'
    })) || []
  );
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Görevler için state'ler
  const [tasks, setTasks] = useState<Task[]>(project?.recentTasks?.map(task => ({
    id: task.id,
    title: task.title,
    assignee: task.assignedTo,
    startDate: new Date(),
    dueDate: new Date(),
    status: 'yapilacak',
    progress: 0
  })) || []);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string | null>(null);
  const [newTaskStartDate, setNewTaskStartDate] = useState(new Date());
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [showTaskStartDatePicker, setShowTaskStartDatePicker] = useState(false);
  const [showTaskDueDatePicker, setShowTaskDueDatePicker] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Ekip üyesi ekleme fonksiyonu
  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const newMember: TeamMember = {
        id: (teamMembers.length + 1).toString(),
        name: newMemberName.trim(),
        role: newMemberRole.trim(),
        department: 'Genel',
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberName('');
      setNewMemberRole('');
      setShowAddMemberModal(false);
    }
  };

  // Ekip üyesi silme fonksiyonu
  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  // Görev başlangıç tarihi değiştirme fonksiyonu
  const handleTaskStartDateChange = (event: any, selectedDate?: Date) => {
    setShowTaskStartDatePicker(false);
    if (selectedDate) {
      setNewTaskStartDate(selectedDate);
      // Başlangıç tarihi bitiş tarihinden sonra ise, bitiş tarihini başlangıç tarihine eşitle
      if (selectedDate > newTaskDueDate) {
        setNewTaskDueDate(selectedDate);
      }
    }
  };

  // Görev bitiş tarihi değiştirme fonksiyonu
  const handleTaskDueDateChange = (event: any, selectedDate?: Date) => {
    setShowTaskDueDatePicker(false);
    if (selectedDate) {
      setNewTaskDueDate(selectedDate);
    }
  };

  // Görev ekleme fonksiyonu
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: (tasks.length + 1).toString(),
        title: newTaskTitle.trim(),
        assignee: newTaskAssignee || '',
        startDate: newTaskStartDate,
        dueDate: newTaskDueDate,
        status: 'yapilacak',
        progress: 0
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskAssignee(null);
      setNewTaskStartDate(new Date());
      setNewTaskDueDate(new Date());
      setShowAddTaskModal(false);
    }
  };

  // Görev silme fonksiyonu
  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Proje Düzenle</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.text }]}>Proje bulunamadı</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (project) {
      // Proje detaylarını güncelle
      project.title = projectTitle;
      project.description = projectDescription;
      project.startDate = startDate.toISOString();
      project.endDate = endDate.toISOString();
      
      // Ekip güncellemeleri
      project.team = teamMembers;
      project.members = teamMembers.length;
      
      // Proje durumunu güncelle
      const today = new Date();
      if (today < startDate) {
        project.status = 'yapilacak' as 'yapilacak' | 'devam' | 'test' | 'tamamlanan';
      } else if (today >= startDate && today <= endDate) {
        project.status = 'devam' as 'yapilacak' | 'devam' | 'test' | 'tamamlanan';
      } else {
        project.status = 'tamamlanan' as 'yapilacak' | 'devam' | 'test' | 'tamamlanan';
      }

      // Proje ilerleme durumunu güncelle
      if (project.status === 'tamamlanan') {
        project.progress = 100;
      } else if (project.status === 'devam') {
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        project.progress = Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
      } else {
        project.progress = 0;
      }
    }
    
    navigation.goBack();
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
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Proje Düzenle</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Proje Adı</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              value={projectTitle}
              onChangeText={setProjectTitle}
              placeholderTextColor={theme.colors.text + '66'}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              value={projectDescription}
              onChangeText={setProjectDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor={theme.colors.text + '66'}
            />
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Başlangıç Tarihi</Text>
              <TouchableOpacity
                style={[styles.dateButton, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }]}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  {formatDate(startDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Bitiş Tarihi</Text>
              <TouchableOpacity
                style={[styles.dateButton, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }]}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                  {formatDate(endDate)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ekip Üyeleri</Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setShowAddMemberModal(true)}
              >
                <Ionicons name="add" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {teamMembers.map(member => (
              <View key={member.id} style={[styles.memberCard, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }]}>
                <View style={styles.memberInfo}>
                  <View style={[styles.memberAvatar, { backgroundColor: theme.colors.primary }]}>
                    <Text style={[styles.memberInitials, { color: theme.colors.onPrimary }]}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberRole, { color: theme.colors.text + '99' }]}>{member.role}</Text>
                    <Text style={[styles.memberDepartment, { color: theme.colors.primary }]}>
                      {member.department}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeMemberButton}
                    onPress={() => handleRemoveMember(member.id)}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Görevler</Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary + '20' }]}
                onPress={() => setShowAddTaskModal(true)}
              >
                <Ionicons name="add" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {tasks.map(task => (
              <View key={task.id} style={[styles.taskCard, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }]}>
                <View style={styles.taskInfo}>
                  <View style={styles.taskDetails}>
                    <Text style={[styles.taskTitle, { color: theme.colors.text }]}>{task.title}</Text>
                    <Text style={[styles.taskAssignee, { color: theme.colors.text + '99' }]}>
                      {teamMembers.find(m => m.id === task.assignee)?.name || 'Atanmamış'}
                    </Text>
                    <Text style={[styles.taskDueDate, { color: theme.colors.primary }]}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeTaskButton}
                    onPress={() => handleRemoveTask(task.id)}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Ekip Üyesi Ekleme Modalı */}
        <Modal
          visible={showAddMemberModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddMemberModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border
            }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Ekip Üyesi Ekle</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAddMemberModal(false)}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Ad Soyad</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }]}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    placeholderTextColor={theme.colors.text + '66'}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Rol</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }]}
                    value={newMemberRole}
                    onChangeText={setNewMemberRole}
                    placeholderTextColor={theme.colors.text + '66'}
                  />
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: theme.colors.border }]}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton, { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                  }]}
                  onPress={() => setShowAddMemberModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton, { 
                    backgroundColor: theme.colors.primary
                  }]}
                  onPress={handleAddMember}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.onPrimary }]}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Görev Ekleme Modalı */}
        <Modal
          visible={showAddTaskModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAddTaskModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border
            }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Görev Ekle</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAddTaskModal(false)}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Görev Adı</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    }]}
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    placeholderTextColor={theme.colors.text + '66'}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Sorumlu</Text>
                  <View style={styles.memberSelectContainer}>
                    {teamMembers.map(member => (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.memberSelectButton,
                          newTaskAssignee === member.id && styles.memberSelectButtonActive,
                          { 
                            backgroundColor: theme.colors.surface,
                            borderColor: newTaskAssignee === member.id ? theme.colors.primary : theme.colors.border
                          }
                        ]}
                        onPress={() => setNewTaskAssignee(member.id)}
                      >
                        <Text
                          style={[
                            styles.memberSelectButtonText,
                            newTaskAssignee === member.id && styles.memberSelectButtonTextActive,
                            { color: newTaskAssignee === member.id ? theme.colors.onPrimary : theme.colors.text }
                          ]}
                        >
                          {member.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Başlangıç</Text>
                    <TouchableOpacity
                      style={[styles.dateButton, { 
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border
                      }]}
                      onPress={() => setShowTaskStartDatePicker(true)}
                    >
                      <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                        {formatDate(newTaskStartDate)}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateInputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text + '99' }]}>Bitiş</Text>
                    <TouchableOpacity
                      style={[styles.dateButton, { 
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border
                      }]}
                      onPress={() => setShowTaskDueDatePicker(true)}
                    >
                      <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                        {formatDate(newTaskDueDate)}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.modalFooter, { borderTopColor: theme.colors.border }]}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton, { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                  }]}
                  onPress={() => setShowAddTaskModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton, { 
                    backgroundColor: theme.colors.primary
                  }]}
                  onPress={handleAddTask}
                >
                  <Text style={[styles.modalButtonText, { color: theme.colors.onPrimary }]}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
          />
        )}

        {showTaskStartDatePicker && (
          <DateTimePicker
            value={newTaskStartDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTaskStartDateChange}
          />
        )}

        {showTaskDueDatePicker && (
          <DateTimePicker
            value={newTaskDueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTaskDueDateChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  saveButton: {
    marginLeft: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
    marginRight: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 14,
    marginTop: 2,
  },
  memberDepartment: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  removeMemberButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalCancelButton: {
    borderWidth: 1,
  },
  modalSaveButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  memberSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  memberSelectButtonActive: {
    borderWidth: 0,
  },
  memberSelectButtonText: {
    fontSize: 14,
  },
  memberSelectButtonTextActive: {
    fontWeight: '500',
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 14,
    marginBottom: 2,
  },
  taskDueDate: {
    fontSize: 12,
  },
  removeTaskButton: {
    padding: 4,
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

export default EditProjectScreen;