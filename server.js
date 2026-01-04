// Import Express the web server framework
const express = require("express")
// Import CORS - lets browser talk to server from different ports
const cors = require("cors")

// Create the Express app
const app = express()
const PORT = process.env.PORT || 3000

// MIDDLEWARE SETUP
// Let browser send JSON data to server
app.use(express.json())
// Let browser make requests from different origins
app.use(cors())
// Serve static files from the 'public' folder (HTML, CSS, JS)
app.use(express.static("public"))

app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" })
})

// TEST ROUTE check if server is working
app.get("/api/test", (req, res) => {
    res.json({
        message: "Server works!",
        timestamp: new Date().toISOString(),
    })
})

app.post("/api/logs", (req, res) => {
    try {
        const { device, logs, source } = req.body

        // Validate request data
        if (!device) {
            return res.status(400).json({
                success: false,
                error: "Device name is required",
            })
        }

        if (!logs || !Array.isArray(logs)) {
            return res.status(400).json({
                success: false,
                error: "Logs must be an array",
            })
        }

        // Log received data (in production this would save to database)
        console.log(`[SERVER] Received ${logs.length} dive logs from ${device}`)
        console.log(`[SERVER] Source: ${source || "unknown"}`)
        console.log(`[SERVER] Timestamp: ${new Date().toISOString()}`)

        // Send success response
        res.status(200).json({
            success: true,
            logsReceived: logs.length,
            device: device,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("[SERVER] Error processing logs:", error)
        res.status(500).json({
            success: false,
            error: "Internal server error",
        })
    }
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check available at /health`)
})
