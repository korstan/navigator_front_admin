<template>
  <b-modal v-model="visible" @close="$emit('close')">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Подтвердите удаление "{{title}}"</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$emit('close')">
          Отмена
        </button>
        <button class="button is-danger" @click="$emit('remove')">
          OK
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>


export default {
  props: ['visible', 'title'],
};
</script>

<style>
</style>
