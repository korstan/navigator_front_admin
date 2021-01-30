<template>
  <div id="map" ref="map"></div>
</template>

<script>
import L from 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';


let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [24, 36],
  iconAnchor: [12, 36]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: 'Map',
  props: {
    buildingId: String,
    lev: String,
  },
  data() {
    return {
      findLocationInput: null,
      map: null,
      mapWidth: null,
      mapHeight: null,
      leafletDivider: 8,

      levels: null,
      currentLevelObject: null,
      sizeMultiplier: 5,

      currentMarkersObjects: []
    }
  },
  methods: {
    updateMapImage() {
      const img = new Image();
      img.onload = () => {
        this.mapWidth = img.width * this.sizeMultiplier;
        this.mapHeight = img.height * this.sizeMultiplier;

        // calculate the edges of the image, in coordinate space
        const southWest = this.map.unproject([0, this.mapHeight], this.map.getMaxZoom() - 1);
        const northEast = this.map.unproject([this.mapWidth, 0], this.map.getMaxZoom() - 1);
        const bounds = new L.LatLngBounds(southWest, northEast);

        if (this.overlay) {
          this.map.removeLayer(this.overlay);
        }
        this.overlay = L.imageOverlay(img, bounds);
        this.overlay.addTo(this.map);

        // tell leaflet that the map is exactly as big as the image
        this.map.setMaxBounds(bounds);
      }
      img.src = require('../assets/' + this.buildingId + '/' + this.lev + '.svg');
    },
    setLevel(level) {
      if (this.currentLevelObject !== level) {
        this.currentLevelObject = level;
      }
    },
    convertLatLngToPercents(lat, lng) {
      const clickWidth = lng;
      const clickHeight = lat * -1;

      const leafletMapWidth = this.mapWidth / this.leafletDivider;
      const leafletMapHeight = this.mapHeight / this.leafletDivider;
      return {
        percentByWidth: parseFloat((clickWidth / leafletMapWidth).toFixed(4)),
        percentByHeight: parseFloat((clickHeight / leafletMapHeight).toFixed(4))
      }
    },
    convertPercentsToLatLng(percentByWidth, percentByHeight) {
      const leafletMapWidth = this.mapWidth / this.leafletDivider;
      const leafletMapHeight = this.mapHeight / this.leafletDivider;
      return {
        lng: parseFloat((leafletMapWidth * percentByWidth).toFixed(4)),
        lat: parseFloat((leafletMapHeight * percentByHeight * -1).toFixed(4))
      }
    },
    addMarker(leafletPoint) {
      const marker = L.marker(leafletPoint, DefaultIcon)
      marker.addTo(this.map)
      this.currentMarkersObjects.push(marker)
    },
    removeAllMarkers() {
      for (const marker of this.currentMarkersObjects) {
        marker.remove(this.map)
      }
      this.currentMarkersObjects = []
    },
    updateMarkers() {
      this.removeAllMarkers()
      if (this.currentLevelObject.markersPoints && this.currentLevelObject.markersPoints.length > 0) {
        for (const markerPoint of this.currentLevelObject.markersPoints) {
          this.addMarker(markerPoint)
        }
      }
    },
  },
  async created() {
    const apiUrl = 'http://194.87.232.192/navigator/api/';
    const response = await fetch(apiUrl + 'level?buildingId=' + this.buildingId);
    if (response.ok) {
      this.levels = await response.json();

      const firstLevel = this.levels.find(level => level.level === "1");
      if (!firstLevel)
        alert('first level not found');
      this.setLevel(firstLevel)
    } else {
      alert("error: " + response.status);
    }
  },
  mounted() {
    this.map = L.map('map', {
      center: [0, 0],
      maxZoom: 4,
      minZoom: 1,
      zoom: 2,
      crs: L.CRS.Simple,
      attributionControl: false,
    });
    this.$refs['map'].style.height = Math.round(window.innerHeight * 0.75) - 50 + 'px';


    this.map.on('click', (e) => {
      console.log(e.latlng)
      const percents = this.convertLatLngToPercents(e.latlng.lat, e.latlng.lng)
      console.log(percents);
      console.log(this.convertPercentsToLatLng(percents.percentByWidth, percents.percentByHeight))
    });
  },
  computed: {
    level: function () {
      return this.currentLevelObject ? this.currentLevelObject.level : 1;
    },
  },
  watch: {
    currentLevelObject: function () {
      this.updateMapImage();
      this.updateMarkers();
    },
    lev: function () {
      this.updateMapImage();
    }
  }
}
</script>
<style lang="scss">
#map {
  width: 100%;
  /*height: 450px;*/
  border: 1px solid #ccc;

  z-index: 0;
  background-color: white;
}

.custom-text {
  font-size: 24px;
  line-height: 28px;
}


/* кнопки + и - */
.leaflet-control-container {
  position: absolute;
  right: 60px;
  top: 35%;
}

.leaflet-touch .leaflet-bar a {
  width: 40px;
  height: 40px;
  line-height: 40px;
}

.leaflet-control-zoom a {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
}

.leaflet-bar a,
.leaflet-bar a:hover {
  background-color: #3273dc;
  border: 1px solid rgba(0, 0, 0, .15);
  color: white;
}

.leaflet-bar a.leaflet-disabled {
  cursor: default;
  background-color: white;
  color: grey;
}

.leaflet-touch .leaflet-bar a:first-child {
  border-radius: 50%;
}

.leaflet-touch .leaflet-bar a:last-child {
  border-radius: 50%;
}

.leaflet-control-zoom a.leaflet-control-zoom-out {
  margin-top: 15px;
}

.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  border: none;
}

</style>
