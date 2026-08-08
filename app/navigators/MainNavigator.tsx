import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { StartTestScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ChangelogScreen } from "app/screens/Changelog/ChangelogScreen"
import { SettingsScreen } from "app/screens/SettingsScreen/SettingsScreen"

export type MainTabParamList = {
  StartTest: undefined
  Changelog: undefined
  Settings: undefined
}

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="StartTest"
        component={StartTestScreen}
        options={{
          tabBarLabel: translate("mainNavigator.startTestTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="components" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Changelog"
        component={ChangelogScreen}
        options={{
          tabBarLabel: translate("mainNavigator.changeLogTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: translate("mainNavigator.settingsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
