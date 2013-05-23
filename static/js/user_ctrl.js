function UserCtrl($scope) {
  this._$scope = $scope;

  $scope.users = [
    {name: 'jbowes' }
  ];

  var user = $scope.go.key('./user');
  user.get(function(data) {
    console.log(data.value);
  });
}
