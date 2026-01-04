// Constants for delays
const MOCK_CONNECTION_DELAY_MS = 2000
const REAL_CONNECTION_DELAY_MS = 1500
const SUCCESS_MESSAGE_DELAY_MS = 1000

// Helper function to avoid Promise repetition
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

console.log("App loaded")

document.addEventListener("DOMContentLoaded", () => {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth not supported in this browser")
        window.UI.showStatus(
            "Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera on desktop.",
            "error",
        )
        document.getElementById("scanRealBtn").disabled = true
        document.getElementById("scanMockBtn").disabled = true
        return
    }

    const scanRealBtn = document.getElementById("scanRealBtn")
    const scanMockBtn = document.getElementById("scanMockBtn")
    const backFromConnecting = document.getElementById("backFromConnecting")
    const backFromLogs = document.getElementById("backFromLogs")
    const testConnectionBtn = document.getElementById("testConnectionBtn")

    scanRealBtn.addEventListener("click", async () => {
        console.log("User chose real device scan")
        try {
            await scanRealDevices()
        } catch (error) {
            if (error.message.includes("cancel") || error.message.includes("User")) {
                console.log("User cancelled device scan")
                window.UI.showStatus("Scan cancelled. Click 'Scan Bluetooth Devices' to try again.", false)
                return
            }

            console.error("Bluetooth error:", error)
            window.UI.showStatus("Could not connect to device. Please make sure Bluetooth is enabled and try again.", true)
            setTimeout(() => window.UI.showScanScreen(), 2000)
        }
    })

    scanMockBtn.addEventListener("click", async () => {
        console.log("User chose mock dive computer mode")
        try {
            await connectToMockDevice()
        } catch (error) {
            console.error("Mock device error:", error)
            window.UI.showStatus("Could not load demo device. Please refresh the page and try again.", true)
            setTimeout(() => window.UI.showScanScreen(), 2000)
        }
    })

    backFromConnecting.addEventListener("click", () => {
        window.UI.showScanScreen()
    })

    backFromLogs.addEventListener("click", () => {
        window.UI.showScanScreen()
    })

    testConnectionBtn.addEventListener("click", async () => {
        await testServerConnection()
    })

    document.addEventListener("click", async (e) => {
        if (e.target.id === "uploadBtn") {
            await uploadDiveLogs()
        }
    })
})

async function connectToMockDevice() {
    try {
        const mockComputer = window.MOCK_DATA.computers[0]
        window.UI.showConnectingScreen(mockComputer.name)
        await delay(MOCK_CONNECTION_DELAY_MS)
        const mockLogs = window.MOCK_DATA.logs

        await sendLogsToBackend(mockComputer.name, mockLogs, "mock")

        window.UI.showDiveLogs(mockLogs, mockComputer.name)
    } catch (error) {
        console.error("Mock device error:", error)
        throw error
    }
}

async function scanRealDevices() {
    window.UI.showStatus("Opening device picker...")

    const device = await window.BLE.scan()
    console.log("Device selected:", device.name || "Unknown")

    window.UI.showConnectingScreen(device.name || "Unknown Device")
    await delay(REAL_CONNECTION_DELAY_MS)

    const server = await window.BLE.connect(device)
    const gattData = await window.BLE.readGATTData(server)

    await sendLogsToBackend(device.name || "Unknown Device", gattData, "bluetooth")

    window.UI.showStatus("Connected successfully!")
    await delay(SUCCESS_MESSAGE_DELAY_MS)

    window.UI.showLogsScreen(device.name || "Unknown Device", gattData)
}

async function uploadDiveLogs() {
    window.UI.showStatus("Upload functionality will be added in production version with real dive computer.", "info")
}

async function sendLogsToBackend(deviceName, data, source) {
    try {
        console.log(`Sending logs to backend from ${deviceName}`)

        const response = await fetch("/api/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                device: deviceName,
                logs: Array.isArray(data) ? data : [data],
                source: source,
            }),
        })

        const result = await response.json()

        if (result.success) {
            console.log(`Backend sync successful: ${result.logsReceived} logs received`)
            window.UI.updateBackendStatus("connected", `Synced ${result.logsReceived} logs`)
        } else {
            console.error("Backend sync failed:", result.error)
            window.UI.updateBackendStatus("error", "Server unavailable. Your data was not saved.")
        }
    } catch (error) {
        console.error("Error sending logs to backend:", error)
        window.UI.updateBackendStatus("error", "Backend unavailable")
    }
}

async function testServerConnection() {
    try {
        window.UI.showStatus("Testing server connection...", "info")

        const response = await fetch("/health")
        const data = await response.json()

        if (data.status === "healthy") {
            console.log("Server health check passed:", data)
            window.UI.showStatus("Server connected successfully!", "success")
            window.UI.updateBackendStatus("connected", "Server healthy")
        } else {
            throw new Error("The server is not responding. Please try again.")
        }
    } catch (error) {
        console.error("Server connection failed:", error)
        window.UI.showStatus("Could not connect to the server. Please check your internet connection.", "error")
        window.UI.updateBackendStatus("error", "Server offline")
    }
}
