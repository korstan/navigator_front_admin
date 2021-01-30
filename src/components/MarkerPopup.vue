<template>
  <div :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  props: ['visible', 'x', 'y'],
  computed: {
      style () {
        return {
          display: this.visible ? 'flex' : 'none',
          flexDirection: 'column',
          left: this.x ? this.x+'px' : 0,
          top: this.y ? this.y+'px' : 0,
          position: 'absolute',
          width: 'auto',
          border: '2px dashed #5b7fff',
          backgroundColor: 'white',
        };
      }
    },
};
</script>

<style scoped></style>
