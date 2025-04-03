import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text, Button, Portal, Modal, TextInput, Surface, Divider, useTheme, Avatar, Chip, List, IconButton } from 'react-native-paper';

type Props = DrawerScreenProps<DrawerStackParamList, 'NewProject'>;

// İlk harfi büyük yapan yardımcı fonksiyon
const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Örnek ekip üyeleri
const SAMPLE_TEAM_MEMBERS = [
  { id: '1', name: 'Ahmet Yılmaz', role: 'Proje Yöneticisi', avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=random' },
  { id: '2', name: 'Ayşe Demir', role: 'Geliştirici', avatar: 'https://ui-avatars.com/api/?name=Ayşe+Demir&background=random' },
  { id: '3', name: 'Mehmet Kaya', role: 'Tasarımcı', avatar: 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=random' },
];

// Görev tipi tanımı
type Task = {
  id: string;
  title: string;
  assignee: string | null;
  dueDate: Date;
};

// Örnek görevler
const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'Tasarım Dokümanı Hazırlama', assignee: null, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { id: '2', title: 'Frontend Geliştirme', assignee: null, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { id: '3', title: 'Backend API Geliştirme', assignee: null, dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
];

const NewProjectScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Ekip üyeleri ve görevler için state
  const [teamMembers, setTeamMembers] = useState(SAMPLE_TEAM_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showNewTaskDatePicker, setShowNewTaskDatePicker] = useState(false);
  const [newMemberTaskTitle, setNewMemberTaskTitle] = useState('');
  const [newMemberTaskStartDate, setNewMemberTaskStartDate] = useState(new Date());
  const [newMemberTaskEndDate, setNewMemberTaskEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showNewMemberTaskStartDatePicker, setShowNewMemberTaskStartDatePicker] = useState(false);
  const [showNewMemberTaskEndDatePicker, setShowNewMemberTaskEndDatePicker] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleCreate = () => {
    // TODO: Yeni proje oluşturma işlemi eklenecek
    navigation.goBack();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (endDate < selectedDate) {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Yeni üye görev tarihi değiştirme
  const handleNewMemberTaskStartDateChange = (event: any, selectedDate?: Date) => {
    setShowNewMemberTaskStartDatePicker(false);
    if (selectedDate) {
      setNewMemberTaskStartDate(selectedDate);
      // Eğer bitiş tarihi başlangıç tarihinden önceyse, bitiş tarihini başlangıç tarihine eşitle
      if (newMemberTaskEndDate < selectedDate) {
        setNewMemberTaskEndDate(selectedDate);
      }
    }
  };

  const handleNewMemberTaskEndDateChange = (event: any, selectedDate?: Date) => {
    setShowNewMemberTaskEndDatePicker(false);
    if (selectedDate) {
      setNewMemberTaskEndDate(selectedDate);
    }
  };

  // Ekip üyesi ekleme
  const handleAddMember = () => {
    if (newMemberName) {
      const formattedName = capitalizeFirstLetter(newMemberName);
      
      const newMember = {
        id: (teamMembers.length + 1).toString(),
        name: formattedName,
        role: 'Üye',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`
      };
      
      setTeamMembers([...teamMembers, newMember]);
      
      // Eğer görev başlığı girilmişse, yeni görev oluştur
      if (newMemberTaskTitle) {
        const newTask = {
          id: (tasks.length + 1).toString(),
          title: newMemberTaskTitle,
          assignee: newMember.id,
          dueDate: newMemberTaskEndDate
        };
        setTasks([...tasks, newTask]);
      }
      
      // Form alanlarını temizle
      setNewMemberName('');
      setNewMemberTaskTitle('');
      setNewMemberTaskStartDate(new Date());
      setNewMemberTaskEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
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
    if (newTaskTitle) {
      const newTask = {
        id: (tasks.length + 1).toString(),
        title: newTaskTitle,
        assignee: null,
        dueDate: newTaskDueDate
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
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

  // Görev tarihi değiştirme
  const handleNewTaskDateChange = (event: any, selectedDate?: Date) => {
    setShowNewTaskDatePicker(false);
    if (selectedDate) {
      setNewTaskDueDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={22}
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          />
          <Text variant="titleMedium" style={styles.headerTitle}>Yeni Proje</Text>
          <IconButton
            icon="check"
            size={22}
            onPress={handleCreate}
            style={styles.headerButton}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Surface style={styles.formCard} elevation={1}>
            <View style={styles.formGroup}>
              <Text variant="titleMedium" style={styles.label}>Proje Adı</Text>
              <TextInput
                mode="flat"
                value={title}
                onChangeText={setTitle}
                placeholder="Proje adını girin"
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor={theme.colors.primary}
                left={<TextInput.Icon icon="folder" color={theme.colors.primary} />}
                right={title.length > 0 ? <TextInput.Icon icon="check" color={theme.colors.primary} /> : null}
                contentStyle={styles.inputContent}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.formGroup}>
              <Text variant="titleMedium" style={styles.label}>Açıklama</Text>
              <TextInput
                mode="flat"
                value={description}
                onChangeText={setDescription}
                placeholder="Proje açıklamasını girin"
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
                underlineColor="transparent"
                activeUnderlineColor={theme.colors.primary}
                left={<TextInput.Icon icon="text" color={theme.colors.primary} />}
                contentStyle={styles.textAreaContent}
              />
              <Text style={styles.characterCount}>
                {description.length}/500 karakter
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.formGroup}>
              <Text variant="titleMedium" style={styles.label}>Tarihler</Text>
              <View style={styles.dateContainer}>
                <View style={styles.dateInputContainer}>
                  <Text variant="bodyMedium" style={styles.dateLabel}>Başlangıç Tarihi</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                    <Text style={styles.dateText}>Başlangıç: {formatDate(startDate)}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateInputContainer}>
                  <Text variant="bodyMedium" style={styles.dateLabel}>Bitiş Tarihi</Text>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={24} color="#666" />
                    <Text style={styles.dateText}>Bitiş: {formatDate(endDate)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Ekip Üyeleri Bölümü */}
            <View style={styles.formGroup}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.label}>Ekip Üyeleri</Text>
                <Button 
                  mode="contained-tonal" 
                  onPress={() => setShowAddMemberModal(true)}
                  icon="account-plus"
                  compact
                >
                  Ekle
                </Button>
              </View>
              
              {teamMembers.length > 0 ? (
                <View style={styles.teamMembersContainer}>
                  {teamMembers.map(member => (
                    <Surface key={member.id} style={styles.memberCard} elevation={1}>
                      <View style={styles.memberInfo}>
                        <Avatar.Image 
                          size={40} 
                          source={{ uri: member.avatar }} 
                          style={styles.memberAvatar}
                        />
                        <View style={styles.memberDetails}>
                          <Text variant="bodyMedium" style={styles.memberName}>{member.name}</Text>
                          <Text variant="bodySmall" style={styles.memberRole}>{member.role}</Text>
                        </View>
                      </View>
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleRemoveMember(member.id)} 
                        style={styles.memberActionButton}
                        iconColor="#ff4444"
                      />
                    </Surface>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Henüz ekip üyesi eklenmemiş</Text>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Görevler Bölümü */}
            <View style={styles.formGroup}>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.label}>Görevler</Text>
                <Button 
                  mode="contained-tonal" 
                  onPress={() => setShowAddTaskModal(true)}
                  icon="plus"
                  compact
                >
                  Ekle
                </Button>
              </View>
              
              {tasks.length > 0 ? (
                <View style={styles.tasksContainer}>
                  {tasks.map(task => (
                    <Surface key={task.id} style={styles.taskCard} elevation={1}>
                      <View style={styles.taskInfo}>
                        <Text variant="bodyMedium" style={styles.taskTitle}>{task.title}</Text>
                        <Text variant="bodySmall" style={styles.taskDueDate}>
                          Bitiş: {formatDate(task.dueDate)}
                        </Text>
                      </View>
                      <View style={styles.taskActions}>
                        {task.assignee ? (
                          <Chip 
                            icon="account" 
                            style={styles.assigneeChip}
                            onPress={() => {}}
                          >
                            {teamMembers.find(m => m.id === task.assignee)?.name || 'Atanmış'}
                          </Chip>
                        ) : (
                          <Button 
                            mode="outlined" 
                            onPress={() => {
                              if (task.id) {
                                setSelectedTask(task.id);
                                setShowAssignTaskModal(true);
                              }
                            }}
                            icon="account-plus"
                            compact
                          >
                            Ata
                          </Button>
                        )}
                      </View>
                    </Surface>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Henüz görev eklenmemiş</Text>
              )}
            </View>
          </Surface>
        </ScrollView>
      </View>

      {Platform.OS === 'ios' ? (
        <>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="spinner"
              onChange={handleStartDateChange}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="spinner"
              onChange={handleEndDateChange}
            />
          )}
        </>
      ) : (
        (showStartDatePicker || showEndDatePicker) && (
          <DateTimePicker
            value={showStartDatePicker ? startDate : endDate}
            mode="date"
            display="default"
            onChange={showStartDatePicker ? handleStartDateChange : handleEndDateChange}
          />
        )
      )}

      {/* Ekip Üyesi Ekleme Modal */}
      <Portal>
        <Modal
          visible={showAddMemberModal}
          onDismiss={() => setShowAddMemberModal(false)}
          style={styles.alertModal}
        >
          <Surface style={styles.alertContent} elevation={5}>
            <View style={styles.modalHeader}>
              <IconButton 
                icon="close" 
                size={20} 
                onPress={() => setShowAddMemberModal(false)}
                style={styles.modalCloseButton}
              />
              <Text variant="titleMedium" style={styles.modalTitle}>
                Ekip Üyesi Ekle
              </Text>
              <View style={{ width: 40 }} />
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text variant="bodySmall" style={styles.inputLabel}>İsim</Text>
                <TextInput
                  mode="flat"
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                  placeholder="Üye ismini girin"
                  style={styles.modalInput}
                  underlineColor="transparent"
                  activeUnderlineColor={theme.colors.primary}
                  left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
                />
              </View>
              
              <Divider style={styles.modalDivider} />
              
              <View style={styles.inputGroup}>
                <Text variant="bodySmall" style={styles.inputLabel}>Görev Başlığı</Text>
                <TextInput
                  mode="flat"
                  value={newMemberTaskTitle}
                  onChangeText={setNewMemberTaskTitle}
                  placeholder="Görev başlığını girin (opsiyonel)"
                  style={styles.modalInput}
                  underlineColor="transparent"
                  activeUnderlineColor={theme.colors.primary}
                  left={<TextInput.Icon icon="checkbox-marked-circle" color={theme.colors.primary} />}
                />
              </View>
              
              <View style={styles.dateRow}>
                <View style={styles.dateInputGroup}>
                  <Text variant="bodySmall" style={styles.inputLabel}>Atama Tarihi</Text>
                  <TouchableOpacity 
                    style={styles.modalDateButton}
                    onPress={() => setShowNewMemberTaskStartDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.modalDateText}>{formatDate(newMemberTaskStartDate)}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateInputGroup}>
                  <Text variant="bodySmall" style={styles.inputLabel}>Teslim Tarihi</Text>
                  <TouchableOpacity 
                    style={styles.modalDateButton}
                    onPress={() => setShowNewMemberTaskEndDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.modalDateText}>{formatDate(newMemberTaskEndDate)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button 
                mode="outlined" 
                onPress={() => setShowAddMemberModal(false)}
                style={styles.modalFooterButton}
                contentStyle={{ paddingVertical: 8 }}
                icon="close"
                textColor="#666"
                buttonColor="#f8f9fa"
              >
                İptal
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddMember}
                style={[styles.modalFooterButton, styles.addButton]}
                contentStyle={{ paddingVertical: 8 }}
                disabled={!newMemberName}
                icon="account-plus"
                buttonColor="#6200EE"
                labelStyle={{ fontWeight: 'bold', fontSize: 16, color: '#FFFFFF' }}
                elevation={2}
              >
                Ekle
              </Button>
            </View>
          </Surface>
        </Modal>

        {/* Yeni Üye Görev Tarih Seçicileri */}
        {Platform.OS === 'ios' ? (
          <>
            {showNewMemberTaskStartDatePicker && (
              <DateTimePicker
                value={newMemberTaskStartDate}
                mode="date"
                display="spinner"
                onChange={handleNewMemberTaskStartDateChange}
              />
            )}
            {showNewMemberTaskEndDatePicker && (
              <DateTimePicker
                value={newMemberTaskEndDate}
                mode="date"
                display="spinner"
                onChange={handleNewMemberTaskEndDateChange}
              />
            )}
          </>
        ) : (
          (showNewMemberTaskStartDatePicker || showNewMemberTaskEndDatePicker) && (
            <DateTimePicker
              value={showNewMemberTaskStartDatePicker ? newMemberTaskStartDate : newMemberTaskEndDate}
              mode="date"
              display="default"
              onChange={showNewMemberTaskStartDatePicker ? handleNewMemberTaskStartDateChange : handleNewMemberTaskEndDateChange}
            />
          )
        )}

        {/* Görev Ekleme Modal */}
        <Modal
          visible={showAddTaskModal}
          onDismiss={() => setShowAddTaskModal(false)}
          style={styles.modal}
        >
          <Surface style={styles.modalContent} elevation={5}>
            <Text variant="titleLarge" style={styles.modalTitle}>Görev Ekle</Text>
            
            <TextInput
              mode="flat"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="Görev başlığı"
              style={styles.modalInput}
              underlineColor="transparent"
              activeUnderlineColor={theme.colors.primary}
              left={<TextInput.Icon icon="checkbox-marked-circle" color={theme.colors.primary} />}
            />
            
            <View style={styles.dateInputContainer}>
              <Text variant="bodyMedium" style={styles.dateLabel}>Bitiş Tarihi</Text>
              <Button
                mode="outlined"
                onPress={() => setShowNewTaskDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
                contentStyle={styles.dateButtonContent}
              >
                {formatDate(newTaskDueDate)}
              </Button>
            </View>
            
            <View style={styles.modalActions}>
              <Button 
                mode="outlined" 
                onPress={() => setShowAddTaskModal(false)}
                style={styles.modalActionButton}
                contentStyle={{ paddingVertical: 8 }}
              >
                İptal
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddTask}
                style={styles.modalActionButton}
                contentStyle={{ paddingVertical: 8 }}
                disabled={!newTaskTitle}
              >
                Ekle
              </Button>
            </View>
          </Surface>
        </Modal>

        {/* Görev Atama Modal */}
        <Modal
          visible={showAssignTaskModal}
          onDismiss={() => setShowAssignTaskModal(false)}
          style={styles.modal}
        >
          <Surface style={styles.modalContent} elevation={5}>
            <Text variant="titleLarge" style={styles.modalTitle}>Görev Ata</Text>
            
            <Text variant="bodyMedium" style={styles.modalSubtitle}>
              {selectedTask ? tasks.find(t => t.id === selectedTask)?.title || 'Görev bulunamadı' : ''}
            </Text>
            
            <View style={styles.membersList}>
              {teamMembers.map(member => (
                <List.Item
                  key={member.id}
                  title={member.name}
                  description={member.role}
                  left={props => <Avatar.Image {...props} size={40} source={{ uri: member.avatar }} />}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="check"
                      size={20}
                      onPress={() => selectedTask && handleAssignTask(selectedTask, member.id)}
                    />
                  )}
                  style={styles.memberListItem}
                />
              ))}
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => setShowAssignTaskModal(false)}
              style={styles.modalButton}
              contentStyle={{ paddingVertical: 8 }}
            >
              İptal
            </Button>
          </Surface>
        </Modal>

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
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    marginTop: 30,
    height: 50,
  },
  headerButton: {
    margin: 0,
    padding: 0,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputContent: {
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  textAreaContent: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    marginBottom: 8,
    color: '#666',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  dateText: {
    marginLeft: 8,
    color: '#666',
  },
  dateButtonContent: {
    paddingVertical: 12,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxWidth: '90%',
    alignSelf: 'center',
    maxHeight: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalSubtitle: {
    marginBottom: 16,
    color: '#666',
  },
  modalButton: {
    marginTop: 16,
  },
  modalInput: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalActionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamMembersContainer: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontWeight: '500',
  },
  memberRole: {
    color: '#666',
  },
  memberActionButton: {
    margin: 0,
    padding: 0,
  },
  modalDivider: {
    marginVertical: 16,
  },
  modalDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalDateInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalDateLabel: {
    marginBottom: 8,
    color: '#666',
  },
  modalDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalDateText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  membersList: {
    marginTop: 16,
  },
  memberListItem: {
    paddingVertical: 8,
  },
  tasksContainer: {
    marginTop: 16,
  },
  taskCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  taskInfo: {
    marginBottom: 8,
  },
  taskTitle: {
    fontWeight: '500',
  },
  taskDueDate: {
    color: '#666',
    marginTop: 4,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  assigneeChip: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  alertModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    width: '90%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  alertTitle: {
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  alertMessage: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    textAlign: 'center',
  },
  alertActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  alertButton: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    margin: 0,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  modalFooterButton: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#666',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dateInputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: '#6200EE',
  },
});

export default NewProjectScreen; 