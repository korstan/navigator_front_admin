<template>
  <b-menu-item
    @click.native="$emit('route')"
  >
    <template slot="label">
      {{title}}
      <b-dropdown
        aria-role="list"
        class="is-pulled-right"
        position="is-top-left"
        :triggers="['hover']"
        v-if="!hideActions"
      >
        <b-icon icon="dots-vertical" slot="trigger"></b-icon>
        <b-dropdown-item @click="$emit('edit', id)" aria-role="listitem">Редактировать</b-dropdown-item>
        <b-dropdown-item @click="$emit('remove', id)" aria-role="listitem">Удалить</b-dropdown-item>
      </b-dropdown>
    </template>
  </b-menu-item>
</template>

<script>
export default {
  name: 'BuildingItem',
  props: {
    id: String,
    title: String,
    hideActions: Boolean
  },
};
</script>

<style></style>
