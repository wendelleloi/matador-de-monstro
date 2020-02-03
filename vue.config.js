module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/styles/variables.scss`
        // data: `@import "~@/styles/main.scss";`
      }
    }
  }
}
