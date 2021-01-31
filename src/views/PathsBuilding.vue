<template>
  <div>
    <b-loading v-model="isLoading"></b-loading>
    <div class="page-header">
      <h1 class="title mr-4">{{ title }}</h1>
      <b-select v-if="!isLoading" v-model="currentLevel" placeholder="Выберите этаж">
        <option
            v-for="pathPoint in pathPoints"
            :value="pathPoint.level"
            :key="pathPoint.level">
          {{ `${pathPoint.level} этаж` }}
        </option>
      </b-select>
    </div>

    <b-checkbox v-model="locationsVisible" type="is-info" class="is-pulled-left mb-3">
      Показать существующий граф
    </b-checkbox>
    <Map
        :locationsVisible="locationsVisible"
        :building-id="buildingId"
        :lev="currentLevel"
        :locs="locs"
        :edges="edges"
        @new="showNewModal"
        @edit="onEdit"
        @remove="onRemove"
    />

    <NewPathPointsModal
      :visible="visibleModal === 'new'"
      :initial-x="newPathPoint.x"
      :initial-y="newPathPoint.y"
      :currentLevel="currentLevel"
      @close="hideModal"
      @submit="submitNewPoint"
    />
    <ConfirmRemoveModal
      :visible="visibleModal === 'remove'"
      :title="selectedPoint.title"
      @close="hideModal"
      @remove="removeSelectedPoint"
    />
    <EditPathPointsModal
      v-if="visibleModal === 'edit'"
      :visible="visibleModal === 'edit'"
      :initialPoint="selectedPoint"
      :buildingId="$route.params.id"
      @submit="updatePoint"
      @close="hideModal"
    />
  </div>
</template>

<script>
import NewPathPointsModal from '@/components/PathsBuilding/NewPathPointsModal';
import ConfirmRemoveModal from '@/components/ConfirmRemoveModal';
import EditPathPointsModal from '@/components/PathsBuilding/EditPathPointsModal';

import coreApi from '@/services/api/core';
import adminApi from '@/services/api/admin';
import Map from "@/components/Map";

export default {
  name: 'PathsBuilding',

  components: {
    Map,
    NewPathPointsModal,
    ConfirmRemoveModal,
    EditPathPointsModal
  },

  props: {
    title: String,
    buildingId: String
  },

  data() {
    return {
      isLoading: false,
      visibleModal: undefined,
      pathPoints: [],
      isModalVisible: false,
      selectedPoint: {},
      newPathPoint: {},
      currentLevel: '1',
      locationsVisible: false
    };
  },

  created: async function() {
    this.isLoading = true;
    this.pathPoints = await coreApi.getPathPoints(this.$route.params.id);
    this.isLoading = false;
  },

  methods: {
    showModal: function (modalName) {
      this.visibleModal = modalName;
    },
    hideModal: function () {
      this.visibleModal = undefined;
    },
    setSelectedPoint({id, level}) {
      let foundPoint = this.pathPoints
          .find(p=> p.level === level)
          .points
          .find(p=>p.id === id);
      this.selectedPoint = {
        id,
        level,
        title: foundPoint.title,
        x: foundPoint.x,
        y: foundPoint.y,
        textToSpeech: foundPoint.textToSpeech,
        isStairs: foundPoint.isStairs,
      }
    },
    showNewModal: function(newPathPoint) {
      this.visibleModal = 'new';
      this.newPathPoint = newPathPoint;
    },
    onEdit(id) {
      this.setSelectedPoint({id, level: this.currentLevel});
      this.showModal('edit');
    },
    onRemove(id) {
      this.setSelectedPoint({id, level: this.currentLevel});
      this.showModal('remove');
    },
    submitNewPoint: async function(newPoint) {
      const response = await adminApi.createPathPoint({
        buildingId: this.$route.params.id,
        ...newPoint,
      });
      if (!response.error) {
        if (this.pathPoints.find((l) => l.level == response.level))
          this.pathPoints = this.pathPoints.map((l) =>
            l.level == response.level
              ? { ...l, points: [...l.points, response.point] }
              : l,
          );
        else
          this.pathPoints.push({
            level: response.level,
            points: [response.point],
          });
      }
      this.hideModal();
    },
    updatePoint: async function(updatedLocation) {
      const response = await adminApi.updatePathPoint(updatedLocation);
      if(!response.error) {
        let mappedResponse = response;

        this.pathPoints = this.pathPoints
          .map(l => ({...l, points: l.points.filter(loc => loc.id != response.id) }));

        if (this.pathPoints.find((l) => l.level == response.level))
          this.pathPoints = this.pathPoints.map((l) =>
            l.level == response.level
              ? { ...l, points: [...l.points, mappedResponse] }
              : l,
          );
        else
          this.pathPoints.push({
            level: response.level,
            points: [mappedResponse],
          });
        this.hideModal();
      }
    },
    removeSelectedPoint: async function() {
      const response = await adminApi.removePathPoint(this.selectedPoint.id);
      if(!response.error) {
        this.pathPoints = this.pathPoints
          .map(l => ({...l, points: l.points.filter(loc => loc.id != response.id) }));
        this.hideModal();
      }
    },
  },
  computed: {
    locs: function () {
      const pointsOfCurrentLevel = this.pathPoints.find(l=>l.level === this.currentLevel);
      return pointsOfCurrentLevel ? pointsOfCurrentLevel.points : [];
    },
    edges: function () {
      const pointsOfCurrentLevel = this.pathPoints.find(l=>l.level === this.currentLevel);
      return pointsOfCurrentLevel ? pointsOfCurrentLevel.points.map(point => {
        if (!point.links || point.links.length === 0)
          return [];

        const startPoint = {x:point.x, y:point.y}
        return point.links.map(linkPointId => {
          const linkPoint = pointsOfCurrentLevel.points.find(point => point.id === linkPointId)

          return linkPoint ? [startPoint, {x:linkPoint.x, y:linkPoint.y}] : [];
        })
      }).flat() : [];
    },
  },
}
</script>

<style>
.page-header {
  display: flex;
  justify-content: center;
}
</style>