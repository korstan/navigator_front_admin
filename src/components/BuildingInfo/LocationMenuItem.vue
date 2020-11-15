<template>
  <b-menu-item :label="title"/>
</template>

<script>
export default {
  props: {
    id: String,
    title: String,
    points: Object,
  },
}
</script>

<style>

</style>