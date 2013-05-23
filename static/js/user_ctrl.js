function UserCtrl($scope) {
  this._$scope = $scope;

  $scope.users = [
    {name: 'jbowes' }
  ];

  var newUser = $scope.go.key($scope.prefix + '/newUser');

  newUser.on('set', function(data) {
    console.log(data);
    $scope.users.push({name: data.value.name, id: data.value.id});
    console.log('set!');
  });

  var myName = 'james';
  newUser.set({name: 'james bowes', id: 'me'});
}
