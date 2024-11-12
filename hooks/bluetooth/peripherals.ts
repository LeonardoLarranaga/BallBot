import bluetoothManager from "@/hooks/bluetooth/bluetoothManager"
import {Device} from "react-native-ble-plx";

export const scanForPeripherals = async (
    setFoundDevices: any
) => {
    await bluetoothManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            console.error(error)
        }

        if (device && device.localName) {
            setFoundDevices((prev: any) => {
                if (!prev.find((d: any) => d.id === device.id)) {
                    console.log(device.localName)
                    return [...prev, device]
                }
                return prev
            })
        }
    })
}

export const connectTo = async (
    device: Device, setConnectedDevices: any
) => {
    try {
        const connectedDevice = await bluetoothManager.connectToDevice(device.id)
        setConnectedDevices((prev: any) => {
            if (!prev.find((d: any) => d.id === connectedDevice.id)) {
                return [...prev, connectedDevice]
            }
            return prev
        })
        await connectedDevice.discoverAllServicesAndCharacteristics()
        await bluetoothManager.stopDeviceScan()
    } catch (error) {
        throw error
    }
}