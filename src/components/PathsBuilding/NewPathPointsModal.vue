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
          <b-input v-model="level" placeholder="Номер этажа" required disabled>
          </b-input>
        </b-field>

        <b-field label="X">
          <b-input v-model="x" placeholder="Координата X" required> </b-input>
        </b-field>

        <b-field label="Y">
          <b-input v-model="y" placeholder="Координата Y" required> </b-input>
        </b-field>

        <b-field label="Текст для озвучки">
          <b-input v-model="textToSpeech" placeholder="Текст для озвучки маршрута"> </b-input>
        </b-field>

        <b-field label="Лестница?">
          <b-checkbox v-model="isStairs"></b-checkbox>
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
  props: ['visible', 'initialX', 'initialY', 'currentLevel'],
  data() {
    return {
      title: '',
      x: 0,
      y: 0,
      textToSpeech: '',
      isStairs: false,
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
      this.textToSpeech = '';
      this.isStairs = false;
    },
    submit: function() {
      this.$emit('submit', {
        title: this.title,
        level: this.level,
        x: this.x,
        y: this.y,
        textToSpeech: this.textToSpeech,
        isStairs: this.isStairs,
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
  }
};
</script>

<style></style>
