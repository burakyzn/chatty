var kullaniciAdi = prompt("Lutfen kullanici adi girin", "sakaryali54");
var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

socket.emit('newuser', kullaniciAdi);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('nicknameerror', function (msg) {
  alert(msg.text);
  window.location.reload();
})

socket.on('onlineusers', function (users) {
  $('#onlineUsers').empty();
  for (const [key, value] of Object.entries(users)) {
    var item = $('<li></li>').addClass('user-li');
    item.id = key;
    var greendot = $('<span></span>').addClass('green-dot');
    var usertext = $('<span></span>').text(value).addClass('margin-5');
    $(item).append(greendot);
    $(item).append(usertext);
    $('#onlineUsers').append(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
})

socket.on('chat message', function (msg) {
  var item = $('<li></li>')
  
  var userText = $('<span></span>').text(msg.text);

  if(msg.user != "system"){
    var img = $('<img></img>').attr('src', msg.user.avatar).addClass('circle');
    msg.user.nickname = msg.user.nickname + ' : ';
    var userName = $('<span></span>').text(msg.user.nickname).addClass('margin-5').css('color', msg.user.color);
    $(item).append(img);
    $(item).append(userName);
    $(item).append(userText);
  }else{
    $(item).append(userText);
  }
  
  messages.append(item[0]);
  window.scrollTo(0, document.body.scrollHeight);
});