/* Bike Trail Tirol Beispiel */

// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true,
}).setView([ibk.lat, ibk.lng], 9);

// WMTS Hintergrundlayer der eGrundkarte Tirol
let eGrundkarteTirol = {
    sommer: L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }),
    winter: L.tileLayer(
        "https://wmts.kartetirol.at/gdi_winter/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }),
    ortho: L.tileLayer("https://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }
    ),
    nomenklatur: L.tileLayer("https://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
        pane: "overlayPane",
    })
}

// / Layer control mit eGrundkarte Tirol und Standardlayern
L.control.layers({
    "eGrundkarte Tirol Sommer": L.layerGroup([
        eGrundkarteTirol.sommer,
        eGrundkarteTirol.nomenklatur
    ]).addTo(map),
    "eGrundkarte Tirol Winter": L.layerGroup([
        eGrundkarteTirol.winter,
        eGrundkarteTirol.nomenklatur
    ]),
    "eGrundkarte Tirol Orthofoto": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ]),
    "OpenStreetMap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Etappe über Pulldown
let pulldown = document.querySelector("#pulldown");
for (let etappe of ETAPPEN){
    let selected = "";
    if (etappe.nr == 31) {
        selected = "selected";
    }
    pulldown.innerHTML += `
        <option ${selected} value="${etappe.user}">Etappe ${etappe.nr}: ${etappe.titel}</option>
    `;
}

// Wechsel im Pulldown 
pulldown.onchange = function (evt) {
    window.location.href = `https://${evt.target.value}.github.io/biketirol`;
}

// elevation control
const controlElevation = L.control.elevation({
    theme: "bike-tirol",
    time: false,
    elevationDiv: "#profile",
    height: 300,
}).addTo(map);

// Track from url (allowed data types: "*.geojson", "*.gpx", "*.tcx")
controlElevation.load("data/etappe31.gpx");

// MiniMap mit eGrundkarte Tirol Sommer-Layer
var gkTirol = new L.TileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png");
var miniMap = new L.Control.MiniMap(gkTirol, { 
    toggleDisplay: true, 
}).addTo(map);