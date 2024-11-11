import {Pressable, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";

export default function Index() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={styles.titleText}>BallBot</Text>

            <Pressable>
                <Link href="/setup/bluetoothScreen">
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Start</Text>
                    </View>
                </Link>
            </Pressable>

            <View style={styles.devsContainer}>
                <Text style={styles.devsText}>Leonardo Larrañaga && Kadir Josafat Pérez</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 52,
        fontWeight: "bold",
        paddingBottom: 5,
    },
    devsContainer: {
        position: "absolute",
        bottom: 50,
        borderRadius: 12,
        padding: 5,
    },
    devsText: {
        fontSize: 16,
        fontWeight: "500",
        color: "rgba(45,55,72,0.58)",
    },
    button: {
        backgroundColor: "#e2e8f0",
        paddingVertical: 8,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
})