function FoodCtrl($scope) {
  this.keys = {};
  this._$scope = $scope;

  this.go = $scope.go;
  this.prefix = $scope.prefix;

  this.dragDrop();
  this.listen();

  $scope.optionFoods = [
    { name: 'burritos', desc: 'yum' },
    { name: 'nachos', desc: 'yum' },
    { name: 'fries', desc: 'yum' },
    { name: 'whatever', desc: 'yum' },
    { name: 'dude', desc: 'yum' },
  ];

  $scope.selectedFoods = [
    { name: 'poop' }
  ];

  $scope.addFood = function() {
    $scope.optionFoods.push({ name: $scope.newFood.name, desc: $scope.newFood.desc });
    this.newFood($scope.newFood);

    $scope.newFood.name = '';
    $scope.newFood.desc = '';

  }.bind(this);
}

FoodCtrl.prototype.newFood = function(food) {
  this.keys.newFood.set(food);
};

FoodCtrl.prototype.dragDrop = function() {
  this.keys.sort = this.go.key(this.prefix + '/sort');
  $(function() {
    $( "#sortable1, #sortable2" ).sortable({
      connectWith: ".connectedSortable"
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
      return;
    }

    var start = Sizzle(currentTarget);
    var end = Sizzle(data.value.stop);

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
