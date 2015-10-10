'use strict';

$(document).ready(function () {
  function hideDisplayNoneByDefault() {
    $('.display_none_by_default').addClass('display_none');
  }
  hideDisplayNoneByDefault();

  $('#submit').click(function () {
    hideDisplayNoneByDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    if (username === undefined || username === null || username === '') {
      $('#username_empty').removeClass('display_none');
    } else if (password === undefined || password === null || password === '') {
      $('#password_empty').removeClass('display_none');
    } else {
      $.ajax({
        method: 'POST',
        dataType: 'json',
        url: '/login',
        data: {
          'username': username,
          'password': password
        },
        success: function (data, textStatus, jqXHR) {
          console.log({
            'data': data,
            'textStatus': textStatus,
            'jqXHR': jqXHR
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log({
            'jqXHR': jqXHR,
            'textStatus': textStatus,
            'errorThrown': errorThrown
          });
        }
      });
    }
  });
});
