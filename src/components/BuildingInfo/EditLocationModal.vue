<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Изменить локацию</p>
        <button type="button" class="delete" @click="close()" />
      </header>
      <section class="modal-card-body">
        <b-field label="Название">
          <b-input v-model="title" placeholder="Название локации" required>
          </b-input>
        </b-field>

        <b-field label="Этаж">
          <b-input v-model="level" placeholder="Номер этажа" required>
          </b-input>
        </b-field>

        <b-field label="X">
          <b-input v-model="x" placeholder="Координата X" required> </b-input>
        </b-field>

        <b-field label="Y">
          <b-input v-model="y" placeholder="Координата Y" required> </b-input>
        </b-field>

        <b-field label="Вход X">
          <b-input v-model="x_entry" placeholder="Координата входа X"> </b-input>
        </b-field>

        <b-field label="Вход Y">
          <b-input v-model="y_entry" placeholder="Координата входа Y"> </b-input>
        </b-field>

        <b-field label="Связанная точка маршрута">
          <b-loading v-model="isLoading"></b-loading>
          <b-select v-if="!isLoading" v-model="pathPointId" placeholder="Имя связанной точки">
            <option
              v-for="point in pathPoints"
              :value="point.id"
              :key="point.id">
              {{ point.title }}
            </option>
          </b-select>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close()">
          Отмена
        </button>
        <button
          class="button"
          @click="submit()"
        >
          Сохранить
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import coreApi from '@/services/api/core';

export default {
  props: ['visible', 'initialLocation', 'buildingId'],
  data() {
    return {
      id: this.initialLocation.id,
      title: this.initialLocation.title,
      level: this.initialLocation.level,
      x: this.initialLocation.x,
      y: this.initialLocation.y,
      x_entry: this.initialLocation.x_entry,
      y_entry: this.initialLocation.y_entry,
      pathPointId: this.initialLocation.pathPointId,
      isLoading: false,
      pathPoints: [],
    };
  },
  created: async function() {
    this.isLoading = true;
    this.pathPoints = await coreApi.getPathPoints(this.buildingId, this.initialLocation.level);
    this.isLoading = false;
  },
  methods: {
    close: function() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm: function() {
      this.id = undefined,
      this.title = '';
      this.level = 1;
      this.x = 0;
      this.y = 0;
      this.x_entry = 0;
      this.y_entry = 0;
      this.pathPointId = null;
    },
    submit: function() {
      this.$emit('submit', {
        id: this.id,
        title: this.title,
        level: this.level,
        x: this.x,
        y: this.y,
        x_entry: this.x_entry,
        y_entry: this.y_entry,
        pathPointId: this.pathPointId
      });
      this.resetForm();
    },
  },
};
</script>

<style></style>
