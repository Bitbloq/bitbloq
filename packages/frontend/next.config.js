const webpack = require("webpack");
const withTM = require("next-transpile-modules");
const withWorkers = require('@zeit/next-workers');
const { parsed: localEnv } = require("dotenv").config();

module.exports = withTM(withWorkers({
  transpileModules: [
    "@bitbloq/3d",
    "@bitbloq/ui",
    "@bitbloq/lib3d",
    "@bitbloq/bloqs",
    "@bitbloq/junior",
    "react-dnd",
    "dnd-core"
  ],

  webpack(config, options) {
    const { isServer } = options;

    config.output = {
      ...config.output,
      globalObject: "this"
    };

    config.module.rules.push({
      test: /\.(stl|svg|mp3|png)$/,
      loader: "file-loader",
      options: {
        publicPath: `/_next/static/images/`,
        outputPath: `${isServer ? "../" : ""}static/images/`,
        name: "[name]-[hash].[ext]"
      }
    });

    config.plugins.push(new webpack.EnvironmentPlugin({
      ...localEnv,
    }));

    return config;
  }
}));
