var convert = require('./js/convertVerbete');
var zipVerbete = require('./js/zipVerbete');
var fs = require('fs');

var verbeteControllers = angular.module('verbeteControllers', ['angular-carousel', 'toaster', 'cfp.hotkeys', 'snap']);

var scp;
verbeteControllers.controller('VerbeteListCtrl', ['$scope', '$http', '$location', 'toaster', 'snapRemote', function ($scope, $http, $location, toaster, snapRemote) {
  scp = $scope;

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


verbeteControllers.controller('VerbeteDetailCtrl', ['$scope', '$routeParams', '$http', '$location', 'hotkeys', 'snapRemote', function ($scope, $routeParams, $http, $location, hotkeys, snapRemote) {
  $http.get('verbetes/verbetes.json').success( function (data) {

    snapRemote.close();

    $scope.verbeteDetail = data[$routeParams.verbeteId];

    $scope['zoomActive'] = false;

    convert.convertVerbete(data[$routeParams.verbeteId]).done(function (results) {
      $scope.verbeteDetail.converted = results;
      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    zipVerbete.zipVerbete(data[$routeParams.verbeteId]).done(function (verbete) {
      $scope.data = {};
      $scope.data.zip = verbete.zip;
      $scope.data.zipname = verbete.zipname;
      $scope.$apply();
    }, function (err) {
      console.error(err);
    });

    $scope.removeZoomContainer = function() {
      $('.zoomContainer').remove();
    }

    $scope.toggleZoom = function() {
      $scope.zoomActive = !$scope.zoomActive;
    }

    $scope.printPDF = function() {
        //       var doc = new jsPDF();
        // doc.text(20, 20, 'Hello world!');
        // doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        // doc.addPage();
        // doc.text(20, 20, 'Do you like that?');

        // doc.output("dataurlnewwindow", "text.pdf");
      window.print();
    }

    hotkeys.bindTo($scope)
    .add({
      combo: 'esc',
      description: 'Move to index',
      callback: function() {
        console.log("Esc pressed, moving to index");
        $scope.removeZoomContainer();
        $location.path('/');
      }
    })
    .add({
      combo: 'l',
      description: 'Toggle Zoom',
      callback: function() {
        console.log("Z pressed, togglin zoom");
        $scope.toggleZoom();
      }
    })
    .add({
      combo: 'ctrl+p',
      description: 'Print',
      callback: function() {
      console.log("CTRL + P, Printing...");
        $scope.printPDF();

      }
    })
    .add({
      combo: '?',
      description: 'Help',
      callback: function() {
        console.log("? pressed, showing help");
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


verbeteControllers.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html'
  };
});


verbeteControllers.directive('trianglify', ['$window', function ($window) {
    return function(scope, element, attr) {

      var t = new Trianglify({x_gradient: ["#FFCC29", "#00A859", "#3E4095"]});
      var pattern = t.generate(2500, 1500);

      element.css({
       backgroundImage: pattern.dataUrl
      });

    };
}]);

verbeteControllers.directive('phResizable', ['$window', function ($window) {
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

