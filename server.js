// Import Express - the web server framework
const express = require("express")
// Import CORS - lets browser talk to server from different ports
const cors = require("cors")

// Create the Express app
const app = express()
// Set the port number
const PORT = 3000

// MIDDLEWARE SETUP
// Let browser send JSON data to server
app.use(express.json())
// Let browser make requests from different origins (localhost:8080 to localhost:3000)
app.use(cors())
// Serve static files from the 'public' folder (HTML, CSS, JS)
app.use(express.static("public"))

// TEST ROUTE - check if server is working
app.get("/api/test", (req, res) => {
    res.json({
        message: "Server works!",
        timestamp: new Date().toISOString(),
    })
})

// START THE SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Press Ctrl+C to stop`)
})
