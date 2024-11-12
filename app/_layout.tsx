import {Stack} from "expo-router"
import {StyleSheet} from "react-native";
import {BluetoothProvider} from "@/components/BluetoothContext";

export default function RootLayout() {
    return (
        <BluetoothProvider>
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: styles.screen
            }}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="setup/bluetoothScreen" options={backDisabled}/>
            </Stack>
        </BluetoothProvider>
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