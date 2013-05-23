function FoodCtrl($scope) {
  this.keys = {};
  this._$scope = $scope;

  this.go = $scope.go;
  this.prefix = $scope.prefix;

  this.getFoods();
  this.dragDrop();
  this.listen();

  $scope.optionFoods = [];
  // $scope.optionFoods = {
  //   'Rice': { desc: 'yum' },
  //   'Green Curry': { desc: 'yum' },
  //   'Red Curry': { desc:  'yum' },
  //   'Ribs': 'yum': { desc: 'yum' },
  //   'Spring Rolls': { desc: 'yum' }
  // };

  $scope.selectedFoods = [
    { name: 'Soda', desc: 'yes' }
  ];

  $scope.addFood = function() {
    this._$scope.optionFoods.push({
      name: $scope.newFood.name,
      desc: $scope.newFood.desc
    });

    this.newFood($scope.newFood);

    $scope.newFood.name = '';
    $scope.newFood.desc = '';

  }.bind(this);
}

FoodCtrl.prototype.getFoods = function() {

  var foods = this.go.key(this.prefix + '/foods');
  // this is no good without an array
  foods.get(function(data) {
    _.each(data.value, function(desc, name) {
      this._$scope.optionFoods.push({ name: name, desc: desc });
    }.bind(this));
  }.bind(this));
};

FoodCtrl.prototype.newFood = function(food) {
  var foods = this.go.key(this.prefix + '/foods');
  var update = {};
  update[food.name] = food.desc;
  foods.update(update);
};

FoodCtrl.prototype.dragDrop = function() {
  this.keys.sort = this.go.key(this.prefix + '/sort');
  $(function() {
    $( "#sortable1, #sortable2" ).sortable({
      connectWith: ".connectedSortable",
      cancel: ".nosort"
    }).disableSelection();
  });

  $('#sortable1, #sortable2').on('sortstart', function(event, ui) {
    this.keys.sort.update({
      'start': createSelector(ui.item[0])
    });
  }.bind(this));

  $('#sortable1, #sortable2').on('sortstop', function(event, ui) {
    this.keys.sort.update({
      'stop': createSelector(ui.item[0])
    });
  }.bind(this));

  $('#sortable1, #sortable2').on('sortupdate', function(event, ui) {
    this.keys.sort.remove();
  }.bind(this));

  var currentTarget;
  this.keys.sort.on('update', function(data) {
    if (data.value.start) {
      currentTarget = data.value.start;
      $(Sizzle(currentTarget)).addClass('nosort');
      return;
    }

    var start = Sizzle(currentTarget);
    var end = Sizzle(data.value.stop);

    $(start).removeClass('nosort');

    $(start).insertBefore($(end));
  });
};

FoodCtrl.prototype.listen = function() {
  this.keys.newFood = this.go.key(this.prefix + '/newFood');

  this.keys.newFood.on('set', _.bind(this._handleNewFood, this));
};

var alertOn = false;

FoodCtrl.prototype._handleNewFood = function(data) {
  if(!alertOn) {
    $('#newFoodAlert').fadeToggle();
    setTimeout(function() {
      $('#newFoodAlert').fadeToggle();
      alertOn = !alertOn;
    }, 2000);
  }

  console.log('food data', data);
  this._$scope.optionFoods.push({name: data.value.name, desc: data.value.desc});
  this._$scope.$apply();
};

function createSelector(el) {
  var selector = '';
  if (el == document.documentElement) {
    return 'DOC_EL';
  }

  if (el.parentNode) {
    var currentParent = el.parentNode,
        childEl = el,
        childTagName = el.tagName || el.nodeName.slice(1), // el.nodeName is for highlighting with keyboard
        childIndex;
    while (currentParent && currentParent.tagName) {

      // Need to call toUpperCase so that tag names are in upper case
      // regardless of the browser IE8 doesn't capitalize HTML5 elements like
      // article
      var selectorWithoutIndex = escapeTagName(childTagName.toUpperCase());
      childIndex = $(currentParent).children(selectorWithoutIndex).index(childEl);

      //Index of -1 can happen in IE7 and IE8, it will cause other clients to freeze
      //This is a quick fix, refer to issue #456 for more details
      if (childIndex == -1) {
        childIndex = 0;
      }

      selector = selectorWithoutIndex + ':eq(' + childIndex + ') > ' + selector;

      if (currentParent.parentNode && currentParent.parentNode.tagName) {
        childTagName = currentParent.tagName;
        childEl = currentParent;
        currentParent = currentParent.parentNode;
      } else {
        break;
      }
    }
  }

  selector = selector.replace(/\s>\s$/,'');

  return selector;
};

var ESCAPE_TAGNAME_REGEX = /([ #;?&,.+*~\':"!\^$\[\]()=>|\/@])/g;
function escapeTagName(selector) {
  if (!selector) return '';

  return selector.replace(ESCAPE_TAGNAME_REGEX, '\\$1');
};
