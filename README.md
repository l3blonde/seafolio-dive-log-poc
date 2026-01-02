# Seadolio Dive App POC
## Sync Dive Computer § Upload Dive Logs
**Ocean's 4 Team**  
Thomas More Mechelen 2026  
Final Product Project  
POC (Proof of Concept) for Bluetooth Dive Log Sync Feature
Live POC:

## About This POC
We built a browser app that connects to dive computers
via Bluetooth and reads dive logs.
Tested the whole flow with mock data
since none of us own real dive computer hardware.

## What We Built
Browser app with scan button that opens Bluetooth device picker.
Pick a device and it connects.
Shows mock Shearwater Perdix AI dive computer with 3 sample dive logs.
Also tested with real Bluetooth devices like JBL headphones
and smartwatches to prove the Web Bluetooth API actually works.

## Our Journey
The biggest challenge was testing without real hardware.
We researched how dive computers work and found most brands
like Suunto and Shearwater need manufacturer partnerships
to access their proprietary GATT services and data formats.
Can't just connect to any dive computer and read logs
without knowing their custom protocols.

So we tested with what we had.
Connected JBL Tune 520BT headphones
to prove scanning works.
Tried reading battery levels from smartwatches
to prove GATT characteristic reading works.
Then built mock dive computer mode
with fake Shearwater Perdix AI data
to test the complete flow from scan to display.

**What Went Right**  
Web Bluetooth API works perfectly in Chrome.
Tested with real BLE devices first to prove concept.
Mock data approach let us test the complete system.
Modular code made debugging way easier.

**What Went Wrong**
Took ages to learn needed code patterns
and figure out data flow structure.
WebStorm shows unresolved variable warnings
for navigator.bluetooth
but code works fine.
Had to learn GATT services and characteristics from scratch.
Realized every dive computer brand uses different proprietary
formats so mock data was the only realistic option
for POC without manufacturer partnerships.
Can only test with mock data
since we don't own real dive computers.
Chrome/Edge only (Firefox doesn't support Web Bluetooth yet).

## Tech Stack
**Backend:** Node.js v18 + Express.js  
**Bluetooth:** Web Bluetooth API (GATT protocol)  
**Styling:** Black and white only with css (POC focuses on functionality)  
**Dev Tools:** WebStorm IDE + nodemon for auto restart

## New Technologies We Learned
**Web Bluetooth API:**
First time using browser Bluetooth.
Had to learn GATT services, characteristics,
UUIDs, and how devices expose data.
Tested with real devices like JBL headphones and smartwatches.

## New Skills We Learned
**Don't Assume It - Prove It**
**Organize Fully Functional Team** organized our team around functionalities
research tasks, and problem solving, not just functions, so we build code that works
**Good Design is Easier to Change than Bad Design:**
**Take Small Steps - Always:** use tracer bullets to plan
**Dev Tools:** WebStorm IDE + nodemon for auto restart

**GATT Protocol:**
Generic Attribute Profile.
How Bluetooth devices expose data through
services and characteristics.
Battery service UUID 0x180F,
Device Info service UUID 0x180A, etc.

**Async JavaScript:**
Lots of await for Bluetooth connections.
Finally understand promises properly.

**Orthogonality/Module Pattern:**
Split code into ble.js, ui.js, mock-data.js
instead of one massive file

## Features
Scan for nearby Bluetooth devices via browser popup.
Connect to selected device nearby.
Read battery level and device info from real smartwatches.
Mock dive computer mode simulates Shearwater Perdix AI with 3 fake dive logs.
Display dive logs with location, depth, duration, temperature.

## Future Production Improvements
Partner with dive computer manufacturers to access proprietary GATT services.
Test with actual dive computers like Suunto EON Core or Shearwater Perdix.
Parse real GATT binary data from dive computer characteristics.
Build backend API with database storage.
Add user accounts and authentication.
Deploy with proper HTTPS.
Handle different dive computer brands with their custom data formats.
Build native apps with React Native after PWA is done.

## Quick Start
Install dependencies: `npm install`  
Start server: `npm start` or `npm run dev`  
Open browser: http://localhost:3000  
Click scan button and choose mock dive computer to see demo.

## Project Structure
docs folder has all documentation and tracer bullet plan.
public folder has frontend HTML CSS JS. server.js runs Express backend.
Follow tracer bullet plan step by step with checkboxes.

## Team
Ocean's 4  
Thomas More College  
2025 Final Product Project
