import {Device} from "react-native-ble-plx"
import React, {useState} from "react"
import requestPermissions from "@/hooks/bluetooth/permissions"
import {connectTo, scanForPeripherals} from "@/hooks/bluetooth/peripherals"
import bluetoothManager from "@/hooks/bluetooth/bluetoothManager";

interface BluetoothContextType {
    foundDevices: Device[]
    connectedDevices: Device[]
    startScanning: () => Promise<void>
    connectToDevice: (device: Device) => Promise<void>
    clearFoundDevices: () => void
    requestBluetoothPermissions: () => Promise<boolean>,
    ballBot: Device | undefined,
    restart: () => Promise<void>,
    stopScanning: () => Promise<void>
}

const BluetoothContext = React.createContext<BluetoothContextType | undefined>(undefined)

export const BluetoothProvider = ({children}: { children: React.ReactNode }) => {
    const [foundDevices, setFoundDevices] = useState<Device[]>([])
    const [connectedDevices, setConnectedDevices] = useState<Device[]>([])

    async function requestBluetoothPermissions() {
        return requestPermissions()
    }

    async function startScanning() {
        await scanForPeripherals(setFoundDevices)
    }

    function clearFoundDevices() {
        setFoundDevices([])
    }

    async function connectToDevice(Device: Device) {
        await connectTo(Device, setConnectedDevices)
    }

    async function restart() {
        for (const device of connectedDevices) await device.cancelConnection()
        setConnectedDevices([])
        setFoundDevices([])
    }

    async function stopScanning() {
        await bluetoothManager.stopDeviceScan()
    }

    const ballBot = foundDevices.find(device => device.name === "BallBot")

    return (
        <BluetoothContext.Provider value={{
            foundDevices,
            connectedDevices,
            connectToDevice,
            clearFoundDevices,
            requestBluetoothPermissions,
            startScanning,
            ballBot,
            restart,
            stopScanning
        }}>
            {children}
        </BluetoothContext.Provider>
    )
}

export const useBluetooth = () => {
    const context = React.useContext(BluetoothContext)
    if (!context) {
        throw new Error("useBluetooth must be used within a BluetoothProvider")
    }
    return context
}