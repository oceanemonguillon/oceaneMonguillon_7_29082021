<template>
  <div id="app">
    <router-view/>
    <footer class="footer">
      <p>{{ copyright }}</p>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
		copyright() {
			const currentYear = new Date().getFullYear()
			return `© Copyright Groupomania ${currentYear}`
		}
  }
}
</script>

<style lang="scss">
#app {
  font-family: Times, Times New Roman, serif;
  text-align: center;
  color: #2c3e50;
}

footer {
  margin-top: 70px;
  padding-bottom: 20px;
}

</style>