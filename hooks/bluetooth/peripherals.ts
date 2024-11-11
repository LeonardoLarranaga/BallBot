import bluetoothManager from "@/hooks/bluetooth/bluetoothManager"

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