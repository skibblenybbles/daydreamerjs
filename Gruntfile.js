module.exports = function(grunt) {
    
    grunt.initConfig({
        
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
            server: {
                options: {
                    keepalive: true
                }
            },
            test: {}
        },
        
        // QUnit config.
        qunit: {
            all: {
                options: {
                    urls: [
                        "http://localhost:8081/tests/example.html"
                    ]
                }
            }
        }
    });
    
    // Load the plugins.
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    
    // Register tasks.
    grunt.registerTask("default", "requirejs");
    grunt.registerTask("serve", "connect:server");
    grunt.registerTask("test", ["connect:test", "qunit:all"]);
};
