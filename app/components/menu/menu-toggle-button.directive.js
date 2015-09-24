(function() {
    'use strict';

    angular
        .module('EtnosApp')
        .directive('menuToggleButton', menuButton);

    function menuButton() {
        return {
            restrict: 'E',
            controller: MenuButtonController,
            controllerAs: 'menuButtonCtrl',
            templateUrl: 'menu/menu-toggle-button.html',
        };
    }

    function MenuButtonController(Menu) {
        this.Menu = Menu;
    }

})();
