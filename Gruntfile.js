module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            local: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    ui: 'tdd'
                },

                src: ['app/tests/**/*.js']
//                src: ['app/tests/Admin_UnitTest.js']

            },
            shippable: {
                options: {
                    reporter: 'mocha-junit-reporter',
                    reporterOptions: {
                        mochaFile: 'shippable/testresults/result.xml'
                    },
                    ui: 'tdd'
                },
                src: ['app/tests/**/*.js']
                // src:['app/tests/ChatPublicly_UnitTest.js']
            }

        },
        mocha_istanbul: {
            coverage: {
                src: ['app/tests/**/*.js'], 
                options: {
                    mochaOptions: ['--ui', 'tdd'],
                    excludes:['*.js','app/routes/*'],
                    reporter: 'spec',
                    reportFormats: ['html','lcovonly']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-mocha-istanbul');
    

    // Default task(s).
    grunt.registerTask('default', []);

    //Test
    grunt.registerTask('test', ['mochaTest:local']);

    // Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);
    


};
