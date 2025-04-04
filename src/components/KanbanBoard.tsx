import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Task, TaskStatus } from '../types/project';
import { useTheme } from 'react-native-paper';
import { CustomTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
}

const COLUMN_WIDTH = Dimensions.get('window').width * 0.8;

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskPress }) => {
  const theme = useTheme() as CustomTheme;
  const columns: TaskStatus[] = ['yapilacak', 'devam', 'test', 'tamamlanan'];

  const getColumnTitle = (status: TaskStatus): string => {
    switch (status) {
      case 'yapilacak':
        return 'Yapılacak';
      case 'devam':
        return 'Devam Eden';
      case 'test':
        return 'Test';
      case 'tamamlanan':
        return 'Tamamlanan';
      default:
        return '';
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'yapilacak':
        return theme.colors.primary || '#000000';
      case 'devam':
        return theme.colors.secondary || '#000000';
      case 'test':
        return theme.colors.tertiary || '#000000';
      case 'tamamlanan':
        return theme.colors.primary || '#000000';
      default:
        return theme.colors.primary || '#000000';
    }
  };

  const renderTask = (task: Task) => {
    return (
      <TouchableOpacity
        key={task.id}
        style={[
          styles.taskCard,
          { backgroundColor: theme.colors.card }
        ]}
        onPress={() => onTaskPress?.(task)}
      >
        <Text style={[styles.taskTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.taskDescription, { color: theme.colors.text + '99' }]} numberOfLines={2}>
            {task.description}
          </Text>
        )}
        <View style={styles.taskFooter}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${task.progress}%`, backgroundColor: getStatusColor(task.status) }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text + '99' }]}>
              {task.progress}%
            </Text>
          </View>
          {task.assignee && (
            <View style={[styles.assigneeChip, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="person" size={12} color={theme.colors.primary} />
              <Text style={[styles.assigneeText, { color: theme.colors.primary }]} numberOfLines={1}>
                {task.assignee}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {columns.map(status => {
        const columnTasks = tasks.filter(task => task.status === status);
        return (
          <View key={status} style={[styles.column, { width: COLUMN_WIDTH }]}>
            <View style={[styles.columnHeader, { backgroundColor: getStatusColor(status) + '20' }]}>
              <Text style={[styles.columnTitle, { color: getStatusColor(status) }]}>
                {getColumnTitle(status)} ({columnTasks.length})
              </Text>
            </View>
            <ScrollView
              style={[styles.tasksContainer, { backgroundColor: theme.colors.background + '80' }]}
              showsVerticalScrollIndicator={false}
            >
              {columnTasks.map(task => renderTask(task))}
              {columnTasks.length === 0 && (
                <Text style={[styles.emptyText, { color: theme.colors.text + '60' }]}>
                  Bu kolonda görev yok
                </Text>
              )}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  column: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  columnHeader: {
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  tasksContainer: {
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    minHeight: 400,
  },
  taskCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    marginTop: 2,
  },
  assigneeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  assigneeText: {
    fontSize: 10,
    marginLeft: 4,
    maxWidth: 80,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 16,
  },
});

export default KanbanBoard;
