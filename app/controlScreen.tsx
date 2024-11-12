import {SafeAreaView} from "react-native-safe-area-context"
import {StyleSheet, Text, View} from "react-native"

export default function ControlScreen() {
    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.container}>
                <Text>Control Screen</Text>
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