App.Model.Verbete = Backbone.Model.extend({

    buildBasicView: function () {
    
      var model = this;

      model.view = new App.View.VerbeteListItem({
          model: model
      });
    },

    getShortTitle: function() {
      if (this.get('title').length > 19) {
        return this.get('title').substring(0, 13) + "...";
      }

      return this.get('title');
    },


    initialize: function () {
        this.buildBasicView();
    }

});