import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Platform, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { sampleProjects } from '../home/HomeScreen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TeamMember, Task } from '../../types/project';

type Props = DrawerScreenProps<'EditProject'>;
type TaskStatus = 'yapilacak' | 'devam' | 'test' | 'tamamlanan';

const getStatusColor = (status: string): string => {
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
      return '#666';
  }
};

const EditProjectScreen: React.FC<Props> = ({ navigation, route }) => {
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
    dueDate: new Date()
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
            <Text style={styles.headerTitle}>Proje Düzenle</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Proje bulunamadı</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
        assignee: newTaskAssignee,
        startDate: newTaskStartDate,
        dueDate: newTaskDueDate,
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
        project.status = 'yapilacak' as TaskStatus;
      } else if (today >= startDate && today <= endDate) {
        project.status = 'devam' as TaskStatus;
      } else {
        project.status = 'tamamlanan' as TaskStatus;
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
          <Text style={styles.headerTitle}>Proje Düzenle</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proje Bilgileri</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Proje Adı</Text>
              <TextInput
                style={styles.input}
                value={projectTitle}
                onChangeText={setProjectTitle}
                placeholder="Proje adını girin"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={projectDescription}
                onChangeText={setProjectDescription}
                placeholder="Proje açıklamasını girin"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>Başlangıç Tarihi</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>Bitiş Tarihi</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Ekip Üyeleri Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ekip Üyeleri</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddMemberModal(true)}
              >
                <Ionicons name="person-add-outline" size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>Üye Ekle</Text>
              </TouchableOpacity>
            </View>

            {teamMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitials}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                    <Text style={styles.memberDepartment}>{member.department}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeMemberButton}
                    onPress={() => handleRemoveMember(member.id)}
                  >
                    <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Görevler Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Görevler</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddTaskModal(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>Görev Ekle</Text>
              </TouchableOpacity>
            </View>

            {tasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskInfo}>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskAssignee}>
                      {task.assignee ? teamMembers.find(m => m.id === task.assignee)?.name || 'Atanmamış' : 'Atanmamış'}
                    </Text>
                    <Text style={styles.taskDueDate}>
                      {formatDate(task.dueDate)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeTaskButton}
                    onPress={() => handleRemoveTask(task.id)}
                  >
                    <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Üye Ekleme Modalı */}
        <Modal
          visible={showAddMemberModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddMemberModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Yeni Üye Ekle</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAddMemberModal(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>İsim Soyisim</Text>
                  <TextInput
                    style={styles.input}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    placeholder="Üye ismini girin"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Rol</Text>
                  <TextInput
                    style={styles.input}
                    value={newMemberRole}
                    onChangeText={setNewMemberRole}
                    placeholder="Üye rolünü girin"
                  />
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setShowAddMemberModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleAddMember}
                  disabled={!newMemberName.trim() || !newMemberRole.trim()}
                >
                  <Text style={styles.modalButtonText}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Görev Ekleme Modalı */}
        <Modal
          visible={showAddTaskModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddTaskModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Yeni Görev Ekle</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAddTaskModal(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Görev Başlığı</Text>
                  <TextInput
                    style={styles.input}
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    placeholder="Görev başlığını girin"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Görevli</Text>
                  <View style={styles.memberSelectContainer}>
                    {teamMembers.map((member) => (
                      <TouchableOpacity
                        key={member.id}
                        style={[
                          styles.memberSelectButton,
                          newTaskAssignee === member.id && styles.memberSelectButtonActive
                        ]}
                        onPress={() => setNewTaskAssignee(member.id)}
                      >
                        <Text style={[
                          styles.memberSelectButtonText,
                          newTaskAssignee === member.id && styles.memberSelectButtonTextActive
                        ]}>
                          {member.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.dateContainer}>
                  <View style={styles.dateInputContainer}>
                    <Text style={styles.label}>Başlangıç Tarihi</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowTaskStartDatePicker(true)}
                    >
                      <Text style={styles.dateButtonText}>{formatDate(newTaskStartDate)}</Text>
                      <Ionicons name="calendar-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateInputContainer}>
                    <Text style={styles.label}>Bitiş Tarihi</Text>
                    <TouchableOpacity
                      style={styles.dateButton}
                      onPress={() => setShowTaskDueDatePicker(true)}
                    >
                      <Text style={styles.dateButtonText}>{formatDate(newTaskDueDate)}</Text>
                      <Ionicons name="calendar-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setShowAddTaskModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: '#666' }]}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                >
                  <Text style={styles.modalButtonText}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Tarih Seçici Modalları */}
        {Platform.OS === 'ios' && (
          <>
            <Modal
              visible={showStartDatePicker}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                    minimumDate={new Date()}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Tamam</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              visible={showEndDatePicker}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowEndDatePicker(false)}
                  >
                    <Text style={styles.modalButtonText}>Tamam</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}

        {Platform.OS === 'android' && (
          <>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={handleEndDateChange}
                minimumDate={startDate}
              />
            )}
          </>
        )}

        {showTaskStartDatePicker && (
          <DateTimePicker
            value={newTaskStartDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTaskStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTaskDueDatePicker && (
          <DateTimePicker
            value={newTaskDueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTaskDueDateChange}
            minimumDate={newTaskStartDate}
          />
        )}
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    color: '#fff',
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
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  memberDepartment: {
    fontSize: 12,
    color: '#007AFF',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    borderTopColor: '#E1E1E1',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F8F9FA',
  },
  modalSaveButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  memberSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  memberSelectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
    marginRight: 4,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
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
    color: '#333',
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#007AFF',
  },
  removeTaskButton: {
    padding: 4,
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
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  memberSelectButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  memberSelectButtonText: {
    fontSize: 14,
    color: '#333',
  },
  memberSelectButtonTextActive: {
    color: '#fff',
  },
});

export default EditProjectScreen; 