const { defineConfig } = require('@vue/cli-service')
// const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
  }
});

// module.exports = {
//   outputDir: path.resolve(__dirname, '../backend/public'),
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://localhost:8081'
//       }
//     }
//   }
// }
