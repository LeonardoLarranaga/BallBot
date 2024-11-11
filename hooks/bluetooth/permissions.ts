import {PermissionsAndroid, Platform} from "react-native"
import * as ExpoDevice from "expo-device"

async function requestAndroid31Permissions() {
    const bluetoothScanPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
            title: "Bluetooth Scan Permission",
            message: "This app needs access to Bluetooth Scan",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        }
    )

    const bluetoothConnectPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
            title: "Bluetooth Connect Permission",
            message: "This app needs access to Bluetooth Connect",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        }
    )

    const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Fine Location Permission",
            message: "Bluetooth Low Energy requires Location Permission",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        }
    )

    return bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED && bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED && fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED
}

async function requestLowerAndroidPermissions() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
        }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
}

export default async function requestPermissions() {
    if (Platform.OS === "android")
        return ExpoDevice.platformApiLevel ?? -1 >= 31 ? await requestAndroid31Permissions() : await requestLowerAndroidPermissions()
    return true
}