const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/server.ts",
    target: "node",
    mode: "development",
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Use ts-loader for .ts files
                exclude: /node_modules/,
                use: "ts-loader",
            },
        ],
    },
};
