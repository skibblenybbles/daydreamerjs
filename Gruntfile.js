module.exports = function(grunt) {
    
    grunt.initConfig({
        requirejs: {
            options: {
                baseUrl: "./daydreamer",
                paths: {
                    "requirejs": "../components/requirejs/require"
                },
                modules: [
                    // This is used to build daydreamer as a standalone file
                    // without requirejs baked in.
                    {
                        name: "daydreamer",
                        include: []
                    }
                    /*
                    // This is used to build a single file for daydremaer with
                    // requirejs baked in.
                    {
                        name: "daydreamer",
                        include: ["requirejs"]
                    }
                    */
                ],
                optimize: "uglify2"
            },
            production: {
                options: {
                    dir: "./build/production",
                    uglify2: {
                        output: {
                            max_line_len: 1000
                        }
                    }/*,
                    removeCombined: true*/
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
