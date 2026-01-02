// Constants for delays
const MOCK_CONNECTION_DELAY_MS = 2000
const REAL_CONNECTION_DELAY_MS = 1500
const SUCCESS_MESSAGE_DELAY_MS = 1000
const UPLOAD_SIMULATION_DELAY_MS = 1500

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
        document.getElementById("scanBtn").disabled = true
        return
    }

    const scanBtn = document.getElementById("scanBtn")
    const backFromConnecting = document.getElementById("backFromConnecting")
    const backFromLogs = document.getElementById("backFromLogs")

    scanBtn.addEventListener("click", async () => {
        console.log("Scanning for devices...")

        try {
            const useMock = confirm(
                "Do you want to test with a MOCK dive computer (Shearwater Perdix AI)?\n\n" +
                "• Click OK to use mock device with dive logs\n" +
                "• Click Cancel to scan for real BLE devices (JBL, smartwatch, etc.)",
            )

            if (useMock) {
                console.log("User chose mock dive computer mode")
                await connectToMockDevice()
            } else {
                console.log("User chose real device scan")
                await scanRealDevices()
            }
        } catch (error) {
            if (error.message.includes("cancel") || error.message.includes("User")) {
                console.log("User cancelled device scan")
            }
            console.error("Bluetooth error:", error)
            window.UI.showStatus(`Error: ${error.message}`, "error")
            setTimeout(() => window.UI.showScanScreen(), 2000)
        }
    })

    backFromConnecting.addEventListener("click", () => {
        window.UI.showScanScreen()
    })

    backFromLogs.addEventListener("click", () => {
        window.UI.showScanScreen()
    })

    document.addEventListener("click", async (e) => {
        if (e.target.id === "uploadBtn") {
            await uploadDiveLogs()
        }
    })

    void testServerConnection()
})

async function connectToMockDevice() {
    try {
        const mockComputer = window.MOCK_DATA.computers[0]
        window.UI.showConnectingScreen(mockComputer.name)
        await delay(MOCK_CONNECTION_DELAY_MS)
        const mockLogs = window.MOCK_DATA.logs
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

    window.UI.showStatus("Connected successfully!")
    await delay(SUCCESS_MESSAGE_DELAY_MS)

    window.UI.showLogsScreen(device.name || "Unknown Device", gattData)
}

async function uploadDiveLogs() {
    window.UI.showStatus("Upload functionality will be added in production version with real dive computer.", "info")
}

async function testServerConnection() {
    try {
        const response = await fetch("http://localhost:3000/api/test")
        const data = await response.json()
        console.log("Server connected:", data)
    } catch (error) {
        console.error("Server connection failed:", error)
    }
}
