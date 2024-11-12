import {SafeAreaView} from "react-native-safe-area-context"
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native"
import {useEffect, useState} from "react"
import {useBluetooth} from "@/components/BluetoothContext"
import * as ScreenOrientation from "expo-screen-orientation"
import {Device} from "react-native-ble-plx"
import {router} from "expo-router"

export default function BluetoothScreen() {
    const [isScanning, setIsScanning] = useState(false)
    const [searchingElapsedTime, setSearchingElapsedTime] = useState(0)
    const [connectingElapsedTime, setConnectingElapsedTime] = useState(0)
    const [message, setMessage] = useState("Tap to search for BallBot")

    const [ballBotFound, setBallBotFound] = useState(false)
    const [ballBotConnected, setBallBotConnected] = useState(false)
    const [esp32CamFound, setEsp32CamFound] = useState(false)

    const bluetoothManager = useBluetooth()

     const restartAlert = (message: string) => {
        Alert.alert("Oh, No!", message, [{
            text: "Restart",
            onPress: async () => {
                await bluetoothManager.restart()
                router.dismissAll()
            }
        }])
    }

    const scanForDevices = async () => {
        if (ballBotFound) router.push("/controlScreen")
        const granted = await bluetoothManager.requestBluetoothPermissions()
        setIsScanning(granted)
        if (granted) {
            bluetoothManager.clearFoundDevices()
            await bluetoothManager.startScanning()
            setSearchingElapsedTime(0)
            setMessage(!ballBotConnected ? "Searching for BallBot..." : "Searching for BallBot Camera...")
        } else {
            Alert.alert("Bluetooth permissions required", "Enable Bluetooth permissions in the Settings app to continue.", [{
                text: "OK",
                onPress: () => {}
            }])
        }
    }

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch()
        return () => {
            ScreenOrientation.unlockAsync().catch()
        }
    }, [])

    useEffect(() => {
        if (isScanning) {
            const timer = setInterval(() => {
                setSearchingElapsedTime((prev) => prev + 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isScanning])

    useEffect(() => {
        if (!ballBotConnected ? ballBotFound : esp32CamFound) return
        const ballBot = bluetoothManager.foundDevices.find((device) => device.localName === (!ballBotConnected ? "BallBot" : "BallBot Camera"))
        if (!ballBot) return
        if (!ballBotConnected) setBallBotFound(true)
        else setEsp32CamFound(true)
        setMessage((!ballBotConnected ? "BallBot" : "BallBot Camera") + " found!\nEstablishing connection...")

        const connectToBallBot = async (ballBot: Device) => {
            try {
                await bluetoothManager.connectToDevice(ballBot)
                setBallBotConnected(true)
                bluetoothManager.ballBot?.onDisconnected(() => {
                  restartAlert("BallBot got disconnected.")
                })
                if (!esp32CamFound) {
                    setMessage("Tap to search for BallBot Camera")
                    setIsScanning(false)
                    setSearchingElapsedTime(0)
                    setConnectingElapsedTime(0)
                } else {
                    router.push("/controlScreen")
                    bluetoothManager.ballBotCamera?.onDisconnected(() => {
                      restartAlert("BallBot Camera got disconnected.")
                    })
                    await bluetoothManager.stopScanning()
                }
            } catch (error) {
                console.error(error)
                setConnectingElapsedTime(5)
            }
        }

        connectToBallBot(ballBot).catch()
    }, [bluetoothManager.foundDevices])

    useEffect(() => {
        if (ballBotFound) {
            const timer = setTimeout(() => {
                setConnectingElapsedTime((prev) => prev + 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [ballBotFound])

    const restartAll = () => {
        setIsScanning(false)
        setSearchingElapsedTime(0)
        setConnectingElapsedTime(0)
        setMessage(!ballBotConnected ? "Tap to search for BallBot" : "Tap to search for BallBot Camera")
        if (!ballBotConnected) setBallBotFound(false)
        else setEsp32CamFound(false)
        bluetoothManager.clearFoundDevices()
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.titleText}>
                    {!ballBotConnected ? "Let's start by connecting you through Bluetooth" : "Nice!\nLet's connect you with the BallBot Camera. (Logic implemented, waiting for ESP32-Cam delivery)"}
                </Text>

                <Pressable
                    onPress={async () => await scanForDevices()}
                    disabled={isScanning}
                >
                    <View style={[
                        styles.searchButton, {
                            flexDirection: (!ballBotConnected ? ballBotFound : esp32CamFound) ? "column" : "row",
                        }
                    ]}>
                        <Text style={styles.searchButtonText}>{message}</Text>

                        {isScanning && (
                            <ActivityIndicator
                                animating={true}
                                size="small"
                                color="white"
                                style={{
                                    marginTop: (!ballBotConnected ? ballBotFound : esp32CamFound) ? 10 : 0,
                                    marginLeft: isScanning && !(!ballBotConnected ? ballBotFound : esp32CamFound) ? 10 : 0
                                }}
                            />
                        )}
                    </View>
                </Pressable>

                {searchingElapsedTime >= 10 && !(!ballBotConnected ? ballBotFound : esp32CamFound) && (
                    <View style={styles.timeoutTextContainer}>
                        <Text style={{fontSize: 14}}>
                            {"It's seems like we are having trouble finding " + (!ballBotConnected ? "BallBot." : "the BallBot Camera") + ".\nPlease make sure it's turned on and in range."}
                        </Text>
                    </View>
                )}

                {connectingElapsedTime >= 5 && (!ballBotConnected ? ballBotFound : esp32CamFound) && (
                    <View style={styles.timeoutTextContainer}>
                        <View>
                            <Text style={{fontSize: 14}}>
                                {"There seems to be an issue connecting to " + (!ballBotConnected ? "BallBot" : "the BallBot Camera") + ".\n"}
                            </Text>
                            <Pressable onPress={() => restartAll()}>
                                <Text style={{fontSize: 14, color: "#0284c7", textDecorationLine: "underline"}}>
                                    Tap to try again.
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
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
    titleText: {
        fontSize: 32,
        fontWeight: "bold",
        paddingBottom: 5,
        width: "100%",
        textAlign: "center",
    },
    timeoutTextContainer: {
        position: "absolute",
        bottom: 0,
        padding: 5,
        width: "100%",
        justifyContent: "center",
        backgroundColor: "rgba(156,163,175,0.21)",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "baseline"
    },
    searchButton: {
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#191821"
    },
    searchButtonText: {
        fontSize: 22,
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
    },
})