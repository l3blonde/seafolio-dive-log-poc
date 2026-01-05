# Technical Overview

## What We Built

This POC proves you can read Bluetooth dive computers from a web browser
without desktop software. The question is simple:
does Web Bluetooth API work for dive log synchronisation?
Answer: yes, with vendor partnerships.

## The Components

**We have 5 main tech components:**

1. **Browser (Chrome/Edge/Opera)** - Runs the frontend JavaScript (index.html, style.css, app.js + 3 modules)
2. **Web Bluetooth API** - Browser's built-in Bluetooth interface
3. **BLE Device** - Physical Bluetooth hardware (dive computer, phone, headphones)
4. **Node.js Backend Server** - Backend that servers the responses to browsers, receives data from ble devices (server.js)
5. **GATT Protocol** - Standard Bluetooth protocol for reading device data

**Component 2: Backend (Server)**
Node.js with Express serving static files and handling API requests.
Receives dive logs from frontend, validates them, logs to console.
No database yet. No user auth.
File: server.js.

**Component 3: Bluetooth Layer**
Web Bluetooth API built into Chrome/Edge/Opera.
This is browser technology, not ours.
We just call navigator.bluetooth methods to scan and connect.

**Component 4: Mock Data**
Fake dive logs because real dive computers cost $500
and their Bluetooth protocols are locked by manufacturers.
We simulate what real data would look like.

## Technologies Used

Frontend: HTML5, CSS3 with flexbox, vanilla JavaScript ES6, Web Bluetooth API.

Backend: Node.js v18, Express.js 4.18, CORS 2.8.

No frameworks like React or Vue.
Kept it simple for POC.
Will add React for MVP.

## How It Works

User clicks Scan Bluetooth button. Browser opens device picker.
User selects device (real hardware or our mock device).
BLE module connects via GATT protocol.
Reads manufacturer name from standard services.
Tries to read dive logs but real dive computer UUIDs are locked,
so we return mock data instead. UI displays the logs. Frontend sends logs to backend via POST request. Backend validates and logs to console. Done.

## Data Exchange

**Browser to Bluetooth Device**
Browser → Web Bluetooth API → GATT Protocol → BLE Device
`readGattData(device)` (ble.js)
Protocol is GATT over Bluetooth Low Energy (wireless). 
Data comes as binary (ArrayBuffer, DataView).
We read it byte by byte and convert to JavaScript numbers and strings.
Example: battery level is one byte, manufacturer name is a text string.

**Frontend to Backend**
Browser → fetch() → HTTP POST → Node.js Server
Standard HTTP POST with JSON body.
Frontend sends device name, array of logs, and
source tag (mock or bluetooth). Backend responds
with success true/false and timestamp.

**Between Modules**
Just JavaScript function calls. App.js calls BLE.scan(),
BLE returns device object. App.js calls UI.displayLogs(),
UI updates the DOM. Simple.

## Why These Choices

**Web Bluetooth API:** Only option for browser based Bluetooth.
Alternative is native mobile apps which take longer to build or
manual entry + file upload (from whenever user has saved it)

**Vanilla JS:** No need for React in a POC. 
Proves the concept without framework overhead.

**Express:** Industry standard for Node.js servers.
Three endpoints, minimal setup.

**Mock Data:** Real dive computers use proprietary UUIDs.
Shearwater won't publish their protocol. Suunto won't either.
We'd need partnerships or reverse engineering. Not worth it for POC.

## What's Missing

No database. No user accounts. No authentication.
No data persistence. No error recovery beyond basic try/catch.
No separation of concerns for backend, just simple server.js.
No support for actual dive computer protocols.
All intentional because this is a proof of concept, not production software.

## Limitations

Only works in Chrome and Edge. Safari and Firefox don't support
Web Bluetooth. iOS doesn't support it at all (Apple blocked it).
Needs HTTPS. Needs user click to scan (can't auto scan for security).
Can't read real dive computers without manufacturer cooperation.

## Performance

Scanning takes 2 to 5 seconds. Connecting takes 1 to 3 seconds.
Reading GATT services takes about 500ms each.
Sending to backend takes 100ms on localhost.
Total: 5 to 10 seconds from scan to seeing logs.

## Proof of Concept Result

Yes, Web Bluetooth API can talk to Bluetooth devices from a browser.
Yes, we can read GATT services. Yes, we can send data to a backend.
No, we can't read real dive computer logs without manufacturer protocols.
The technology works, but real implementation needs hardware partnerships.

## Next Steps for Production

Get a real dive computer. Partner with Shearwater or Suunto
to get UUID documentation. Replace mock data with actual GATT reads. 
Add database. Add user authentication.
Build manual entry + file upload as cheap dive comps dont have ble service 
and we dont have vendors agreements.
Build iOS native app (Safari doesn't support Bluetooth).
Add separation of concerns. Add error tracking.

That's it. POC proves the concept works technically.
