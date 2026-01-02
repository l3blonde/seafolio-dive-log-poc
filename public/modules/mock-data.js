// Mock dive computer data for PoC testing
// Since we don't have real $500 dive computer hardware, we simulate realistic dive logs

const MOCK_DIVE_COMPUTERS = [
    {
        name: "Shearwater Perdix AI",
        manufacturer: "Shearwater Research",
        type: "Technical Dive Computer",
    },
    {
        name: "Suunto EON Core",
        manufacturer: "Suunto",
        type: "Recreational Dive Computer",
    },
]

const MOCK_DIVE_LOGS = [
    {
        id: 24,
        date: "April 24, 2024, 1:30 PM",
        location: "Great Barrier Reef, Australia",
        maxDepth: "22m",
        duration: "48 min",
        device: "Shearwater Perdix AI",
        temperature: "24°C",
        uploadStatus: "pending",
    },
    {
        id: 23,
        date: "April 23, 2024, 10:45 AM",
        location: "Blue Hole, Belize",
        maxDepth: "20m",
        duration: "40 min",
        device: "Shearwater Perdix AI",
        temperature: "26°C",
        uploadStatus: "pending",
    },
    {
        id: 22,
        date: "April 22, 2024, 2:00 PM",
        location: "SS Yongala Wreck, Australia",
        maxDepth: "18m",
        duration: "35 min",
        device: "Shearwater Perdix AI",
        temperature: "25°C",
        uploadStatus: "pending",
    },
]

// Export for use in other modules
window.MOCK_DATA = {
    computers: MOCK_DIVE_COMPUTERS,
    logs: MOCK_DIVE_LOGS,
}

console.log("Mock data module loaded")
