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
export default {
  props: ['visible', 'initialLocation'],
  data() {
    return {
      id: this.initialLocation.id,
      title: this.initialLocation.title,
      level: this.initialLocation.level,
      x: this.initialLocation.x,
      y: this.initialLocation.y,
    };
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
      });
      this.resetForm();
    },
  },
};
</script>

<style></style>
