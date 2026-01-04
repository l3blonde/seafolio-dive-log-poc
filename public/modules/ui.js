const UI = {
    showConnectingScreen: (deviceName) => {
        document.getElementById("scanScreen").classList.add("hidden")
        document.getElementById("connectingScreen").classList.remove("hidden")
        document.getElementById("connectingDeviceName").textContent = deviceName || "Unknown Device"
    },

    showScanScreen: () => {
        document.getElementById("scanScreen").classList.remove("hidden")
        document.getElementById("connectingScreen").classList.add("hidden")
        document.getElementById("logsScreen").classList.add("hidden")
    },

    showLogsScreen: (deviceName = "Device", gattData = null) => {
        console.log("No dive logs available for this device")

        document.getElementById("scanScreen").classList.add("hidden")
        document.getElementById("connectingScreen").classList.add("hidden")
        document.getElementById("logsScreen").classList.remove("hidden")

        const logsList = document.getElementById("logsList")

        if (gattData && gattData.hasData) {
            let gattInfo = "<div class='gatt-data'><h3>Device Information:</h3><ul>"

            if (gattData.battery !== null) {
                gattInfo += `<li>Battery Level: ${gattData.battery}%</li>`
            }
            if (gattData.manufacturer) {
                gattInfo += `<li>Manufacturer: ${gattData.manufacturer}</li>`
            }
            if (gattData.model) {
                gattInfo += `<li>Model: ${gattData.model}</li>`
            }

            gattInfo += "</ul></div>"

            logsList.innerHTML = `
        <div class="no-logs-message">
          <h2>${deviceName} connected successfully!</h2>
          ${gattInfo}
          <p><strong>Dive Logs:</strong> No dive logs found.</p>
          <p>This device has no dive computer functionality.</p>
          <p style="margin-top: 20px; color: #666;">To test with mock dive logs, go back and scan for devices again. Choose "Mock Shearwater Perdix AI" when prompted.</p>
        </div>
      `
        } else {
            logsList.innerHTML = `
        <div class="no-logs-message">
          <h2>${deviceName} connected successfully!</h2>
          <p>No dive logs found.</p>
          <p>Please connect a real dive computer to sync logs.</p>
          <p style="margin-top: 20px; color: #666;">To test with mock dive logs, go back and scan for devices again. Choose "Mock Shearwater Perdix AI" when prompted.</p>
        </div>
      `
        }
    },

    showStatus: (message, type = "info") => {
        const statusDiv = document.getElementById("status")
        statusDiv.textContent = message
        statusDiv.className = `status ${type}`
        statusDiv.classList.remove("hidden")
    },

    hideStatus: () => {
        const statusDiv = document.getElementById("status")
        statusDiv.classList.add("hidden")
    },

    showDiveLogs: (logs, deviceName = "Dive Computer") => {
        console.log(`Displaying ${logs.length} dive logs`)

        document.getElementById("scanScreen").classList.add("hidden")
        document.getElementById("connectingScreen").classList.add("hidden")
        document.getElementById("logsScreen").classList.remove("hidden")

        const logsList = document.getElementById("logsList")

        let html = `
      <div class="device-header">
        <div class="device-icon">●</div>
        <div class="device-info">
          <div class="device-name">${deviceName}</div>
          <div class="device-meta">Connected</div>
        </div>
      </div>

      <div class="logs-container">
    `

        logs.forEach((log) => {
            html += `
        <div class="log-item">
          <div class="log-header">
            <span class="log-number">Dive #${log.id}</span>
            <div class="log-details">
              <span class="log-depth">${log.maxDepth}</span>
              <span class="log-duration">${log.duration}</span>
            </div>
          </div>
          <div class="log-date">${log.date}</div>
          <div class="log-location">${log.location}</div>
          <div class="log-meta">Max Depth • Temperature: ${log.temperature}</div>
        </div>
      `
        })

        html += `
      </div>
      <p style="text-align: center; margin-top: 30px; color: #666;">
        Upload functionality ready for production
      </p>
    `

        logsList.innerHTML = html
    },

    updateBackendStatus: (status, message) => {
        const backendStatusDiv = document.getElementById("backendStatus")
        const statusText = backendStatusDiv.querySelector(".status-text")

        // Remove previous status classes
        backendStatusDiv.classList.remove("connected", "error")

        if (status === "connected") {
            backendStatusDiv.classList.add("connected")
            statusText.textContent = `Backend: ${message}`
        } else if (status === "error") {
            backendStatusDiv.classList.add("error")
            statusText.textContent = `Backend: ${message}`
        } else {
            statusText.textContent = `Backend: ${message}`
        }
    },
}

window.UI = UI
