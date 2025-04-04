import { NavigatorScreenParams } from '@react-navigation/native';

export type DrawerStackParamList = {
  Home: undefined;
  ProjectDetail: { projectId: string } | undefined;
  EditProject: { projectId: string } | undefined;
  NewProject: undefined;
  Settings: undefined;
  Profile: { from?: 'settings' } | undefined;
  Help: undefined;
  Logout: undefined;
  Login: undefined;
  PrivacyPolicy: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type DrawerScreenProps<T extends keyof DrawerStackParamList> = {
  navigation: {
    navigate: (screen: keyof DrawerStackParamList, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
  };
  route: {
    params: DrawerStackParamList[T];
  };
}; 