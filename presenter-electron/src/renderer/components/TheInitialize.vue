<template>
  <form @submit.prevent="execInitialize">
    <p>
      <label>
        <span>APIKEY</span><br />
        <input
          type="text"
          v-model="formData.apiKey"
          @input="save('apiKey', $event.target.value)"
        />
      </label>
    </p>
    <p>
      <label>
        <span>Auth Domain</span><br />
        <input
          type="text"
          v-model="formData.authDomain"
          @input="save('authDomain', $event.target.value)"
        />
      </label>
    </p>
    <p>
      <label>
        <span>Database URL</span><br />
        <input
          type="text"
          v-model="formData.databaseURL"
          @input="save('databaseURL', $event.target.value)"
        />
      </label>
    </p>
    <p>
      <label>
        <span>Project ID</span><br />
        <input
          type="text"
          v-model="formData.projectId"
          @input="save('projectId', $event.target.value)"
        />
      </label>
    </p>
    <p>
      <button type="submit">Launch</button>
    </p>
  </form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        apiKey: localStorage.getItem('apiKey') || null,
        authDomain: localStorage.getItem('authDomain') || null,
        databaseURL: localStorage.getItem('databaseURL') || null,
        projectId: localStorage.getItem('projectId') || null
      }
    }
  },
  methods: {
    execInitialize() {
      this.$emit('submit', {
        ...this.formData
      })
    },
    save(k, v) {
      localStorage.setItem(k, v)
    }
  }
}
</script>

<style scoped>
form {
  padding: 12px;
  background: #fff;
}

input {
  width: 400px;
  padding: 5px;
  margin: 10px 0 20px;
}
</style>
