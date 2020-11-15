<template>
  <b-menu-item :label="`Добавить ${label}`"></b-menu-item>
</template>

<script>
export default {
  name: 'AddNewMenuItem',
  props: {
    label: {type: String, default: 'объект'}
  }
}
</script>

<style>

</style>