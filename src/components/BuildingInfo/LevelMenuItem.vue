<template>
  <b-menu-item :active="isActive" @click="() => (isActive = !isActive)">
    <template slot="label" slot-scope="props">
      {{ level }} этаж
      <b-icon
        class="is-pulled-right"
        :icon="props.expanded ? 'menu-down' : 'menu-up'"
      ></b-icon>
    </template>
    <LocationMenuItem
      v-for="location in locations"
      :key="location.id"
      v-bind="location"
    />
    <AddNewMenuItem label="локацию" />
  </b-menu-item>
</template>

<script>
import AddNewMenuItem from '@/components/AddNewMenuItem';
import LocationMenuItem from '@/components/BuildingInfo/LocationMenuItem';

export default {
  components: { AddNewMenuItem, LocationMenuItem },
  data() {
    return {
      isActive: false,
    };
  },
  props: {
    level: String,
    locations: Array,
  },
};
</script>

<style lang="scss">
@import '~bulma';

$menu-item-active-background-color: $blue;
</style>
