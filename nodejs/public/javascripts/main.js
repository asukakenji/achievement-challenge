'use strict';

// TODO: Handle "enter" typed at "password" field
// TODO: Handle tab index

$(document).ready(function () {
  function hideDisplayNoneByDefault() {
    $('.display_none_by_default').addClass('display_none');
  }

  function onSubmitClicked() {
    hideDisplayNoneByDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    if (username === undefined || username === null || username === '') {
      $('#username_empty').removeClass('display_none');
    } else if (password === undefined || password === null || password === '') {
      $('#password_empty').removeClass('display_none');
    } else {
      $('#submit').off('click', onSubmitClicked);
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
          switch (data.errorCode) {
            case -2: {
              alert('Error occurred when creating user!');
              break;
            }
            case -1: {
              alert('Incorrect password!');
              break;
            }
            case 0: {
              alert('Login successful');
              break;
            }
            case 1: {
              alert('New user created!');
              break;
            }
            default: {
              alert('Unknown error:' + data.errorCode);
            }
          }
          $('#submit').on('click', onSubmitClicked);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log({
            'jqXHR': jqXHR,
            'textStatus': textStatus,
            'errorThrown': errorThrown
          });
          $('#submit').on('click', onSubmitClicked);
        }
      });
    }
  }

  hideDisplayNoneByDefault();
  $('#submit').on('click', onSubmitClicked);
});
