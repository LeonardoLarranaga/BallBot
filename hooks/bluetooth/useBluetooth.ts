import requestPermissions from "@/hooks/bluetooth/permissions"
import {useState} from "react"
import {Device} from "react-native-ble-plx"
import {scanForPeripherals} from "@/hooks/bluetooth/peripherals"

export function useBluetooth() {
    const [foundDevices, setFoundDevices] = useState<Device[]>([])
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([])

    async function requestBluetoothPermissions() {
        return requestPermissions()
    }

   async function startScanning() {
        await scanForPeripherals(setFoundDevices)
   }

    return {
        foundDevices,
        connectedDevices,
        requestBluetoothPermissions,
        startScanning
    }
}