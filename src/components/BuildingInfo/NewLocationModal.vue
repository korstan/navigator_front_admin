<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Добавить локацию</p>
        <button type="button" class="delete" @click="close()" />
      </header>
      <section class="modal-card-body">
        <b-field label="Название">
          <b-input v-model="title" placeholder="Название локации" required>
          </b-input>
        </b-field>

        <b-field label="Этаж">
          <b-input v-model="level" placeholder="Номер этажа" required disabled>
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
      </section>
      <footer class="modal-card-foot is-flex is-justify-content-center">
        <button class="button" type="button" @click="close()">
          Отмена
        </button>
        <button
          class="button is-link"
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
  props: ['visible', 'initialX', 'initialY', 'currentLevel'],
  data() {
    return {
      title: '',
      x: 0,
      y: 0,
      x_entry: null,
      y_entry: null
    };
  },
  methods: {
    close: function() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm: function() {
      this.title = '';
      this.x = 0;
      this.y = 0;
      this.x_entry = null;
      this.y_entry = null
    },
    submit: function() {
      this.$emit('submit', {
        title: this.title,
        level: this.level,
        x: this.x,
        y: this.y,
        x_entry: this.x_entry,
        y_entry: this.y_entry,
      });
      this.resetForm();
    },
  },
  computed: {
    level: function (){
      return this.currentLevel;
    }
  },
  watch: {
    initialX(val) {
      this.x = val;
    },
    initialY(val) {
      this.y = val;
    },
  },
};
</script>

<style></style>
