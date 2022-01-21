// This part of the code runs on node so we disable appropriate rules (eslint is set up as browser)
const path = require("path");
const webpack = require("webpack");

// Webpack config
exports.onCreateWebpackConfig = ({ actions }) => {
  // Tell webpack where to look when using alias in importing component and more
  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
      }),
    ],
    resolve: {
      fallback: {
        electron: false,
        crypto: false,
        stream: require.resolve("stream-browserify"),
        "stream-http": false,
        buffer: require.resolve("buffer"),
        assert: false,
        util: false,
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: false,
      },
      alias: {
        components: path.resolve(__dirname, "src/components"),
        config: path.resolve(__dirname, "src/config"),
        contexts: path.resolve(__dirname, "src/contexts"),
        hooks: path.resolve(__dirname, "src/hooks"),
        images: path.resolve(__dirname, "src/images"),
        store: path.resolve(__dirname, "src/store"),
        styles: path.resolve(__dirname, "src/styles"),
        utils: path.resolve(__dirname, "src/utils"),
        types: path.resolve(__dirname, "src/types"),
        abi: path.resolve(__dirname, "src/abi"),
        contracts: path.resolve(__dirname, "../contracts/build/contracts"),
      },
    },
  });
};
