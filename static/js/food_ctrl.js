function FoodCtrl($scope) {
  $scope.foods = [
    { name: 'burritos', desc: 'yum' },
    { name: 'nachos', desc: 'yum' },
    { name: 'fries', desc: 'yum' },
    { name: 'whatever', desc: 'yum' },
    { name: 'dude', desc: 'yum' },
  ];

  $scope.addFood = function() {
    $scope.foods.push({ name: $scope.newFood.name, desc: $scope.newFood.desc });
    $scope.newFood.name = '';
    $scope.newFood.desc = '';
  }
}
