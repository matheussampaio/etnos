App.View.Page = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var fs = require('fs');

        fs.readdir('./files', function (err, files) {
            

            if (err) {
                console.error(err.stack);
            } else {
                // Compile the template using underscore
                var template = _.template( $("#verbete_template").html(), { files: files } );
                // Load the compiled HTML into the Backbone "el"

                var $el = $('#verbete-list');
                $el.html( template );
                $el.removeClass();
            }
        });
    }


});