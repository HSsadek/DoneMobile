import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Platform, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DrawerScreenProps } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { DrawerStackParamList } from '../../navigation/types';
import { sampleProjects } from '../home/HomeScreen';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = DrawerScreenProps<'EditProject'>;
type TaskStatus = 'yapilacak' | 'devam' | 'test' | 'tamamlanan';

const EditProjectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { projectId } = route.params;
  const project = sampleProjects.find(p => p.id === projectId);
  const [projectTitle, setProjectTitle] = useState(project?.title || 'Proje Adı');
  const [projectDescription, setProjectDescription] = useState(project?.description || 'Proje açıklaması buraya gelecek...');
  const [startDate, setStartDate] = useState(new Date(project?.startDate || Date.now()));
  const [endDate, setEndDate] = useState(new Date(project?.endDate || Date.now()));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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

  const handleSave = () => {
    if (project) {
      // Proje detaylarını güncelle
      project.title = projectTitle;
      project.description = projectDescription;
      project.startDate = startDate.toISOString();
      project.endDate = endDate.toISOString();
      
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

            {Platform.OS === 'android' ? (
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
            ) : (
              <>
                <Modal
                  visible={showStartDatePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowStartDatePicker(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowStartDatePicker(false)}
                          style={styles.modalButton}
                        >
                          <Text style={styles.modalButtonText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShowStartDatePicker(false)}
                          style={styles.modalButton}
                        >
                          <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Tamam</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="spinner"
                        onChange={handleStartDateChange}
                        minimumDate={new Date()}
                      />
                    </View>
                  </View>
                </Modal>

                <Modal
                  visible={showEndDatePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowEndDatePicker(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          onPress={() => setShowEndDatePicker(false)}
                          style={styles.modalButton}
                        >
                          <Text style={styles.modalButtonText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setShowEndDatePicker(false)}
                          style={styles.modalButton}
                        >
                          <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Tamam</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="spinner"
                        onChange={handleEndDateChange}
                        minimumDate={startDate}
                      />
                    </View>
                  </View>
                </Modal>
              </>
            )}
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalButtonTextPrimary: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default EditProjectScreen; 