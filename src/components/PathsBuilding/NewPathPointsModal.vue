<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Добавить маршрутную точку</p>
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

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close()">
          Отмена
        </button>
        <button
          class="button is-primary"
          @click="submit()"
        >
          Сохранить
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      title: '',
      level: 1,
      x: 0,
      y: 0,
    };
  },
  methods: {
    close: function() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm: function() {
      this.title = '';
      this.level = 1;
      this.x = 0;
      this.y = 0;
    },
    submit: function() {
      this.$emit('submit', {
        title: this.title,
        level: this.level,
        x: this.x,
        y: this.y,
      });
      this.resetForm();
    },
  },
};
</script>

<style></style>
