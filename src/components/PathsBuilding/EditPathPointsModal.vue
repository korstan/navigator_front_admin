<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Изменить маршрутную точку</p>
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

        <b-field label="Связи">
          <b-loading v-model="isLoading"></b-loading>
          <div v-if="!isLoading" class="block">
            <b-checkbox
              v-for="link in currentLevelPoints"
              :key="link.id"
              v-model="checkboxLinks"
              :native-value="link.id"
            >
              {{link.title}}
            </b-checkbox>
          </div>
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
  props: ['visible', 'initialPoint', 'buildingId'],
  data() {
    return {
      id: this.initialPoint.id,
      title: this.initialPoint.title,
      level: this.initialPoint.level,
      x: this.initialPoint.x,
      y: this.initialPoint.y,
      isLoading: false,
      checkboxLinks: [],
      currentLevelPoints: []
    };
  },

  created: async function() {
    this.isLoading = true;
    this.currentLevelPoints = (await coreApi.getPathPoints(this.buildingId, this.initialPoint.level)).filter(lp=>lp.id != this.initialPoint.id);
    this.checkboxLinks = (await coreApi.getPathPointLinks(this.initialPoint.id));
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
    },
    submit: function() {
      this.$emit('submit', {
        id: this.id,
        title: this.title,
        level: this.level,
        x: this.x,
        y: this.y,
        links: this.checkboxLinks
      });
      this.resetForm();
    },
  },
};
</script>

<style>
  .block {
    display: flex;
    flex-direction: column;
  }
</style>
