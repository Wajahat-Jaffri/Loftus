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
import PropertiesScreen from '../screens/PropertiesScreen';
import AddPropertyScreen from '../screens/AddPropertyScreen';
import PropertyPageScreen from '../screens/PropertyPageScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import PaymentDetailsScreen from '../screens/PaymentDetailsScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import GalleryViewScreen from '../screens/GalleryViewScreen';
import GalleryPhotoScreen from '../screens/GalleryPhotoScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import CreateListingScreen from '../screens/CreateListingScreen';
import CreateRentalListingScreen from '../screens/CreateRentalListingScreen';
import OffersScreen from '../screens/OffersScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import { FavoritesProvider } from '../context/FavoritesContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
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
          <Stack.Screen name="Properties" component={PropertiesScreen} />
          <Stack.Screen name="AddPropertyScreen" component={AddPropertyScreen} />
          <Stack.Screen name="PropertyPageScreen" component={PropertyPageScreen} />
          <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
          <Stack.Screen name="PaymentDetailsScreen" component={PaymentDetailsScreen} />
          <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
          <Stack.Screen name="GalleryViewScreen" component={GalleryViewScreen} />
          <Stack.Screen name="GalleryPhotoScreen" component={GalleryPhotoScreen} />
          <Stack.Screen name="Listings" component={MyListingsScreen} />
          <Stack.Screen name="CreateListingScreen" component={CreateListingScreen} />
          <Stack.Screen
            name="CreateRentalListingScreen"
            component={CreateRentalListingScreen}
          />
          <Stack.Screen name="Offers" component={OffersScreen} />
          <Stack.Screen name="OfferDetailsScreen" component={OfferDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
};

export default AppNavigator;