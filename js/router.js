var Router = Backbone.Router.extend({
    routes: {
        'index(:page).html':   App.Controller.Home
        // 'search/:term(/:page)': App.Controller.Search
    }
});

App.Router = new Router();

Backbone.history.start({
    hashChange: false,
    pushState: true
});