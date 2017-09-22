module.exports = {
	entry: './src/js/scripts.js',

	module: {
	  rules: [
	    { 
            test: /\.js$/, 
            exclude: /node_modules/, 
            loader: "babel-loader",
            query: {
                presets: ["env", "react"]
            }
        }
	  ]
	},

	resolve: {
		extensions: ['.js', '.json']
	},

	output: {
		filename: './src/bundle.js'
	},
}
