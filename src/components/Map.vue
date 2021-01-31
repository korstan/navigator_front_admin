<template>
<div>
  <div id="map" ref="map">
  </div>
  <MarkerPopup :visible="this.newModalVisible" :x="this.newModalX" :y="this.newModalY">
    <b-button @click="emitNewLocation" type="is-text">Создать новую локацию</b-button>
  </MarkerPopup>
  <MarkerPopup :visible="this.editModalVisible" :x="this.editModalX" :y="this.editModalY">
    <b-button @click="emitEditLocation" type="is-text">Редактировать</b-button>
    <b-button @click="emitRemoveLocation" type="is-text">Удалить</b-button>
  </MarkerPopup>
</div>
</template>

<script>
import L from 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import secondaryIcon from '@/assets/marker-icon-secondary.png';
import MarkerPopup from '@/components/MarkerPopup';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [24, 36],
  iconAnchor: [12, 36]
});

let SecondaryIcon = L.icon({
  iconUrl: secondaryIcon,
  iconSize: [24, 36],
  iconAnchor: [12, 36]
})

// L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: 'Map',
  components: {MarkerPopup},
  props: {
    buildingId: String,
    lev: String,
    locationsVisible: Boolean,
    locs: Array,
    edges: Array
  },
  data() {
    return {
      findLocationInput: null,
      map: null,
      mapWidth: null,
      mapHeight: null,
      leafletDivider: 8,

      levels: null,
      sizeMultiplier: 5,

      currentMarkersObjects: [],
      locMarkers: [],
      newMarkerObject: undefined,
      polylineObject: null,

      newModalVisible: false,
      newModalX: 0,
      newModalY: 0,

      editModalVisible: false,
      editModalX: 0,
      editModalY: 0,
      editModalTargetLocId: undefined
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
    convertPixelToLeafletPoint(x, y) {
      const leafletDivider = 8;
      return [parseInt(y) * this.sizeMultiplier / leafletDivider * -1,
        parseInt(x) * this.sizeMultiplier / leafletDivider];
    },
    convertLeafletPointToPixels(x, y) {

      const leafletDivider = 8;

      return [ parseInt(x) * leafletDivider / this.sizeMultiplier, 
        parseInt(y) * leafletDivider  / this.sizeMultiplier * -1];
    },
    addNewMarker(leafletPoint) {
      const marker = L.marker(leafletPoint, {icon: DefaultIcon})
      marker.addTo(this.map);
      this.newModalVisible = false;
      marker.on('click',(e)=> {
        this.hideAllMarkerModals()
        this.newModalVisible = !this.newModalVisible;
        this.newModalX = e.originalEvent.pageX;
        this.newModalY = e.originalEvent.pageY;
      });
      this.newMarkerObject && this.newMarkerObject.remove();
      this.newMarkerObject = marker;
    },
    addLocMarker(loc) {
      const leafletPoint = this.convertPixelToLeafletPoint(loc.x, loc.y);
      const marker = L.marker(leafletPoint, {icon: SecondaryIcon});
      marker.addTo(this.map);

      marker.on('click',(e)=> {
        this.hideAllMarkerModals()
        this.editModalVisible = !this.editModalVisible;
        this.editModalX = e.originalEvent.pageX;
        this.editModalY = e.originalEvent.pageY;
        this.editModalTargetLocId = loc.id;
      });
      this.locMarkers.push({loc, marker})
    },
    removeAllMarkers() {
      this.newMarkerObject && this.newMarkerObject.remove();
      for (const {marker} of this.locMarkers) {
        marker.remove(this.map)
      }
      this.locMarkers = []
    },
    updateMarkers() {
      this.hideAllMarkerModals()
      this.removeAllMarkers()
      if (this.locs && this.locs.length > 0) {
        for (const loc of this.locs) {
          this.addLocMarker(loc)
        }
      }
    },
    hideAllMarkerModals() {
      this.editModalVisible = false;
      this.newModalVisible = false;
    },

    emitNewLocation() {
      const { lat, lng } = this.newMarkerObject.getLatLng();
      const [x, y] = (this.convertLeafletPointToPixels(lng, lat));
      this.$emit('new', {x, y});
    },
    emitEditLocation() {
      this.$emit('edit', this.editModalTargetLocId);
    },
    emitRemoveLocation() {
      this.$emit('remove', this.editModalTargetLocId);
    },
    addPolyline(leafletPoints) {
      this.polylineObject = L.polyline(leafletPoints, {color: 'green'})
      this.polylineObject.addTo(this.map)
    },
    removePolyline() {
      if (this.polylineObject) {
        this.polylineObject.remove(this.map)
        this.polylineObject = null;
      }
    },
    updatePolyline() {
      this.removePolyline()
      if (this.edges && this.edges.length > 0) {
        const leafletPoints = this.edges.map(edge => edge.map(pixelPoint =>  this.convertPixelToLeafletPoint(pixelPoint.x, pixelPoint.y)))
        this.addPolyline(leafletPoints)
      }
    },
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
      this.hideAllMarkerModals()
      this.addNewMarker([e.latlng.lat, e.latlng.lng])
    });
    this.map.on('movestart', () => { this.hideAllMarkerModals() });
    this.updateMapImage();
    this.map.invalidateSize();
  },
  watch: {
    locs: function () {
      if (this.locationsVisible)
        this.updateMarkers();
    },
    lev: function () {
      this.updateMapImage();
      this.removeAllMarkers();
      this.hideAllMarkerModals();
      if (this.locationsVisible)
        this.updateMarkers();
    },
    locationsVisible: function() {
      if (this.locationsVisible) {
        this.updateMarkers();
        this.updatePolyline();
      } else {
        this.removeAllMarkers();
        this.removePolyline();
      }
    },
    edges: function () {
      if (this.locationsVisible)
        this.updatePolyline()
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
