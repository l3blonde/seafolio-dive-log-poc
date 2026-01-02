/* global navigator */
/**
 * @typedef {Object} BluetoothDevice
 * @property {string} id
 * @property {string} name
 * @property {BluetoothRemoteGATTServer} gatt
 */

/**
 * @typedef {Object} BluetoothRemoteGATTServer
 * @property {boolean} connected
 * @property {function(number): Promise<BluetoothRemoteGATTService>} getPrimaryService
 * @property {function} disconnect
 */

/**
 * @typedef {Object} BluetoothRemoteGATTService
 * @property {function(number): Promise<BluetoothRemoteGATTCharacteristic>} getCharacteristic
 */

/**
 * @typedef {Object} BluetoothRemoteGATTCharacteristic
 * @property {function(): Promise<DataView>} readValue
 */

// Standard Bluetooth GATT services
const GATT_SERVICES = {
    BATTERY: 0x180f, // Battery Service
    DEVICE_INFO: 0x180a, // Device Information Service
}

// Standard Bluetooth GATT characteristics
const GATT_CHARACTERISTICS = {
    BATTERY_LEVEL: 0x2a19, // Battery Level (percentage 0-100)
    MANUFACTURER_NAME: 0x2a29, // Manufacturer Name String
    MODEL_NUMBER: 0x2a24, // Model Number String
}

const BLE = {
    device: null,
    server: null,

    scan: async () => {
        if (!navigator.bluetooth) {
            throw new Error("Web Bluetooth not supported in this browser. Use Chrome, Edge, or Opera.")
        }

        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
            })

            console.log("Device selected:", device.name || "Unknown Device")

            BLE.device = device

            return device
        } catch (error) {
            console.error("BLE scan error:", error)
            throw error
        }
    },

    connect: async (device) => {
        if (!device) {
            throw new Error("No device provided to connect to")
        }

        try {
            console.log("Connecting to GATT Server...")

            if (!device.gatt) {
                console.log("Device doesn't support GATT services")
                BLE.device = device
                return { connected: true, mock: true }
            }

            const server = await device.gatt.connect()

            console.log("Connected to GATT Server:", server.connected)

            BLE.server = server
            BLE.device = device

            return server
        } catch (error) {
            console.log("Device doesn't support full GATT services (treating as successful)")

            BLE.device = device

            return { connected: true, mock: true }
        }
    },

    disconnect: () => {
        if (BLE.server && BLE.server.connected) {
            BLE.server.disconnect()
            console.log("Disconnected from device")
        }
        BLE.server = null
        BLE.device = null
    },

    readGATTData: async (server) => {
        const gattData = {
            battery: null,
            manufacturer: null,
            model: null,
            hasData: false,
        }

        if (!server || server.mock) {
            return gattData
        }

        // Try to read battery level from Battery Service (0x180F)
        try {
            const batteryService = await server.getPrimaryService(GATT_SERVICES.BATTERY)
            const batteryCharacteristic = await batteryService.getCharacteristic(GATT_CHARACTERISTICS.BATTERY_LEVEL)
            const batteryValue = await batteryCharacteristic.readValue()
            const batteryLevel = batteryValue.getUint8(0)
            gattData.battery = batteryLevel
            gattData.hasData = true
            console.log("Battery level:", batteryLevel + "%")
        } catch (error) {
            console.log("Battery service not available")
        }

        // Try to read device information from Device Info Service (0x180A)
        try {
            const deviceInfoService = await server.getPrimaryService(GATT_SERVICES.DEVICE_INFO)

            // Try manufacturer name characteristic (0x2A29)
            try {
                const manufacturerCharacteristic = await deviceInfoService.getCharacteristic(
                    GATT_CHARACTERISTICS.MANUFACTURER_NAME,
                )
                const manufacturerValue = await manufacturerCharacteristic.readValue()
                const decoder = new TextDecoder("utf-8")
                gattData.manufacturer = decoder.decode(manufacturerValue)
                gattData.hasData = true
                console.log("Manufacturer:", gattData.manufacturer)
            } catch (error) {
                console.log("Manufacturer info not available")
            }

            // Try model number characteristic (0x2A24)
            try {
                const modelCharacteristic = await deviceInfoService.getCharacteristic(GATT_CHARACTERISTICS.MODEL_NUMBER)
                const modelValue = await modelCharacteristic.readValue()
                const decoder = new TextDecoder("utf-8")
                gattData.model = decoder.decode(modelValue)
                gattData.hasData = true
                console.log("Model:", gattData.model)
            } catch (error) {
                console.log("Model info not available")
            }
        } catch (error) {
            console.log("Device info service not available")
        }

        return gattData
    },
}

window.BLE = BLE
