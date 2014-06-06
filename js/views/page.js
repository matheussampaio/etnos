App.View.Page = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var rootDir = './files';

        var fs = require('fs');

        fs.readdir(rootDir, function (err, files) {
            
            if (err) {
                console.error(err.stack);
            } else {

                files.forEach(function (file) {
                    // console.log(rootDir + '/' + file);
                    fs.readdir(rootDir + '/' + file, function (err, files) {
                        // console.log(rootDir + '/' + file + '/' + files);
                        if (err) {
                            console.error(err.stack);
                        } else {
                            files.forEach(function (verbete_path) {
                                fs.readdir(rootDir + '/' + file + '/' + verbete_path, function (err, img) {

                                    if (err) {
                                        console.error(err.stack);
                                    } else {
                                        var verbete = { path: rootDir + '/' + file + '/' + verbete_path + '/' + img[0], title: 'Verbete ' + verbete_path}
                                        // Compile the template using underscore

                                        var template = _.template( $("#verbete_template").html(), { verbete: verbete } );
                                        // Load the compiled HTML into the Backbone "el"

                                        var $el = $('#verbete-list');
                                        $el.append( template );
                                        // $el.removeClass();    
                                    }
                                });
                            });
                        }
                    });
                });
            }
        });
    }


});