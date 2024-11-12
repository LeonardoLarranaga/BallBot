import {Device} from "react-native-ble-plx"
import React, {useState} from "react"
import requestPermissions from "@/hooks/bluetooth/permissions"
import {connectTo, scanForPeripherals} from "@/hooks/bluetooth/peripherals"

interface BluetoothContextType {
    foundDevices: Device[]
    connectedDevices: Device[]
    startScanning: () => Promise<void>
    connectToDevice: (device: Device) => Promise<void>
    clearFoundDevices: () => void
    requestBluetoothPermissions: () => Promise<boolean>,
    ballBot: Device | undefined,
    ballBotCamera: Device | undefined,
    restart: () => Promise<void>
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

    const ballBot = foundDevices.find(device => device.name === "BallBot")
    const ballBotCamera = foundDevices.find(device => device.name === "BallBot Camera")

    return (
        <BluetoothContext.Provider value={{
            foundDevices,
            connectedDevices,
            connectToDevice,
            clearFoundDevices,
            requestBluetoothPermissions,
            startScanning,
            ballBot,
            ballBotCamera,
            restart
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