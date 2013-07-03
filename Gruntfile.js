module.exports = function(grunt) {
    
    grunt.initConfig({
        
        // JSHint config.
        jshint: {
            options: {
                // Turn off line-separated "x ? y : z" warnings.
                "-W014": false,
            },
            src: [
                "./Gruntfile.js",
                "./daydreamer/**/*.js"
            ]
        },
        
        // RequireJS config.
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
                    // This is used to build a single file for daydreamer with
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
        },
        
        // Connect config.
        connect: {
            options: {
                port: 8081
            },
            serve: {
                options: {
                    keepalive: true
                }
            },
            test: {}
        },
        
        // QUnit config.
        qunit: {
            options: {
                urls: [
                    "http://localhost:8081/tests/array.html",
                    "http://localhost:8081/tests/array-legacy.html"
                ]
            },
            test: {}
        }
    });
    
    // Load the plugins.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    
    // Register tasks.
    grunt.registerTask("default", "jshint");
    grunt.registerTask("build", ["jshint", "test", "requirejs"]);
    grunt.registerTask("quick", ["jshint", "requirejs"]);
    grunt.registerTask("test", ["connect:test", "qunit:test"]);
    grunt.registerTask("serve", "connect:serve");
};
