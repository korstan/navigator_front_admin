<template>
  <b-modal v-model="visible" @close="close()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Добавить здание</p>
        <button type="button" class="delete" @click="close()" />
      </header>
      <section class="modal-card-body">
        <b-field label="Название">
          <b-input v-model="title" placeholder="Название здания" required>
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="close()">
          Отмена
        </button>
        <button class="button is-primary" @click="submit()">
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
    };
  },
  methods: {
    close: function() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm: function() {
      this.title = '';
    },
    submit: function() {
      this.$emit('submit', { title: this.title });
      this.resetForm();
    },
  },
};
</script>

<style></style>
