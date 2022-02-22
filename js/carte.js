let maCarte = L.map('map', {"zoomControl": false}).setView([59.917414, 10.754332], 10);
const couchePoints = L.layerGroup();
couchePoints.addTo(maCarte);

// CHANGEMENT DE FOND DE CARTE :



const rues = L.esri.Vector.vectorBasemapLayer("ArcGIS:Streets", {
  apikey: "AAPKb9379535197746258a277199e7e9b2188U3BUzghBXA4ZEXk7Y_B7rFOYF9alVBuCAvFA2QKXZfFOp3AQ6JdHwAq7_u9k1Fq"
});

rues.addTo(maCarte);


const darkGray = L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray:Base", {
  apikey: "AAPKb9379535197746258a277199e7e9b2188U3BUzghBXA4ZEXk7Y_B7rFOYF9alVBuCAvFA2QKXZfFOp3AQ6JdHwAq7_u9k1Fq"
});

const nova = L.esri.Vector.vectorBasemapLayer("ArcGIS:Nova", {
  apikey: "AAPKb9379535197746258a277199e7e9b2188U3BUzghBXA4ZEXk7Y_B7rFOYF9alVBuCAvFA2QKXZfFOp3AQ6JdHwAq7_u9k1Fq"
});

const tt= L.esri.featureLayer({
  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0'
}).addTo(maCarte);


let baseLayer = {
  "Rues": rues,
  "DarkMode": darkGray,
  "Nova": nova
};
let overlays = {
  "Tremblements de terre": tt,
};
L.control.layers(baseLayer, overlays).addTo(maCarte);
// 

// ÉCHELLE 

L.control.scale({"metric": true, "maxWidth":200}).addTo(maCarte);

//

//1ere couche d'information : GEOJSON.
const shopIcon = L.icon ({
  iconUrl: 'shop-icon.png',
  iconSize:[50, 50],
  iconAnchor: [10, 10],
  popupAnchor: [-2, -2]
});

L.geoJSON(osloboutique, {
  pointToLayer: function(geoJsonPoint, latlng){
    return L.marker(latlng, {icon: shopIcon});
  }
}).bindPopup(function (layer){
  return layer.feature.properties.USER_Field1;
}).addTo(maCarte);

//2ie COUCHE d'information : ArcG .

const bikeIcon = L.icon ({
  iconUrl: 'bike-icon.png',
  iconSize: [10, 10],
  iconAnchor: [10, 10],
  popupAnchor: [-2, -2]
});

L.geoJSON(bikestops, {
  pointToLayer: function(geoJsonPoint, latlng) {
    return L.marker(latlng, {icon: bikeIcon});
  }
}).bindPopup(function (layer){
  return layer.feature.properties.title;
}).addTo(maCarte);

//Quelques Sites à visiter : 
L.marker([59.919946, 10.756272]).addTo(maCarte)
  .bindPopup('Oslo')
  .openPopup();
  L.marker([59.913308, 10.733949]).addTo(maCarte)
  .bindPopup('Viking Planet à Oslo')
  .openPopup();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(maCarte);

//

//BARRE DE RECHERCHE :
const infos = document.getElementById("infos");

const searchControl = L.esri.Geocoding.geosearch({
  position: "topright",
  placeholder: "Entrer une adresse",
  useMapBounds: false,
  providers: [L.esri.Geocoding.arcgisOnlineProvider({
    apikey: "AAPKb9379535197746258a277199e7e9b2188U3BUzghBXA4ZEXk7Y_B7rFOYF9alVBuCAvFA2QKXZfFOp3AQ6JdHwAq7_u9k1Fq",
    nearby: {
      lat: 59.917414,
      lng: 10.754332
    },
  })]
}).addTo(maCarte);

searchControl.on("results", (data) => {
  for(let i=0; i<data.results.length; i++){

    couchePoints.clearLayers();
    let marqueur= L.marker(data.results[i].latlng)
    marqueur.bindPopup(data.results[i].text).openPopup();
    marqueur.addTo(maCarte);
  }
});

//MÉTÉO 

const urlMeteo = "http://api.openweathermap.org/data/2.5/weather?q=Oslo&units=metric&lang=fr&appid=3f7e0e028f2d0f2acedae9ef749cec8f";

const groupe = L.layerGroup();
groupe.addTo(maCarte);

let xhttp = new XMLHttpRequest();
//Callback au changement d'état
xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && this.status == 200) {
        let fichierJSON = JSON.parse(xhttp.responseText);
        afficheMeteo({
            temperature: fichierJSON.main.temp,
            description: fichierJSON.weather[0].description,
            urlIcon: `http://openweathermap.org/img/w/${fichierJSON.weather[0].icon}.png`, 
            coords:fichierJSON.coord
        })
    };
}
xhttp.open("GET", urlMeteo);
xhttp.send();

function afficheMeteo(objMeteo){
    let centre = L.latLng(objMeteo.coords.lat, objMeteo.coords.lon);
    let label = L.marker(centre,{
        icon: L.divIcon({
            className: 'label',
            html: '<div><img src="' + objMeteo.urlIcon + '" title="' + objMeteo.description + '"><p>' + objMeteo.temperature + ' C&deg;</p></div>'})
    }).addTo(groupe);

    console.log(centre);
}
// REQUETE

const requete = document.getElementById('requete');

const villes = L.esri.featureLayer({
  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/0'
  //where: "POP_RANK=4"
}).addTo(maCarte);

requete.addEventListener('change', ()=> villes.setWhere(requete.value));




L.control.zoom({
  position: 'topleft'
}).addTo(maCarte);
