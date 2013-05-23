var app = angular.module('foodhack', []);
app.run(function($rootScope) {
  $rootScope.go = new goinstant.Platform();
  $rootScope.prefix = 'jbowes/foodhack';

  window.go = $rootScope.go;
});
