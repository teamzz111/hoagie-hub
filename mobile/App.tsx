import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HoagiesScreen from './src/screens/Hoagies/Hoagies.Screen';
import CreateHoagiesScreen from './src/screens/CreateHogies/CreateHogies.Screen';
import LoginScreen from './src/screens/Login/Login.Screen';
import {SECONDARY_COLOR} from './src/utils/colors';
import HoagieDetailScreen from './src/screens/HoagiesDetail/HoagiesDetail.Screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const styleContainer = {
  flex: 1,
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HoagieList') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName ?? ''} size={size} color={color} />;
        },
        tabBarActiveTintColor: SECONDARY_COLOR,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="HoagieList"
        component={HoagiesScreen}
        options={{title: 'Hoagies'}}
      />
      <Tab.Screen
        name="Create"
        component={CreateHoagiesScreen}
        options={{title: 'Create'}}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaView style={styleContainer}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HoagieDetail"
            component={HoagieDetailScreen}
            options={() => ({
              title: 'Hoagie Detail',
              headerStyle: {
                backgroundColor: SECONDARY_COLOR,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
