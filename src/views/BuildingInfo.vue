<template>
  <div>
    <h1 class="title">{{ title }}</h1>
    <b-loading v-model="isLoading"></b-loading>
    <b-menu-list v-if="!isLoading">
      <LevelMenuItem v-for="location in locations" :key="location.id" v-bind="location" />
      <AddNewMenuItem label="этаж"/>
    </b-menu-list>
  </div>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import LevelMenuItem from '@/components/BuildingInfo/LevelMenuItem';
import coreApi from '@/services/api/core';

export default {
  name: 'BuildingInfo',
  components: { AddNewMenuItem, LevelMenuItem },
  data() {
    return {
      isLoading: false,
      locations: [],
    }
  },
  props: {
    title: String,
  },
  created: async function() {
    this.isLoading = true;
    this.locations = await coreApi.getLevels(this.$route.params.id);
    this.isLoading = false;
  },
};
</script>

<style></style>
