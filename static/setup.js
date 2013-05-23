$(document).ready(function() {
  window.go = new goinstant.Platform();
  window.prefix = 'jbowes/foodhack';
  console.log('go setup!');

  $('#title').on('click', function() {
    console.log('clicked');
    $('.icon-food').each(function(index, element) {
      this.addClass('icon-spin');

    });
  });
});
