var convert = require('./js/convertVerbete');
var zipVerbete = require('./js/zipVerbete');
var fs = require('fs');

var verbeteControllers = angular.module('verbeteControllers', ['angular-carousel', 'toaster']);

verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {
  $http.get('verbetes/verbetes.json').success( function (data) {
    $scope.verbetes = data;
  });

  $scope.pop = function(err){
    if (err) {
      toaster.pop('error', "Erro na instalação", 'Não será possível visualizar as imagens.', 5000, 'trustedHtml');
    } else {
      toaster.pop('success', "Dependências instaladas.", 'Todas as dependências foram instaladas com sucesso.', 5000, 'trustedHtml');
    }
  };

  if (process.platform === 'linux') {
    fs.exists('/usr/lib/libtiff.so.5', function(exists) {
        if (!exists) {
          var cmd = "gksudo cp ./app/js/imagemagick-linux/libtiff.so.5 /usr/lib/ -m 'Você deve inserir sua senha para podermos instalar as dependencias necessárias para converter imagens.'";
          var exec = require('child_process').exec;

          exec(cmd, function (err) {
            $scope.install = true;
            $scope.err = err;
            $scope.$apply();
          });
        }
    });
  }

  $scope.$watch('install', function () {
    if ($scope.install)
      $scope.pop($scope.err);
  });

}]);


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  $http.get('verbetes/verbetes.json').success( function (data) {

    $scope.verbeteDetail = data[$routeParams.verbeteId - 1];

    convert.convertVerbete(data[$routeParams.verbeteId - 1]).done(function (results) {
      $scope.verbeteDetail.converted = results;
      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    zipVerbete.zipVerbete(data[$routeParams.verbeteId - 1]).done(function (verbete) {
      $scope.data = {};
      $scope.data.zip = verbete.zip;
      $scope.data.zipname = verbete.zipname;
      $scope.$apply();

      console.log('data', $scope.data);
    }, function (err) {
      console.error(err);
    });

    $scope.removeZoomContainer = function() {
      console.log("Removing zoom containers...");

      $('.zoomContainer').remove();
    }
  });
}]);


verbeteControllers.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html'
  };
});


verbeteControllers.directive('trianglify', ['$window', function($window) {
    return function(scope, element, attr) {

      var t = new Trianglify({x_gradient: ["#FFCC29", "#00A859", "#3E4095"]});
      var pattern = t.generate(2500, 1500);

      element.css({
       backgroundImage: pattern.dataUrl
      });

    };
}]);

verbeteControllers.directive('phResizable', ['$window', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      return $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
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