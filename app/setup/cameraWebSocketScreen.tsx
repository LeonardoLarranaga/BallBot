import {ActivityIndicator, Image, Linking, Pressable, StyleSheet, Text, View} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {useEffect, useState} from "react"
import {useWebSocket} from "@/components/Contexts/WebSocketContext"
import {router} from "expo-router";

export default function CameraWebSocketScreen() {

    const steps = ["Open WiFi settings and connect to \"BallBot Camera\".",
        "Confirm WiFi connection.", "Searching camera stream..."]
    const messages = ["Open Settings", "I'm connected!", "Connect to Camera"]

    const [currentStep, setCurrentStep] = useState(0)
    const [message, setMessage] = useState(messages[0])
    const [isTryingToConnect, setIsTryingToConnect] = useState(false)
    const webSocket = useWebSocket()
    const [consoleMessage, setConsoleMessage] = useState("")
    const [hasNavigated, setHasNavigated] = useState(false)

    const executeStep = async () => {
        switch (currentStep) {
            case 0:
                await Linking.openURL("App-Prefs:WIFI")
                await new Promise(resolve => setTimeout(resolve, 500))
                setCurrentStep(1)
                setMessage(messages[1])
                setConsoleMessage("Connecting to wifi")
                break
            case 1:
                setCurrentStep(2)
                setMessage(messages[2])
                setConsoleMessage("Connected to wifi")
                break
            case 2:
                setConsoleMessage("Connecting to WebSocket")
                setMessage("Connecting to Camera...")
                setIsTryingToConnect(true)

                let i = 0
                while (!webSocket.lastFrameBuffer) {
                    i += 1
                    setMessage(`Trying to connect (${i})...`)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    webSocket.connectWebSocket()
                }
                break
        }
    }

    useEffect(() => {
        if (!webSocket.lastFrameBuffer || hasNavigated) return
        setIsTryingToConnect(false)
        router.push("/controlScreen")
        setHasNavigated(true)
    }, [webSocket.lastFrameBuffer, hasNavigated])

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.titleText}>Nice! Let's connect you with the BallBot Camera via WiFi</Text>

                <Text>{consoleMessage}</Text>
                <Text>{webSocket.webSocketConsole}</Text>

                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.stepContainer}>
                            <View style={{flexDirection: "row", alignItems: "flex-start", width: "100%"}}>
                                <Text style={{
                                    fontSize: 18, fontWeight: "bold"
                                }}>{index + 1}. </Text>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: index === currentStep ? "bold" : "regular"
                                }}>{step}</Text>
                            </View>

                            {index !== steps.length - 1 && (
                                <View style={{
                                    borderStyle: 'dotted',
                                    borderWidth: 2,
                                    borderRadius: 1,
                                    height: 50,
                                    marginTop: 7,
                                    width: 0,
                                    marginBottom: -5,
                                }}/>
                            )}
                        </View>
                    ))}
                </View>

                <Pressable
                    onPress={async () => await executeStep()}
                    disabled={isTryingToConnect}
                >
                    <View style={[
                        styles.searchButton, {
                            flexDirection: "row"
                        }
                    ]}>
                        <Text style={styles.searchButtonText}>{message}</Text>

                        {isTryingToConnect && (
                            <ActivityIndicator
                                animating={true}
                                size="small"
                                color="white"
                                style={{marginLeft: 10}}
                            />
                        )}

                        {webSocket.lastFrameBuffer && (
                            <Image
                                source={{uri: webSocket.getFrameUri()}}
                                style={{width: 300, height: 200, marginTop: 20}}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </Pressable>
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
        alignItems: "center",
        width: "100%",
    },
    titleText: {
        fontSize: 32,
        fontWeight: "bold",
        paddingBottom: 5,
        marginBottom: 10,
        width: "100%",
        textAlign: "center",
    },
    stepsContainer: {
        width: "100%",
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: "center",
    },
    stepContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    searchButton: {
        borderRadius: 10,
        marginTop: 20,
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