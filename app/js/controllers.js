var convert = require('./js/convertVerbete');
var zipVerbete = require('./js/zipVerbete');
var fs = require('fs');
var pdf = require('./js/pdfCreator');
var loadAudio = require('./js/loadAudio');

// Logger
var logger = require('./js/log');

var verbeteControllers = angular.module('verbeteControllers', ['angular-carousel', 'toaster', 'cfp.hotkeys', 'ngAnimate']);

verbeteControllers.factory('Menu', function() {
  return {
    data: {
      showMenu: false,
      toggleMenu: function() {
        this.showMenu = !this.showMenu;
      }
    }
    // Other methods or objects can go here
  };
});

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', '$location', 'toaster', 'Menu', function ($scope, $http, $location, toaster, Menu) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

  $scope.go = function(verbete) {
    if ($scope.verbetes[verbete] == undefined) {
      toaster.pop('error', 'Verbete ' + verbete + ' não encontrado.', '', 5000, 'trustedHtml');
    } else {
      $location.path('/verbete/' + verbete);
    }

  }

  $scope.pop = function(err){
    if (err) {
      toaster.pop('error', "Erro na instalação", 'Não será possível visualizar as imagens.', 5000, 'trustedHtml');
    } else {
      toaster.pop('success', "Dependências instaladas.", 'Todas as dependências foram instaladas com sucesso.', 5000, 'trustedHtml');
    }
  };

  $scope.data = Menu.data;
  $scope.data.search = "";

  // if (process.platform === 'linux') {
  //   fs.exists('/usr/lib/libtiff.so.5', function(exists) {
  //       if (!exists) {
  //         var cmd = "pkexec cp ./app/js/imagemagick-linux/libtiff.so.5 /usr/lib/";
  //         var exec = require('child_process').exec;

  //         exec(cmd, function (err) {
  //           $scope.install = true;
  //           $scope.err = err;
  //           $scope.$apply();
  //         });
  //       }
  //   });
  // }

  // $scope.$watch('install', function () {
  //   if ($scope.install)
  //     $scope.pop($scope.err);
  // });

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', '$location', 'hotkeys', 'Menu', function ($scope, $routeParams, $http, $location, hotkeys, Menu) {

  Menu.data.showMenu = false;

  $http.get('verbetes/verbetes.json').success( function (data) {

    $scope.verbeteDetail = data[$routeParams.verbeteId];

    $scope['zoomActive'] = false;

    $scope.data = {};

    convert.convertVerbete(data[$routeParams.verbeteId]).done(function (results) {
      $scope.verbeteDetail.converted = results;
      data[$routeParams.verbeteId].converted = results
      $scope.$apply();

      pdf.create(data[$routeParams.verbeteId]).done(function(pdffile){
        $scope.data.pdfpath= pdffile.filepath;
        $scope.data.pdfname= pdffile.filename;
        $scope.$apply();
      },function(err){
        logger.error(err);
      });

    }, function (err) {
      logger.error(err);
    });

    zipVerbete.zipVerbete(data[$routeParams.verbeteId]).done(function (verbete) {
      $scope.data.zip = verbete.zip;
      $scope.data.zipname = verbete.zipname;
      $scope.$apply();
    }, function (err) {
      logger.error(err);
    });


    loadAudio.load(data[$routeParams.verbeteId]).done(function (audio) {
      logger.info(audio);
      $scope.data.audio = audio;
      $scope.$apply();
    }, function (err) {
      logger.error(err);
    });


    $scope.removeZoomContainer = function() {
      $('.zoomContainer').remove();
    }

    $scope.toggleZoom = function() {
      $scope.zoomActive = !$scope.zoomActive;
    }

    $scope.printPDF = function() {
    }

    hotkeys.bindTo($scope)
    .add({
      combo: 'esc',
      description: 'Move to index',
      callback: function() {
        logger.info("Esc pressed, moving to index");
        $scope.removeZoomContainer();
        $location.path('/');
      }
    })
    .add({
      combo: 'l',
      description: 'Toggle Zoom',
      callback: function() {
        logger.info("Z pressed, togglin zoom");
        $scope.toggleZoom();
      }
    })
    .add({
      combo: 'ctrl+p',
      description: 'Print',
      callback: function() {
        logger.info("CTRL + P, Printing...");
        $scope.printPDF();

      }
    })
    .add({
      combo: '?',
      description: 'Help',
      callback: function() {
        logger.info("? pressed, showing help");
      }
    });

  });
}]);



verbeteControllers.controller("MenuCtrl", function ($scope, $location) {
  $scope.menuClass = function(page) {
    var current = $location.path().substring(1);
    return page === current ? "active" : "";
  };
});

verbeteControllers.directive('hyperlink', function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: { href:'@' },
    template: "<div><a ng-click='openURL(href)' ng-transclude></a></div>",
    link: function (scope, element) {
      scope.openURL = function (href) {
        gui.Shell.openExternal(href)
      }
    }
  };
});

verbeteControllers.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html'
  };
});

verbeteControllers.directive('phResizable', ['$window', function ($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      $scope.$apply()
    });
  };
}]);

verbeteControllers.directive('phElevateZoom', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.attr('data-zoom-image',attrs.zoomImage);
      $(element).elevateZoom({
        scrollZoom : true,
        //zoomType  : "inner",
        zoomType   : "lens",
        lensShape : "round",
        lensSize : 200,
        zoomWindowFadeIn: 500,
        lensFadeIn: 500
      });
    }
  };
});

