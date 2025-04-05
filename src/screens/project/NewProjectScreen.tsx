import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  SafeAreaView, 
  TouchableOpacity, 
  Image, 
  TextInput as RNTextInput, 
  Modal,
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  Text, 
  Button, 
  Portal, 
  TextInput, 
  Surface, 
  Divider, 
  useTheme, 
  Avatar, 
  Chip, 
  List, 
  IconButton 
} from 'react-native-paper';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { TeamMember, Task, TaskStatus } from '../../types/project';
import { generateId } from '../../utils/idGenerator';
import { formatDate } from '../../utils/dateUtils';
import { formatName } from '../../utils/nameUtils';
import { useProjects } from '../../context/ProjectContext';

type Props = DrawerScreenProps<DrawerStackParamList, 'NewProject'>;

// İlk harfi büyük yapan yardımcı fonksiyon
const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Örnek ekip üyeleri - dinamik projelerde kişileştirilebilir
const SAMPLE_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi', department: 'Yönetim', avatar: undefined },
  { id: '2', name: 'Ayşe Demir', role: 'Geliştirici', department: 'Yazılım', avatar: undefined },
  { id: '3', name: 'Mehmet Kaya', role: 'Tasarımcı', department: 'Tasarım', avatar: undefined },
];

// Örnek görevler - dinamik olarak oluşturulabilir
const SAMPLE_TASKS: Task[] = [
  { 
    id: '1', 
    title: 'Tasarım Dokümanı Hazırlama', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'yapilacak',
    progress: 0
  },
  { 
    id: '2', 
    title: 'Frontend Geliştirme', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'yapilacak',
    progress: 0
  },
  { 
    id: '3', 
    title: 'Backend API Geliştirme', 
    assignee: null, 
    startDate: new Date(),
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: 'yapilacak',
    progress: 0
  },
];

// Üye kartı bileşeni
const MemberCard = ({ member, tasks, onRemove }: { member: TeamMember; tasks: Task[]; onRemove: (id: string) => void }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  
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
      <View style={styles.memberTasks}>
        {tasks.filter(task => task.assignee === member.id).map(task => (
          <View key={task.id} style={styles.memberTask}>
            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.memberTaskText}>{task.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const NewProjectScreen = ({ navigation }: Props) => {
  const { addProject } = useProjects();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTaskStartDatePicker, setShowTaskStartDatePicker] = useState(false);
  const [showTaskDueDatePicker, setShowTaskDueDatePicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [taskDueDate, setTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [showDeleteMemberConfirm, setShowDeleteMemberConfirm] = useState(false);
  
  // Sample data for demonstration
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Sample tasks visibility toggle
  const [showSampleTasks, setShowSampleTasks] = useState(false);
  
  // Sample members visibility toggle
  const [showSampleMembers, setShowSampleMembers] = useState(false);

  // Optimize input handling with debounce
  const handleNameChange = (text: string) => {
    setNewMemberName(text);
  };

  const handleRoleChange = (text: string) => {
    setNewMemberRole(text);
  };

  const handleTaskTitleChange = (text: string) => {
    setTaskTitle(text);
  };

  const handleTaskTitleChangeForIndex = (index: number, text: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].title = text;
    setTasks(updatedTasks);
  };

  const handleCreate = () => {
    // Form validation
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen proje başlığı girin');
      return;
    }

    const newProject = {
      title,
      description,
      status: 'yapilacak' as TaskStatus,
      progress: 0,
      tasks: tasks.length,
      members: members.length,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      team: members,
      recentTasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        assignedTo: task.assignee || '',
        progress: task.progress
      }))
    };

    // Context'e ekle
    addProject(newProject);
    
    // Ana sayfaya geri dön
    navigation.goBack();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
    
    // Eğer başlangıç tarihi bitiş tarihinden sonra ise bitiş tarihini de güncelle
    if (currentDate > endDate) {
      setEndDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const handleTaskStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || taskStartDate;
    setShowTaskStartDatePicker(Platform.OS === 'ios');
    setTaskStartDate(currentDate);
    
    // Eğer başlangıç tarihi bitiş tarihinden sonra ise bitiş tarihini de güncelle
    if (currentDate > taskDueDate) {
      setTaskDueDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleTaskDueDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || taskDueDate;
    setShowTaskDueDatePicker(Platform.OS === 'ios');
    setTaskDueDate(currentDate);
  };

  // Ekip üyesi ekleme
  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert('Hata', 'Lütfen üye adı girin');
      return;
    }

    const role = newMemberRole.trim() || 'Takım Üyesi';
    
    const newMember: TeamMember = {
      id: generateId(),
      name: capitalizeFirstLetter(newMemberName),
      role: capitalizeFirstLetter(role),
      department: 'Genel',
      avatar: undefined
    };
    
    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberRole('');
  };

  // Ekip üyesi silme
  const handleRemoveMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setShowDeleteMemberConfirm(true);
  };

  // Onaylandıktan sonra üyeyi sil
  const confirmDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete));
      // Bu üyeye atanmış görevleri de güncelle
      setTasks(tasks.map(task => 
        task.assignee === memberToDelete ? {...task, assignee: null} : task
      ));
    }
    setShowDeleteMemberConfirm(false);
  };

  // Silme işlemini iptal et
  const cancelDeleteMember = () => {
    setMemberToDelete(null);
    setShowDeleteMemberConfirm(false);
  };

  // Görev ekleme
  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Hata', 'Lütfen görev başlığı girin');
      return;
    }
    
    const newTask: Task = {
      id: generateId(),
      title: taskTitle,
      assignee: null,
      startDate: taskStartDate,
      dueDate: taskDueDate,
      status: 'yapilacak',
      progress: 0
    };
    
    setTasks([...tasks, newTask]);
    setTaskTitle('');
    
    // Yeni görev ekledikten sonra tarihleri sıfırla
    setTaskStartDate(new Date());
    setTaskDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  // Görev atama
  const handleAssignTask = (taskId: string, memberId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {...task, assignee: task.assignee === memberId ? null : memberId} 
        : task
    ));
  };
  
  // Görev silme
  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleUpdateTask = (index: number, field: 'title' | 'startDate' | 'endDate', value: string | Date) => {
    const updatedTasks = [...tasks];
    if (field === 'title') {
      updatedTasks[index].title = value as string;
    } else if (field === 'startDate') {
      updatedTasks[index].startDate = value as Date;
    } else if (field === 'endDate') {
      updatedTasks[index].dueDate = value as Date;
    }
    setTasks(updatedTasks);
  };

  // Örnek üyeleri ekle
  const addSampleMembers = () => {
    const existingIds = new Set(members.map(m => m.id));
    const newMembers = SAMPLE_TEAM_MEMBERS.filter(m => !existingIds.has(m.id));
    setMembers([...members, ...newMembers]);
  };

  // Örnek görevleri ekle
  const addSampleTasks = () => {
    const existingIds = new Set(tasks.map(t => t.id));
    const newTasks = SAMPLE_TASKS.filter(t => !existingIds.has(t.id)).map(t => ({
      ...t,
      id: generateId() // Yeni ID oluştur çakışmayı önlemek için
    }));
    setTasks([...tasks, ...newTasks]);
  };
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Sabit header */}
      <Surface style={[styles.headerSurface, { 
        backgroundColor: theme.colors.elevation.level2,
        position: 'absolute',
        top: insets.top + 10, // SafeArea bilgisini kullanarak üst kenardan uzaklığı ayarlıyoruz
        left: 20,
        right: 20,
        zIndex: 10 // Header'ın içerik üzerinde görünmesini sağlıyor
      }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.onBackground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Yeni Proje</Text>
        </View>
      </Surface>
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingTop: 90 }} // Header için yer açıyoruz
      >

        <View style={styles.content}>
          {/* Proje Bilgileri */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Proje Bilgileri</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Proje Başlığı *</Text>
              <TextInput 
                mode="outlined"
                placeholder="Projenin başlığını girin"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Açıklama</Text>
              <TextInput 
                mode="outlined"
                placeholder="Proje hakkında kısa açıklama yazın"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />
            </View>
            
            <View style={styles.dateContainer}>
              <View style={styles.dateInputContainer}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Başlangıç Tarihi</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.colors.onBackground }]}>
                    {format(startDate, 'dd MMM yyyy', { locale: tr })}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                  />
                )}
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Bitiş Tarihi</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.colors.onBackground }]}>
                    {format(endDate, 'dd MMM yyyy', { locale: tr })}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                  />
                )}
              </View>
            </View>
          </View>
          
          {/* Ekip Üyeleri */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Ekip Üyeleri</Text>
              <TouchableOpacity onPress={() => setShowSampleMembers(!showSampleMembers)}>
                <Text style={{ color: theme.colors.primary }}>
                  {showSampleMembers ? 'Önerileri Gizle' : 'Öneriler'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showSampleMembers && (
              <View style={styles.suggestionsContainer}>
                <Text style={[styles.subsectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Hızlı Başlangıç: Örnek Üyeler
                </Text>
                <Button 
                  mode="contained-tonal" 
                  onPress={addSampleMembers}
                  style={{ marginTop: 8 }}
                >
                  Örnek Üyeleri Ekle
                </Button>
              </View>
            )}
            
            <View style={styles.inputRow}>
              <TextInput 
                mode="outlined"
                placeholder="Üye adı"
                value={newMemberName}
                onChangeText={handleNameChange}
                style={[styles.input, { flex: 2, marginRight: 8 }]}
              />
              <TextInput 
                mode="outlined"
                placeholder="Rolü"
                value={newMemberRole}
                onChangeText={handleRoleChange}
                style={[styles.input, { flex: 1 }]}
              />
              <IconButton
                icon="plus"
                mode="contained-tonal"
                size={24}
                onPress={handleAddMember}
                style={{ marginLeft: 8 }}
              />
            </View>
            
            {members.length > 0 ? (
              <View style={styles.membersList}>
                {members.map((member) => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    tasks={tasks.filter(task => task.assignee === member.id)} 
                    onRemove={handleRemoveMember}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  Henüz ekip üyesi eklenmedi
                </Text>
              </View>
            )}
          </View>
          
          {/* Görevler */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Görevler</Text>
              <TouchableOpacity onPress={() => setShowSampleTasks(!showSampleTasks)}>
                <Text style={{ color: theme.colors.primary }}>
                  {showSampleTasks ? 'Önerileri Gizle' : 'Öneriler'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showSampleTasks && (
              <View style={styles.suggestionsContainer}>
                <Text style={[styles.subsectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Hızlı Başlangıç: Örnek Görevler
                </Text>
                <Button 
                  mode="contained-tonal" 
                  onPress={addSampleTasks}
                  style={{ marginTop: 8 }}
                >
                  Örnek Görevleri Ekle
                </Button>
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Görev Başlığı</Text>
              <TextInput 
                mode="outlined"
                placeholder="Görev başlığını girin"
                value={taskTitle}
                onChangeText={handleTaskTitleChange}
                style={styles.input}
              />
            </View>
            
            <View style={styles.dateContainer}>
              <View style={styles.dateInputContainer}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Başlangıç</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                  onPress={() => setShowTaskStartDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.colors.onBackground }]}>
                    {format(taskStartDate, 'dd MMM yyyy', { locale: tr })}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                {showTaskStartDatePicker && (
                  <DateTimePicker
                    value={taskStartDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTaskStartDateChange}
                    minimumDate={startDate}
                    maximumDate={endDate}
                  />
                )}
              </View>
              
              <View style={styles.dateInputContainer}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Bitiş</Text>
                <TouchableOpacity 
                  style={[styles.dateButton, { borderColor: theme.colors.outline }]}
                  onPress={() => setShowTaskDueDatePicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: theme.colors.onBackground }]}>
                    {format(taskDueDate, 'dd MMM yyyy', { locale: tr })}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
                {showTaskDueDatePicker && (
                  <DateTimePicker
                    value={taskDueDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTaskDueDateChange}
                    minimumDate={taskStartDate}
                    maximumDate={endDate}
                  />
                )}
              </View>
              
              <IconButton
                icon="plus"
                mode="contained-tonal"
                size={24}
                onPress={handleAddTask}
                style={{ alignSelf: 'flex-end', marginBottom: 12 }}
              />
            </View>
            
            {tasks.length > 0 ? (
              <View style={styles.tasksList}>
                {tasks.map((task, index) => (
                  <View key={task.id} style={[styles.taskCard, { borderColor: theme.colors.outline }]}>
                    <View style={styles.taskInfo}>
                      <View style={styles.taskDetails}>
                        <Text style={[styles.taskTitle, { color: theme.colors.onBackground }]}>
                          {task.title}
                        </Text>
                        <Text style={[styles.taskDueDate, { color: theme.colors.primary }]}>
                          {format(task.dueDate, 'dd MMM yyyy', { locale: tr })}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.removeTaskButton}
                        onPress={() => handleRemoveTask(task.id)}
                      >
                        <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={{ marginTop: 8 }}>
                      <Text style={[styles.label, { color: theme.colors.onSurfaceVariant, marginBottom: 4 }]}>
                        Görev {task.assignee ? 'atandı' : 'atanmadı'}
                      </Text>
                      
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.memberSelectContainer}>
                          {members.map((member) => (
                            <TouchableOpacity
                              key={member.id}
                              style={[
                                styles.memberSelectButton,
                                task.assignee === member.id && styles.memberSelectButtonActive
                              ]}
                              onPress={() => handleAssignTask(task.id, member.id)}
                            >
                              <Text style={[
                                styles.memberSelectButtonText,
                                task.assignee === member.id && styles.memberSelectButtonTextActive
                              ]}>
                                {member.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  Henüz görev eklenmedi
                </Text>
              </View>
            )}
          </View>
          
          {/* Eylemler */}
          <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.actionButton, { borderColor: theme.colors.outline }]}
              contentStyle={styles.actionButtonContent}
            >
              İptal
            </Button>
            
            <Button
              mode="contained"
              onPress={handleCreate}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.actionButtonContent}
              disabled={!title.trim()}
            >
              Oluştur
            </Button>
          </View>
        </View>
      </ScrollView>
      
      {/* Üye silme onayı */}
      <Portal>
        <Modal
          visible={showDeleteMemberConfirm}
          onDismiss={cancelDeleteMember}
          style={styles.alertModal}
        >
          <View style={[
            styles.alertContent, 
            { backgroundColor: theme.colors.background }
          ]}>
            <Text style={[styles.alertTitle, { color: theme.colors.onBackground }]}>
              Üye Silinecek
            </Text>
            <Text style={[styles.alertMessage, { color: theme.colors.onSurfaceVariant }]}>
              Bu üyeyi ekipten silmek istediğinize emin misiniz? Bu üyeye atanmış görevler de güncellenecektir.
            </Text>
            <View style={styles.alertActions}>
              <Button
                mode="text"
                onPress={cancelDeleteMember}
                textColor={theme.colors.secondary}
              >
                İptal
              </Button>
              <Button
                mode="contained"
                onPress={confirmDeleteMember}
                buttonColor="#FF3B30"
              >
                Sil
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  // Modernize edilmiş header stili
  headerSurface: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    zIndex: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: theme.colors.elevation.level1,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: theme.colors.elevation.level0,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginRight: 12,
  },
  memberInitials: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onBackground,
  },
  memberRole: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  memberDepartment: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  removeMemberButton: {
    padding: 4,
  },
  memberTasks: {
    marginTop: 8,
  },
  memberTask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  memberTaskText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.elevation.level0,
    borderRadius: 8,
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
    justifyContent: 'space-between',
    backgroundColor: theme.colors.elevation.level0,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
    marginRight: 4,
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: theme.colors.elevation.level0,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  taskDueDate: {
    fontSize: 12,
  },
  removeTaskButton: {
    padding: 4,
  },
  memberSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.elevation.level1,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  memberSelectButtonActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  memberSelectButtonText: {
    fontSize: 14,
    color: theme.colors.onBackground,
  },
  memberSelectButtonTextActive: {
    color: theme.colors.onSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
    height: 50,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
  },
  alertModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  alertContent: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 24,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default NewProjectScreen;
