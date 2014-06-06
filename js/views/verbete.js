App.View.VerbeteListItem = Marionette.ItemView.extend({
    tagName: 'li',
    className: 'verbete',
    model: App.Model.Verbete,
    
    id: function() {
        return 'verbete-'+this.model.get('title')
    },

    events: {
        'click a': 'select'
    },

    initialize: function () {
        this.render();
    },

    template: _.template('<a href="javascript:;">'+
            '<i class="fa fa-eye fa-3"></i>'+
            '<span class="cover"></span>'+
            '<strong><%- title %></strong>'+
        '</a>'),

    select: function (evt) {
        console.log("Clicked on Verbete");
    }
});
