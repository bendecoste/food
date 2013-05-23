function UserCtrl($scope) {
  this._$scope = $scope;

  $scope.users = [];

  var users = $scope.go.key($scope.prefix + '/users');

  function removeUser(key) {
    var toRemove;
    _.each($scope.users, function(user) {
      if (user.username === key) {
        toRemove = user;
      }
    });
    $scope.users.splice($scope.users.indexOf(toRemove), 1);
  }

  function setUsers(data) {
    _.each(data.value, function(user, key) {
      if (!user) {
        removeUser(key);
        return;
      }
      console.log(user);
      $scope.users.push(user);
    });
    $scope.$apply();
  }

  users.get(function(data) {
    setUsers(data);

    me.get(function(data) {
      myusername = data.value.username;
      var user = {name: data.value.displayName, username: myusername};
      var wrap = {};
      wrap[myusername] = user;
      $scope.users.push(user);
      $scope.$apply();
      users.update(wrap);

      if (myusername !== 'anonymous') {
        console.log('logged in already');
        $('#loginbutton').attr('disabled', true);
      }

      users.on('update', function(data) {
        setUsers(data);
      });
    });
  });

  window.onbeforeunload = function() {
    var empty = {};
    empty[myusername] = null;
    users.update(empty);
  };

  var myusername;
  var me = $scope.go.key('/.user');
}
