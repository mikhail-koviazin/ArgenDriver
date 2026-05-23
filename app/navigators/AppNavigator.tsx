import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { Platform, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { MainNavigator, MainTabParamList } from "./MainNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"

export type AppStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>
  Test: { questionsCount: number; forceQuestion?: number }
}

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

const Stack = createNativeStackNavigator<AppStackParamList>()

if (Platform.OS === "web") {
  const styles = document.createElement("style")
  styles.id = "app-styles"
  styles.innerHTML = `
    @media screen and (min-width: 512px){
      body {
        background-color: #f7f7f7;
      }
      #root {
        margin: auto;
        margin-top: 5vh;
        margin-bottom: 5vh;
        height: 90vh;
        max-width: 512px;
        border: 1px solid #e1e1e1;
        shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
    }
  `
  const existingStyles = document.getElementById(styles.id)
  if (existingStyles) {
    existingStyles.remove()
  }
  document.documentElement.appendChild(styles)
}

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Test" component={Screens.TestScreen} />
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
