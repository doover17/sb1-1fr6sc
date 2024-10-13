import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";

import { HomeScreen } from "./HomeScreen";
import { CharacterSheetScreen } from "./CharacterSheetScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#65adf1",
                },
                headerTintColor: "#ffffff",
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Character Sheets" }}
            />
            <StackNavigator.Screen
                name="CharacterSheet"
                component={CharacterSheetScreen}
                options={{ title: "Character Sheet" }}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);