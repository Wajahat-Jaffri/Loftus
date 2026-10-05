import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CreateNewPasswordScreen from '../screens/CreateNewPasswordScreen';
import CheckMailScreen from '../screens/CheckMailScreen';
import ChangePhoneNumberScreen from '../screens/ChangePhoneNumberScreen';
import PropertyListingScreen from '../screens/PropertyListingScreen';
import FilterScreen from '../screens/FilterScreen';
import MapViewScreen from '../screens/MapViewScreen';
import PropertyDetailsScreen from '../screens/PropertyDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { FavoritesProvider } from '../context/FavoritesContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <FavoritesProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PropertyListingScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="CreateNewPasswordScreen" component={CreateNewPasswordScreen} />
        <Stack.Screen name="CheckMailScreen" component={CheckMailScreen} />
        <Stack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen} />
        <Stack.Screen name="PropertyListingScreen" component={PropertyListingScreen} />
        <Stack.Screen name="Filters" component={FilterScreen} />
        <Stack.Screen name="MapViewScreen" component={MapViewScreen} />
        <Stack.Screen name="PropertyDetailsScreen" component={PropertyDetailsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </FavoritesProvider>
  );
};

export default AppNavigator;
