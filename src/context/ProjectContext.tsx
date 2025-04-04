import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TeamMember, Task, TaskStatus } from '../types/project';
import { generateId } from '../utils/idGenerator';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  tasks: number;
  members: number;
  startDate: string;
  endDate: string;
  team: TeamMember[];
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    assignedTo: string;
    progress: number;
  }>;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProjectToNextStage: (id: string) => void;
  moveProjectToPreviousStage: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from storage when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('projects');
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load projects from storage:', error);
        setIsLoaded(true);
      }
    };

    loadProjects();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveProjects = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('projects', JSON.stringify(projects));
        } catch (error) {
          console.error('Failed to save projects to storage:', error);
        }
      }
    };

    saveProjects();
  }, [projects, isLoaded]);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject = {
      ...projectData,
      id: generateId(),
    };
    
    setProjects(currentProjects => [...currentProjects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(currentProjects => 
      currentProjects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(currentProjects => 
      currentProjects.filter(project => project.id !== id)
    );
  };

  const moveProjectToNextStage = (id: string) => {
    setProjects(currentProjects => 
      currentProjects.map(project => {
        if (project.id !== id) return project;
        
        let newStatus: TaskStatus = project.status;
        let newProgress = project.progress;
        
        switch (project.status) {
          case 'yapilacak':
            newStatus = 'devam';
            newProgress = 25;
            break;
          case 'devam':
            newStatus = 'test';
            newProgress = 75;
            break;
          case 'test':
            newStatus = 'tamamlanan';
            newProgress = 100;
            break;
          case 'tamamlanan':
            // Already at final stage
            break;
        }
        
        return { ...project, status: newStatus, progress: newProgress };
      })
    );
  };

  const moveProjectToPreviousStage = (id: string) => {
    setProjects(currentProjects => 
      currentProjects.map(project => {
        if (project.id !== id) return project;
        
        let newStatus: TaskStatus = project.status;
        let newProgress = project.progress;
        
        switch (project.status) {
          case 'yapilacak':
            // Already at initial stage
            break;
          case 'devam':
            newStatus = 'yapilacak';
            newProgress = 0;
            break;
          case 'test':
            newStatus = 'devam';
            newProgress = 25;
            break;
          case 'tamamlanan':
            newStatus = 'test';
            newProgress = 75;
            break;
        }
        
        return { ...project, status: newStatus, progress: newProgress };
      })
    );
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        addProject, 
        updateProject, 
        deleteProject, 
        moveProjectToNextStage,
        moveProjectToPreviousStage,
        getProjectById
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
