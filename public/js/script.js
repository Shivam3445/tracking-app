// const socket  = io();//connected request goes to backend by initialising this function

// if(navigator.geolocation){
//     navigator.geolocation.watchPosition(
//     (position)=> {
//         const {latitude, longitude} = position.coords;
//         socket.emit("send-location",{latitude,longitude});
//     },
//     (error)=>{
//         console.error(error);
//     },
//     {
//         enableHighAccuracy:true,
//         timeout:5000,
//         maximumAge:0 
//     }
// );
// }

// const map = L.map("map").setView([0,0], 16);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribution:"OpenStreetMap"

// }).addTo(map);

// const markers = {}

// socket.on("receive-location", (data)=>{
//     const {id,latitude,longitude} = data;
//     map.setView([latitude,longitude]);
//     if(markers[id]){
//         markers[id].setLatLng([latitude,longitude])
//     }else{
//         markers[id] = L.marker([latitude,longitude]).addTo(map);
//     }
// })

// socket.on("user-disconnected", (id)=>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// })

const socket = io(); // Initialize Socket.io connection

// Initialize map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Track markers
const markers = {};

// Get initial location and set map view
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit your initial location to the server
            socket.emit("send-location", { latitude, longitude });

            // Set map view to your location
            map.setView([latitude, longitude], 16);
        },
        (error) => {
            console.error("Geolocation error:", error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );

    // Watch location changes
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit updated location
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation watch error:", error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

// Handle receiving other users' locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Update or create the marker
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnections
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

