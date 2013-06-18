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
                ]
            },
            production: {
                options: {
                    dir: "./build/production"
                }
            },
            development: {
                options: {
                    dir: "./build/development",
                    optimize: "none"
                }
            }
        }
    });
    
    // Load the plugins.
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    
    // Register tasks.
    grunt.registerTask("default", "requirejs");
};
