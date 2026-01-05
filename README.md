# Seafolio Dive Log App: Proof of Concept #1
## Bluetooth Low Energy (BLE) Dive Computer Sync Feature
**Ocean's 4 Team**  
Thomas More College, Mechelen  
Final Product Project  
Prototype Testing: BLE Device Connection with Web Bluetooth API

**Live POC:** https://dive-log-app-w42fi.ondigitalocean.app

---

## About This POC
This is a **proof of concept (POC)** for the Seafolio dive log app
that tests whether we can sync dive computers to a web application
using Bluetooth Low Energy (BLE) and transfer dive logs wirelessly.

The prototype demonstrates BLE device scanning, connection,
GATT service reading, and dive log display in a browser-based
Progressive Web App (PWA).

---

## Problem We're Solving
**The Challenge:**  
Divers use dive computers to track their dives
(depth, time, temperature, location).

After surfacing, they want to:
- Upload dive logs to a digital logbook
- Review dive logs
- Keep all their dive history in one place

**Current Solutions:**
- Manual entry takes forever
(typing in 20+ dive parameters per dive)
- Desktop apps require USB cables and laptops
(not convenient on dive boats)
- Manufacturer apps only work with their own brand
(Suunto app won't read Shearwater data)

**Our Goal:**  

Build a web-based dive log app where divers can:
1. Open the app
2. Tap "Scan Devices"
3. Select their dive computer
4. Automatically sync all dive logs wirelessly/offline
5. View and edit their dives immediately

---

## Purpose of This Prototype
**Primary Goal:**  

Quickly test if BLE device connection works with a PWA using
the Web Bluetooth API in desktop Chrome/Edge browsers.

**What We Tested:**
- Can we scan for nearby BLE devices from a browser?
- Can we connect to a selected device?
- Can we read GATT services and characteristics?
- Can we parse and display the data?
- Does it work on mobile browsers?

**Testing Process:**  

Several prototypes were tested by different team members
of Ocean's 4 during the project.

We tested with:
- Mock dive computer data (simulated Shearwater Perdix AI)
- Real BLE devices we already owned (JBL headphones, smartwatches)
- Desktop Chrome on Windows/Mac
- Mobile Chrome on Android (Samsung phones)

---

## Challenges We Faced
### **Challenge 1: No Access to Real Dive Computers**
None of our team members own dive computers.
We couldn't test with real hardware.

**Solution:** Used mock data to simulate a Shearwater Perdix AI
dive computer with 3 sample dive logs.
Tested BLE connection
with devices we already owned (JBL headphones, smartwatches)
to prove the Web Bluetooth API works.

---

### **Challenge 2: Proprietary BLE Protocols**
Every dive computer manufacturer uses custom GATT service
UUIDs and proprietary data formats. We can't just connect
and read logs without knowing their protocols.

**Research findings:**
- Shearwater uses encrypted GATT characteristics
(requires Shearwater Cloud partnership)
- Suunto uses proprietary Suunto App protocol (locked)
- Oceanic/Aqualung requires DiverLog+ partnership
- Open source `libdivecomputer` library exists
(desktop C library, not browser-compatible)

**Solution:** Focused POC on proving the connection
and data reading mechanisms work. Documented that
manufacturer partnerships are required for production.

---

### **Challenge 3: Browser Compatibility**
Web Bluetooth API is not supported in all browsers,
especially mobile Safari (iOS blocks it completely).

**What works:**
- OK Desktop Chrome/Edge/Opera (fully supported)
- OK Android Chrome/Edge/Opera (requires Location ON + Chrome permissions)
- X iOS Safari (Apple blocks Web Bluetooth entirely)
- X Firefox (doesn't support Web Bluetooth)
- X Samsung Internet Browser (doesn't support Web Bluetooth)

**Solution:** Documented browser requirements. For production,
we'd build native iOS app to bypass Safari limitations.

---

### **Technical Challenge: Figuring Out GATT Protocol**
None of us had worked with Bluetooth Low Energy before.
We had to learn:
- GATT (Generic Attribute Profile) structure
- Services, characteristics, UUIDs
- Tested with Android Michael Kors smartwatches,
- BLE hardware (yes we can scan and find them)
- But their proprietary data is locked

**Solution:** As consumer device (smartwatch, fitness tracker, dive computer)
locks their valuable data. Real data needs manufacturer permission,
so  we will build up to dive comps partnerships later.

---

## Solution Found
### **MVP Strategy (Current):**
We will use a **PWA with manual entry**
for dive logs as the primary feature:
- Build with React/Next.js (modern web tech)
- Users manually enter their dive logs (depth, time, location, etc.)
- Cloud sync stores logs in database
- Works on all devices and browsers
- No Bluetooth complexity

### **Production Strategy (Future):**
Use a **hybrid approach** combining multiple upload methods:

**Method 1: BLE Sync (Native Apps)**
- Build native iOS (Swift) and Android (Kotlin) apps
- Partner with dive computer manufacturers for protocol access
- Implement BLE sync for supported brands
- Premium feature for paid users

**Method 2: File Upload (Web App)**
- Users export dive logs from desktop apps (Subsurface, MacDive)
- Upload .XML or .JSON files to Seafolio web app
- Just a standard file picker: `<input type="file" accept=".xml,.json">
- User browses to wherever they saved it
- Works with all dive computer brands
- Free feature

**Method 3: Manual Entry (Web App)**
- Users type in dive details manually
- Always available as fallback
- Free feature

**Method 4: Hybrid Manual Entry + File Upload**
- File upload + manual entry
- No BLE needed (avoid locked dive computers)
- Much simpler to implement

---

## New Technologies We Learned
**1. Web Bluetooth API**  
First time using browser-based Bluetooth.
Learned how to scan for devices, connect,
and read data directly from JavaScript.

**2. BLE & GATT Protocol**  
Learned how Bluetooth Low Energy devices expose data through:
- Services (categories of data, e.g., Battery Service 0x180F)
- Characteristics (individual data points, e.g., Battery Level 0x2A19)
- UUIDs (unique identifiers for standard and custom services)

**3. Async/Await JavaScript**  
Heavy use of asynchronous code for Bluetooth connections, GATT reads,
and UI updates. Learned proper promise handling and error boundaries.

**4. Module Pattern**  
Split code into separate modules (BLE, UI, MOCK_DATA) instead of one
massive file. Learned orthogonality principle for independent, reusable code.

**5. Tracer Bullet Programming**  
Broke project into small, testable steps. Tested each feature
in browser console before moving to next step.

---

## Features We Implemented
[X]Scan for nearby Bluetooth devices via browser popup  
[X]Two-button approach: "Scan Bluetooth Devices" or "Try Mock Demo"  
[X]Connect to selected BLE device with animated connecting screen  
[X]Read battery level and device info from real smartwatches/headphones  
[X]Mock dive computer mode simulates Shearwater Perdix AI with 3 fake dive logs  
[X]Display dive logs with location, depth, duration, temperature, PSI  
[X]Mobile responsive design (works on phones, tablets, desktops)  
[X]Browser compatibility detection (warns if Web Bluetooth not supported)  
[X]Error handling for connection failures and permission denials

---

**Tech Stack:**
**Frontend:** Vanilla JavaScript (ES6 modules), HTML5, CSS3,
Web Bluetooth API
**Backend:** Node.js with Express.js
**API:** RESTful endpoints (JSON)
Frontend sends requests → Backend responds with JSON data
(API = the endpoints in server.js that accept HTTP requests
and return JSON responses. It's the communication layer between
frontend (browser) and backend Node.js server)
**Deployment:** Digital Ocean

---

**Key Files:**
- `app.js` - Controller (decides mock vs real, handles button clicks)
- `ble.js` - All BLE/GATT communication
- `ui.js` - All screen transitions and display logic
- `mock-data.js` - Test data
- `server.js` - HTTP server
---

## POC Test Results

**What Worked:**
- Web Bluetooth API is powerful and works reliably in supported browsers
- Mock data approach let us test complete system without expensive hardware
- Modular code architecture made debugging easier
- Tracer bullet development kept us focused on testable milestones
- Two-button approach solved mobile gesture chain issues

**What Was Challenging:**
- Learning GATT protocol from scratch (services, characteristics, UUIDs)
- Understanding dive computer proprietary protocols and manufacturer restrictions
- Browser compatibility limitations (especially iOS blocking)
- Mobile permission requirements (Location + Nearby devices)
- Testing without real dive computer hardware

**What We'd Do Differently for Production:**
- Start with native apps (avoid iOS Web Bluetooth limitations)
- Prioritize manufacturer partnerships early (unlock real device protocols)
- Implement hybrid approach (BLE + file upload + manual entry) from day one
- Build backend database first (currently frontend-only POC)
- Add comprehensive error handling for all BLE connection edge cases

**Our Recommendation:**

**MVP should focus on manual entry + file upload.**

BLE sync is technically feasible but requires:
- Native iOS/Android apps (3+ months development)
- Manufacturer partnerships (legal agreements, API access + tell us the GAT UUIDs)
- Real dive comp for testing (€500)
- Complex data parsing for multiple brands

**BLE sync should be a Phase 2 premium feature
after MVP proves market fit.**

---


