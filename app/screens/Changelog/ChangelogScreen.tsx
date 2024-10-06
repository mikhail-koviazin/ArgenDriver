import React, { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { spacing } from "../../theme"
import { i18n } from "app/i18n"
import { ChangelogEntry } from "app/i18n/en"

export const ChangelogScreen: FC<DemoTabScreenProps<"Changelog">> = function StartTestScreen(
  _props,
) {
    const [changes, setChanges] = useState<ChangelogEntry[]>([]);

    useEffect(() => {
        const unsubscribe = _props.navigation.addListener("focus", () => {
            setChanges(i18n.translate<ChangelogEntry[]>(["changelogScreen.changes"], {
                returnObjects: true,
            }) as ChangelogEntry[]);
        });
        return unsubscribe;
    }, [_props.navigation]);

  return (
    <Screen preset="scroll" style={$container} safeAreaEdges={["bottom"]} ScrollViewProps={{alwaysBounceVertical: false}}>
      <Text preset="heading" tx="changelogScreen.title" style={$title} />
        {
            changes.reverse().map((change, index) => (
                <View key={index}>
                    <Text preset="bold" text={`${change.version} (${change.date})`} />
                    {
                        change.list.map((item, index) => (
                            <Text key={index} text={`- ${item}`} />
                        ))
                    }
                </View>
            ))
        }
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  display: "flex",
  gap: spacing.xl,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}
