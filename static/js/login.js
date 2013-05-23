$(document).ready(function() {
  $('#loginbutton').on('click', function() {
    if ($('#loginbutton').attr('disabled')) return false;
    window.open("http://auth.goinstant.net?returnurl=" + window.location.href);
    return false;
  });
});
