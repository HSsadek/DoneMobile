import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView, TouchableOpacity, Image, TextInput as RNTextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, Button, Portal, TextInput, Surface, Divider, useTheme, Avatar, Chip, List, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { theme } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import type { TeamMember, Task } from '../../types/project';
import { generateId } from '../../utils/idGenerator';
import { formatDate } from '../../utils/dateUtils';
import { formatName } from '../../utils/nameUtils';
import { sampleProjects } from '../home/HomeScreen';
import type { TaskStatus } from '../home/HomeScreen';

type Props = DrawerScreenProps<DrawerStackParamList, 'NewProject'>;

// İlk harfi büyük yapan yardımcı fonksiyon
const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Örnek ekip üyeleri
const SAMPLE_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi', department: 'Yönetim' },
  { id: '2', name: 'Ayşe Demir', role: 'Geliştirici', department: 'Yazılım' },
  { id: '3', name: 'Mehmet Kaya', role: 'Tasarımcı', department: 'Tasarım' },
];

// Örnek görevler
const SAMPLE_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Tasarım Dokümanı Hazırlama', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
  },
  { 
    id: '2', 
    title: 'Frontend Geliştirme', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
  },
  { 
    id: '3', 
    title: 'Backend API Geliştirme', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) 
  },
];

// Üye tipi tanımı
type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

// Üye kartı bileşeni
const MemberCard = ({ member, tasks, onRemove }: { member: TeamMember; tasks: Task[]; onRemove: (id: string) => void }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#6366f1', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={[styles.memberAvatar, { backgroundColor: getAvatarColor(member.name) }]}>
          <Text style={styles.memberInitials}>{getInitials(member.name)}</Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeMemberButton}
          onPress={() => onRemove(member.id)}
        >
          <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Üyenin Görevleri */}
      {tasks.filter(task => task.assignee === member.id).length > 0 && (
        <View style={styles.taskDetails}>
          {tasks.filter(task => task.assignee === member.id).map(task => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <View style={styles.taskDetails}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDueDate}>
                    Bitiş: {formatDate(task.dueDate)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const NewProjectScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Ekip üyeleri ve görevler için state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(SAMPLE_TEAM_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberTaskTitle, setNewMemberTaskTitle] = useState('');
  const [newMemberTaskStartDate, setNewMemberTaskStartDate] = useState(new Date());
  const [newMemberTaskEndDate, setNewMemberTaskEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showNewMemberTaskStartDatePicker, setShowNewMemberTaskStartDatePicker] = useState(false);
  const [showNewMemberTaskEndDatePicker, setShowNewMemberTaskEndDatePicker] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStartDate, setNewTaskStartDate] = useState(new Date());
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showTaskStartDatePicker, setShowTaskStartDatePicker] = useState(false);
  const [showTaskDueDatePicker, setShowTaskDueDatePicker] = useState(false);
  const [memberTasks, setMemberTasks] = useState<Array<{
    title: string;
    startDate: Date;
    endDate: Date;
  }>>([{
    title: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }]);

  // Optimize input handling with debounce
  const handleNameChange = (text: string) => {
    setNewMemberName(text);
  };

  const handleRoleChange = (text: string) => {
    setNewMemberRole(text);
  };

  const handleTaskTitleChange = (text: string) => {
    setNewTaskTitle(text);
  };

  const handleTaskTitleChangeForIndex = (index: number, text: string) => {
    const newTasks = [...memberTasks];
    newTasks[index] = { ...newTasks[index], title: text };
    setMemberTasks(newTasks);
  };

  const handleCreate = () => {
    if (!projectTitle || !projectDescription) {
      return;
    }

    const newProject = {
      id: generateId(),
      title: projectTitle,
      description: projectDescription,
      status: 'yapilacak' as TaskStatus,
      progress: 0,
      tasks: tasks.length,
      members: teamMembers.length,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      team: teamMembers,
      recentTasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: 'beklemede',
        assignedTo: task.assignee || '',
        progress: 0,
      })),
    };

    sampleProjects.push(newProject);
    navigation.goBack();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleTaskStartDateChange = (event: any, selectedDate?: Date) => {
    setShowTaskStartDatePicker(false);
    if (selectedDate) {
      setNewTaskStartDate(selectedDate);
      if (selectedDate > newTaskDueDate) {
        setNewTaskDueDate(selectedDate);
      }
    }
  };

  const handleTaskDueDateChange = (event: any, selectedDate?: Date) => {
    setShowTaskDueDatePicker(false);
    if (selectedDate) {
      setNewTaskDueDate(selectedDate);
    }
  };

  // Ekip üyesi ekleme
  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const newMember: TeamMember = {
        id: generateId(),
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

  // Ekip üyesi silme
  const handleRemoveMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setShowDeleteConfirmModal(true);
  };

  // Onaylandıktan sonra üyeyi sil
  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setTeamMembers(teamMembers.filter(member => member.id !== memberToDelete));
      setShowDeleteConfirmModal(false);
      setMemberToDelete(null);
    }
  };
  
  // Silme işlemini iptal et
  const cancelDeleteMember = () => {
    setShowDeleteConfirmModal(false);
    setMemberToDelete(null);
  };

  // Görev ekleme
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: generateId(),
        title: newTaskTitle.trim(),
        assignee: null,
        startDate: newTaskStartDate,
        dueDate: newTaskDueDate,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskStartDate(new Date());
      setNewTaskDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setShowAddTaskModal(false);
    }
  };

  // Görev atama
  const handleAssignTask = (taskId: string, memberId: string) => {
    if (!taskId || !memberId) return;
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, assignee: memberId } : task
    ));
    setShowAssignTaskModal(false);
    setSelectedTask(null);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = [...memberTasks];
    newTasks.splice(index, 1);
    setMemberTasks(newTasks);
  };

  const handleUpdateTask = (index: number, field: 'title' | 'startDate' | 'endDate', value: string | Date) => {
    const newTasks = [...memberTasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setMemberTasks(newTasks);
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
          <Text style={styles.headerTitle}>Yeni Proje</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreate}
          >
            <Text style={styles.saveButtonText}>Oluştur</Text>
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
              <MemberCard key={member.id} member={member} tasks={tasks} onRemove={handleRemoveMember} />
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
                    onChangeText={handleTaskTitleChange}
                    placeholder="Görev başlığını girin"
                  />
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
              animationType="slide"
              onRequestClose={() => setShowStartDatePicker(false)}
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
              animationType="slide"
              onRequestClose={() => setShowEndDatePicker(false)}
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

        {/* Silme Onay Modalı */}
        <Modal
          visible={showDeleteConfirmModal}
          onDismiss={cancelDeleteMember}
          style={styles.alertModal}
        >
          <Surface style={styles.alertContent} elevation={5}>
            <Text variant="titleMedium" style={styles.alertTitle}>
              Üye Silme
            </Text>
            
            <Text variant="bodyMedium" style={styles.alertMessage}>
              {memberToDelete ? teamMembers.find(m => m.id === memberToDelete)?.name : ''} isimli üyeyi silmek istediğinize emin misiniz?
            </Text>
            
            <View style={styles.alertActions}>
              <Button 
                mode="text" 
                onPress={cancelDeleteMember}
                style={styles.alertButton}
                textColor="#666"
              >
                İptal
              </Button>
              <Button 
                mode="text" 
                onPress={confirmDeleteMember}
                style={styles.alertButton}
                textColor="#ff4444"
              >
                Sil
              </Button>
            </View>
          </Surface>
        </Modal>
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
  alertModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  alertContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  alertButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default NewProjectScreen; 