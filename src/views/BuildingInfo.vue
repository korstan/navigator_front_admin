<template>
  <div>
    <h1 class="title">{{ title }}</h1>
    <b-menu-list>
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
      locations: [],
    }
  },
  props: {
    title: String,
  },
  created: async function() {
    this.locations = await coreApi.getLevels(this.$route.params.id);
  },
};
</script>

<style></style>
