import {Stack} from "expo-router"
import {StyleSheet} from "react-native";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
            contentStyle: styles.screen
        }}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="setup/bluetoothScreen" options={backDisabled}/>
        </Stack>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "rgb(241, 241, 245)"
    },
})

const backDisabled = {
    gestureEnabled: false,
}