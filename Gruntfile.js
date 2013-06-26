module.exports = function(grunt) {
    
    grunt.initConfig({
        requirejs: {
            options: {
                baseUrl: "./daydreamer",
                paths: {
                    "require": "../components/requirejs/require"
                },
                modules: [
                    {
                        name: "daydreamer",
                        include: []
                    }
                ],
                optimize: "uglify2",
                optimizeAllPluginResources: true
            },
            production: {
                options: {
                    dir: "./build/production",
                    uglify2: {
                        output: {
                            max_line_len: 1000
                        }
                    }
                }
            },
            development: {
                options: {
                    dir: "./build/development",
                    uglify2: {
                        output: {
                            beautify: true
                        }
                    }
                }
            }
        }
    });
    
    // Load the plugins.
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    
    // Register tasks.
    grunt.registerTask("default", "requirejs");
};
