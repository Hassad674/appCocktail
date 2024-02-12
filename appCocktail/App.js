import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Composant
import CocktailList from "./src/components/CocktailList";
import Profile from "./src/components/Profile";
import Detail from "./src/components/CocktailDetail";
import Favorite from "./src/components/Favorite";

const Stack = createNativeStackNavigator();

class Home extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={CocktailList} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    );
  }
}

const Tab = createBottomTabNavigator();

class MyTabs extends React.Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#DE60CA'
        }}
        initialRouteName="Cocktails">
        <Tab.Screen
          name="Cocktails"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Fontisto name="wink" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={Favorite}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons name={focused ? 'favorite' : 'favorite-border'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
  },
});
