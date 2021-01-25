<template>
  <b-menu>
    <b-menu-list>
      <b-menu-item 
        icon="domain" 
        label="Здания"
        @click.native="$router.push(`/`)"
        :active="$router.currentRoute.path==='/'"
      />
      <b-menu-item 
        icon="map-marker-path" 
        label="Маршрутные точки"
        @click.native="$router.push(`/paths`)"
        :active="$router.currentRoute.path==='/paths'"
      />
    </b-menu-list>
  </b-menu>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import '~bulma';
$menu-item-active-background-color: $blue;
</style>
