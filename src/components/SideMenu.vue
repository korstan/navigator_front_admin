<template>
  <b-menu>
    <b-menu-list>
      <b-menu-item icon="domain" label="Здания"></b-menu-item>
    </b-menu-list>
  </b-menu>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
/deep/ {
  @import "~bulma"; 
  @import "~buefy/src/scss/buefy";

  $menu-item-active-background-color: $blue;
}
</style>
