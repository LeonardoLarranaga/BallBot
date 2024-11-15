import {Stack} from "expo-router"
import {StyleSheet} from "react-native";
import {BluetoothProvider} from "@/components/Contexts/BluetoothContext"
import {WebSocketProvider} from "@/components/Contexts/WebSocketContext"

export default function RootLayout() {
    return (
        <BluetoothProvider>
            <WebSocketProvider>
                <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: styles.screen,
                    gestureEnabled: false
                }}>
                    <Stack.Screen name="index"/>
                    <Stack.Screen name="setup/bluetoothScreen"/>
                    <Stack.Screen name="setup/cameraWebSocketScreen"/>
                    <Stack.Screen name="controlScreen"/>
                </Stack>
            </WebSocketProvider>
        </BluetoothProvider>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "rgb(241, 241, 245)"
    },
})