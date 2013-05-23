var app = angular.module('foodhack', []);
app.run(function($rootScope) {
  $rootScope.go = new goinstant.Platform();
  $rootScope.prefix = 'jbowes/foodhack';

  window.go = $rootScope.go;

  var spinning = false;
  var titleSpin = $rootScope.go.key($rootScope.prefix + '/spin');
  titleSpin.on('set', function() {
    spinning = !spinning;
    $('.icon-food').each(function(index, element) {
      $(element).toggleClass('icon-spin');
    });
  });

  $('#title').on('click', function() {
    titleSpin.set(!spinning);
    $('.icon-food').each(function(index, element) {
      $(element).toggleClass('icon-spin');
    });
  });
});
