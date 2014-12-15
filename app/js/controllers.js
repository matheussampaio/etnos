var convert = require('./js/convertVerbete');
var fs = require('fs');
var pdf = require('./js/pdfCreator');
var loadAudio = require('./js/loadAudio');

// Logger
var logger = require('./js/log');

var verbeteControllers = angular.module('verbeteControllers', [
  'angular-carousel',
  'cfp.hotkeys',
  'ngAnimate',
  'ngProgress',
  'toaster',
  'ui.bootstrap'
]);

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

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', '$location', 'toaster', 'Menu', function ($scope, $http, $location, toaster, Menu) {

  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

  $scope.alert = {};

  $scope.search = function(verbete) {
    verbete = zeroPad(verbete, 5);

    if ($scope.verbetes[verbete] == undefined) {
      $scope.alert.msg = 'Verbete ' + verbete + ' não encontrado.';
      $scope.alert.show = true;
      // toaster.pop('error', 'Verbete ' + verbete + ' não encontrado.', '', 5000, 'trustedHtml');
    } else {
      $location.path('/verbete/' + verbete);
    }
  }

  $scope.closeAlert = function() {
    $scope.alert.show = false;
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


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', '$location', 'hotkeys', 'Menu', 'ngProgress', function ($scope, $routeParams, $http, $location, hotkeys, Menu, ngProgress) {

  Menu.data.showMenu = false;

  $http.get('verbetes/verbetes.json').success( function (data) {

    $scope.verbeteDetail = data[$routeParams.verbeteId];

    $scope['zoomActive'] = false;

    $scope.data = {};

    ngProgress.set(1);
    ngProgress.color('white')
    ngProgress.height('8px')

    $scope.complete = false;

    convert.convertVerbete(data[$routeParams.verbeteId], $scope).done(function (results) {
      $scope.verbeteDetail.converted = results;
      data[$routeParams.verbeteId].converted = results
      ngProgress.complete()
      $scope.complete = true;
      $scope.$apply();

      pdf.create(data[$routeParams.verbeteId]).done(function(pdffile){
        $scope.data.pdfpath = pdffile.filepath;
        $scope.data.pdfname = pdffile.filename;
        $scope.$apply();

      },function(err){
        logger.error(err.stack);
      });

    }, function (err) {
      logger.error(err.stack);
    }, function (progress) {
      var value = progress.length * 100 / data[$routeParams.verbeteId].images.length;
      ngProgress.set(value);
      $scope.verbeteDetail.converted = progress;
      $scope.$apply();
    });

    loadAudio.load(data[$routeParams.verbeteId]).done(function (audio) {
      logger.info(audio);
      $scope.data.audio = audio;
      $scope.$apply();
    }, function (err) {
      logger.error(err.stack);
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
    template: "<a ng-click='openURL(href)' ng-transclude></a>",
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

