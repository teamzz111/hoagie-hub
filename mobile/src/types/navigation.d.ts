export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;

  Main: undefined;

  HoagieDetail: {
    id: string;
    name: string;
  };

  CreateHoagie: undefined;
  EditHoagie: {
    id: string;
    name?: string;
  };

  AddCollaborators: {
    hoagieId: string;
    hoagieName: string;
  };
};

export type MainTabParamList = {
  HoagieList: undefined;
  Create: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyHoagies: undefined;
  Collaborations: undefined;
};
