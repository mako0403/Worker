module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,//
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: []
        }
    },
})