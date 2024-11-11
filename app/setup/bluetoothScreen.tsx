import {SafeAreaView} from "react-native-safe-area-context"
import {Button, FlatList, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native"
import {useState} from "react"
import {useBluetooth} from "@/hooks/bluetooth/useBluetooth"
import {Ionicons} from "@expo/vector-icons";

export default function BluetoothScreen() {
    const [isScanning, setIsScanning] = useState(false)
    const bluetoothManager = useBluetooth()

    const scanForDevices = async () => {
        const granted = await bluetoothManager.requestBluetoothPermissions()
        setIsScanning(granted)
        if (granted) {
            await bluetoothManager.startScanning()
        }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text style={styles.titleText}>
                    Let's start by connecting you through Bluetooth
                </Text>

                {!isScanning && (
                    <Button
                        title={"Scan for devices"}
                        onPress={async () => await scanForDevices()}
                        disabled={isScanning}
                    />
                )}

                <View style={styles.deviceListContainer}>
                    <FlatList
                        data={bluetoothManager.foundDevices}
                        keyExtractor={(device) => device.id}
                        renderItem={({item}) => (
                            <TouchableHighlight
                                onPress={async () => {
                                    console.log(item.localName)
                                }}
                                underlayColor="#e5e7eb"
                            >
                                <View style={styles.deviceItem}>
                                    <Text style={styles.deviceText}>{item.localName}</Text>
                                    <Ionicons name="bluetooth-outline" size={24} color="#0284c7"/>
                                </View>

                            </TouchableHighlight>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
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
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
    },
    titleText: {
        fontSize: 32,
        fontWeight: "bold",
        paddingBottom: 5,
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
    deviceText: {
        fontSize: 18,
    },
})