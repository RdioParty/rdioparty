var ServerActionCreator = require('../actions/ServerActionCreator');

module.exports = {
  createRoom: function(name) {
    $.ajax({
      url: '/api/rooms',
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify({
        name: name
      })
    })
      .done(function(data) {
        if (data.status === 'ok') {
          ServerActionCreator.createRoom(name);
        }
      })
      .fail(function(xhr, status) {
        alert(xhr.responseText);
      });
  }
}
