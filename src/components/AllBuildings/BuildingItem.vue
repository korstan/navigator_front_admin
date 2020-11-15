<template>
  <b-menu-item :label="title" tag="router-link" :to="{ path: `/building/${id}`, query: { title } }"></b-menu-item>
</template>

<script>
export default {
  name: 'BuildingItem',
  props: {
    id: String,
    title: String,
  }
}
</script>

<style>

</style>