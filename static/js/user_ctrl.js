function UserCtrl($scope) {
  this._$scope = $scope;

  $scope.users = [];

  var newUser = $scope.go.key($scope.prefix + '/newUser');

  newUser.on('set', function(data) {
    console.log(data);
    $scope.users.push({name: data.value.name});
    $scope.$apply();
    console.log('set!');
  });

  $scope.setUser = function() {
    var user = {name: $('#username').val()};
    console.log(user);
    newUser.set(user);
  };
}
