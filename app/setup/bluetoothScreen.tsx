import {SafeAreaView} from "react-native-safe-area-context"
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList, Pressable,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native"
import {useEffect, useState} from "react"
import {useBluetooth} from "@/hooks/bluetooth/useBluetooth"
import * as ScreenOrientation from "expo-screen-orientation"
import {Ionicons} from "@expo/vector-icons";
import {Device} from "react-native-ble-plx";

export default function BluetoothScreen() {
    const [isScanning, setIsScanning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [message, setMessage] = useState("Tap to search for BallBot")
    const [ballBotFound, setBallBotFound] = useState(false)
    const bluetoothManager = useBluetooth()

    const scanForDevices = async () => {
        console.log("Scanning for devices")
        const granted = await bluetoothManager.requestBluetoothPermissions()
        setIsScanning(granted)
        if (granted) {
            bluetoothManager.clearFoundDevices()
            await bluetoothManager.startScanning()
            setElapsedTime(0)
            setMessage("Searching for BallBot...")
        } else {
            Alert.alert("Bluetooth permissions required", "Enable Bluetooth permissions in the Settings app to continue.", [{
                text: "OK",
                onPress: () => {
                }
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
                setElapsedTime((prev) => {
                    return prev + 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isScanning])

    useEffect(() => {
        if (ballBotFound) return
        const ballBot = bluetoothManager.foundDevices.find((device) => device.localName === "BallBot")
        if (!ballBot) return
        setBallBotFound(true)
        setMessage("BallBot found!\nEstablishing connection...")

        const connectToBallBot = async (ballBot: Device) => {
            try {
                await bluetoothManager.connectToDevice(ballBot)
            } catch (error) {
                console.error(error)
            }
        }

        connectToBallBot(ballBot).catch()
    }, [bluetoothManager.foundDevices])

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.titleText}>
                    Let's start by connecting you through Bluetooth
                </Text>

                <Pressable
                    onPress={async () => await scanForDevices()}
                    disabled={isScanning}
                >
                    <View style={[
                        styles.searchButton, {
                            flexDirection: ballBotFound ? "column" : "row",
                        }
                    ]}>
                        <Text style={styles.searchButtonText}>{message}</Text>

                        {isScanning && (
                            <ActivityIndicator
                                animating={true}
                                size="small"
                                color="white"
                                style={{
                                    marginTop: ballBotFound ? 10 : 0,
                                    marginLeft: isScanning && !ballBotFound ? 10 : 0
                                }}
                            />
                        )}
                    </View>
                </Pressable>

                {elapsedTime >= 10 && !ballBotFound && (
                    <View style={styles.timeoutTextContainer}>
                        <Text style={{fontSize: 14}}>
                            {"It's seems like we are having trouble finding BallBot.\nPlease make sure it's turned on and in range."}
                        </Text>
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
    deviceListContainer: {
        width: "100%",
        backgroundColor: 'white',
        borderRadius: 10,
    },
    deviceItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeoutTextContainer: {
        position: "absolute",
        bottom: 0,
        marginTop: 10,
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