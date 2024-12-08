import {SafeAreaView} from "react-native-safe-area-context"
import {Alert, Button, StyleSheet, Text, View} from "react-native"
import {useEffect, useState} from "react"
import {useBluetooth} from "@/components/Contexts/BluetoothContext"
import {router} from "expo-router"
import {UUIDs} from "@/constants/UUIDs"
import {Characteristic} from "react-native-ble-plx"
import {btoa} from "react-native-quick-base64"
import {useWebSocket} from "@/components/Contexts/WebSocketContext"
import {ColorConversionCodes, Mat, ObjectType, OpenCV} from "react-native-fast-opencv/src"

export default function ControlScreen() {

    const bluetoothManager = useBluetooth()
    const [ballBotReceiveCharacteristic, setBallBotReceiveCharacteristic] = useState<Characteristic | undefined>(undefined)

    const {lastFrameBuffer, getFrameUri} = useWebSocket()
    const [firstFrame, setFirstFrame] = useState<Mat | undefined>(undefined)
    const [canSetFirstFrame, setCanSetFirstFrame] = useState(true)
    const [referencePixel, setReferencePixel] = useState({x: 0, y: 0})

    const restartAlert = (message: string, action: () => void) => {
        Alert.alert("Oh, No!", message, [{
            text: "Restart",
            onPress: async () => {
                await bluetoothManager.restart()
                action()
            }
        }])
    }

    // setup ballbot services and characteristics
    useEffect(() => {
        const goBackToBluetoothScreen = () => {
            router.dismiss(2)
        }

        const setupBallbot = async () => {
            try {
                const service = (await bluetoothManager.ballBot?.services())?.find(service => service.uuid === UUIDs.ballBotService)
                if (!service) {
                    restartAlert("BallBot service not found.", goBackToBluetoothScreen)
                    return
                }

                const receiveCharacteristic = (await service?.characteristics())?.find(characteristic => characteristic.uuid === UUIDs.ballBotReceiveCharacteristic)
                if (!receiveCharacteristic) {
                    restartAlert("BallBot receive characteristic not found.", goBackToBluetoothScreen)
                    return
                }
                setBallBotReceiveCharacteristic(receiveCharacteristic)
            } catch (error) {
                restartAlert("Error setting up BallBot services and characteristics.", goBackToBluetoothScreen)
            }
        }

        // bluetoothManager.ballBot?.onDisconnected(() => {
        //     restartAlert("BallBot got disconnected.", goBackToBluetoothScreen)
        // })
        //
        // setupBallbot().catch()
    }, [])

    useEffect(() => {
        if (!lastFrameBuffer) return
        const base64 = getFrameUri()
        const image = OpenCV.base64ToMat(base64)
        const gray = image

        const size = {width: 480, height: 320}

        OpenCV.invoke('cvtColor', image, gray, ColorConversionCodes.COLOR_BGR2GRAY)
        OpenCV.clearBuffers()

        const kSize = OpenCV.createObject(ObjectType.Size, 35, 35)
        OpenCV.invoke('GaussianBlur', gray, gray, kSize, 0)
        OpenCV.clearBuffers()

        if (canSetFirstFrame && !firstFrame) {
            setFirstFrame(gray)
            setCanSetFirstFrame(false)
            setReferencePixel({x: size.width / 2.0, y: size.height / 2.0})
            return
        }

        const frameDelta = gray
        OpenCV.invoke('absdiff', firstFrame, gray, frameDelta)



    }, [lastFrameBuffer])

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