<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Изменить здание</p>
        <button type="button" class="delete" @click="close()" />
      </header>
      <section class="modal-card-body">
        <b-field label="Название">
          <b-input v-model="building.title" placeholder="Название здания" required>
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close()">
          Отмена
        </button>
        <button class="button" @click="$emit('submit', building)">
          Сохранить
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>


export default {
  props: ['visible', 'initialBuilding'],
  data() {
    return {
      building: {
        id: this.initialBuilding.id,
        title: this.initialBuilding.title
      }
    };
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
  },
};
</script>

<style>
</style>
