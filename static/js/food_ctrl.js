function FoodCtrl($scope) {
  this.keys = {};
  this._$scope = $scope;

  this.go = $scope.go;
  this.prefix = $scope.prefix;

  this.listen();

  $scope.foods = [
    // { name: 'burritos', desc: 'yum' },
    // { name: 'nachos', desc: 'yum' },
    // { name: 'fries', desc: 'yum' },
    // { name: 'whatever', desc: 'yum' },
    // { name: 'dude', desc: 'yum' },
  ];

  $scope.addFood = function() {
    $scope.foods.push({ name: $scope.newFood.name, desc: $scope.newFood.desc });
    this.newFood($scope.newFood);

    $scope.newFood.name = '';
    $scope.newFood.desc = '';

  }.bind(this);
}

FoodCtrl.prototype.newFood = function(food) {
  this.keys.newFood.set(food);
};

FoodCtrl.prototype.listen = function() {
  this.keys = {
    newFood: this.go.key(this.prefix + '/newFood')
  };

  this.keys.newFood.on('set', _.bind(this._handleNewFood, this));
};

FoodCtrl.prototype._handleNewFood = function(data) {
  this._$scope.foods.push({name: data.value.name, desc: data.value.desc});
  this._$scope.$apply();
};
