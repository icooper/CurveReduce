const path = require("path");

module.exports = {
    target: "node",
    mode: "production",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
    }
};