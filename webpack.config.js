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
		},
		{
			test: /\.css$/,
			use: [ 'css-loader' ]
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
