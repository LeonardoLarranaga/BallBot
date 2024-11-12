import {SafeAreaView} from "react-native-safe-area-context"
import {Alert, Button, StyleSheet, Text, View} from "react-native"
import {useEffect, useState} from "react"
import {useBluetooth} from "@/components/BluetoothContext"
import {router} from "expo-router"
import {UUIDs} from "@/constants/UUIDs"
import {Characteristic} from "react-native-ble-plx"
import {btoa} from "react-native-quick-base64"

export default function ControlScreen() {

    const bluetoothManager = useBluetooth()
    const [ballBotReceiveCharacteristic, setBallBotReceiveCharacteristic] = useState<Characteristic | undefined>(undefined)

    const restartAlert = (message: string) => {
        Alert.alert("Oh, No!", message, [{
            text: "Restart",
            onPress: async () => {
                await bluetoothManager.restart()
                router.dismissAll()
            }
        }])
    }

    // setup ballbot and ballbot camera services and characteristics
    useEffect(() => {
        const setupBallbot = async () => {
            try {
                const service = (await bluetoothManager.ballBot?.services())?.find(service => service.uuid === UUIDs.ballBotService)
                if (!service) restartAlert("BallBot service not found.")
                const receiveCharacteristic = (await service?.characteristics())?.find(characteristic => characteristic.uuid === UUIDs.ballBotReceiveCharacteristic)
                if (!receiveCharacteristic) restartAlert("BallBot receive characteristic not found.")
                setBallBotReceiveCharacteristic(receiveCharacteristic)
            } catch (error) {
                console.error(error)
            }
        }

        setupBallbot().catch()
    }, [])

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text>Control Screen</Text>
                <Button
                    title={"Test BallBot receive characteristic"}
                    onPress={async () => {
                        for (let i = 0; i < 10; i++) {
                            try {
                                await ballBotReceiveCharacteristic?.writeWithoutResponse((btoa(i.toString())))
                                console.log(`Successfully sent ${i}`)
                            } catch (error) {
                                console.error(error)
                            }

                        }
                    }}
                />

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
})