var gChatOpts = {
  connected: false, 
  typing: false, 
  lastTypingTime: null,
  typingTimer: 1000, //ms
  rightSpace: 20
},
gChatSockConn, gUserId, gUserName;
var chatSockConn = (function() {

    function chatSockConn(url) {

        this.open = false;
        this.socket = io.connect("http://"+url,{'reconnection': false,'transports': ['websocket', 'polling']});
        this.setupConnectionEvents();
    }

    chatSockConn.prototype = {
        setupConnectionEvents: function() {
            var self = this;

            self.socket.on('connectionopen', function(evt) { self.connectionOpen(evt); });
            self.socket.on('newmessage', function(evt) { self.newmessage(evt); });

            self.socket.on('disconnect', function(evt) { self.disconnect(evt); });

            self.socket.on('login', function(evt) { self.login(evt); });
            self.socket.on('adduser', function(evt) { self.adduser(evt); });
            self.socket.on('userjoined', function(evt) { self.userjoined(evt); });
            self.socket.on('userleft', function(evt) { self.userleft(evt); });
            self.socket.on('typing', function(evt) { self.typing(evt); });
            self.socket.on('stoptyping', function(evt) { self.stoptyping(evt); });
            self.socket.on('reconnect', function(data) { self.reconnect(data); });
            self.socket.on('reconnect_error', function(evt) { self.reconnect_error(evt); });
            
            // self.socket.onopen = function(evt) { self.connectionOpen(evt); };
        },

        connectionOpen: function(data) {
            console.log("data", data);
          gChatOpts.connected = true;
          if(data.frmsock==0){
            data['cid'] = 0;
            data['uid'] = gUserId;
            data['un'] = gUserName;
            this.handShake('connectionopen',data);
          }
          connectionopened(data);
          this.addSystemMessage("Connected");
        },
        login: function(data) {
          // Display the welcome message
          var message = "Welcome to Socket.IO Chat – ";
          log(message, {
            prepend: true
          });
          addParticipantsMessage(data);
        },
        adduser: function(data) {
          this.handShake('adduser',data);
        },
        // Whenever the server emits 'new message', update the chat body
        newmessage: function(data) {
          console.log("data", data);
          if(data.frmsock==0){
            data['fmid'] = gUserId;
            data['fmnm'] = gUserName;
            this.handShake('newmessage',data);
          }
          addChatMessage(data);
        },
        // Whenever the server emits 'user joined', log it in the chat body
        userjoined: function(data) {
          log(data.username + ' joined');
          addParticipantsMessage(data);
        },
        // Whenever the server emits 'user left', log it in the chat body
        userleft: function(data) {
          log(data.username + ' left');
          addParticipantsMessage(data);
          removeChatTyping(data);
        },
        // Whenever the server emits 'typing', show the typing message
        typing: function(data) {
          if(data.frmsock==0){
            data['fmid'] = gUserId;
            data['fmnm'] = gUserName;
            data['type'] = 0;
            this.handShake('typing',data);
          }
          chatTypingMsg(data);
        },
        // Whenever the server emits 'stop typing', kill the typing message
        stoptyping: function(data) {
          if(data.frmsock==0){
            data['fmid'] = gUserId;
            data['fmnm'] = gUserName;
            data['type'] = 1;
            this.handShake('typing',data);
          }
          chatTypingMsg(data);
        },
        reconnect: function() {
          log('you have been reconnected');
          if (username) {
            gChatSockConn.stoptyping();
            this.adduser({un:username,uid:1});
          }
        },
        reconnect_error: function() {
          log('attempt to reconnect has failed');
        },
        disconnect: function(data) {
          gChatOpts.connected = false;
          log('you have been disconnected');
          disconnected(data);
        },

        handShake: function(evt, data) {
            console.log("evt", evt);
            this.socket.emit(evt, data);
        },

        addSystemMessage: function(msg) {
            console.log('Socket', msg);
        }
    };
    return chatSockConn;
})();
gChatSockConn = new chatSockConn('localhost:9191');

$(document).on('click','.push-click-open', function(){
  if ($('.push-chat-window').is(':hidden')) {
    $(".push-chat-window").css('display','block');
    $(".push-chat-window").animate({'right': 0},500);
    gChatOpts.rightSpace = 356;
    calculate_popups();
  } else {
    gChatOpts.rightSpace = 20;
    calculate_popups();
    $(".push-chat-window").animate({'right': '-340px'},500,function(){
      $(".push-chat-window").css('display','none');
    });
  }
});   
$(document).on('click', '.push-close', function(){
    $(".push-chat-window").animate({'right': '-340px'},500,function(){
      $(".push-chat-window").css('display','none');
    });
    gChatOpts.rightSpace = 20;
    calculate_popups();
 });

$(document).on('click', '.pop-min .fa', function(){
  if($(this).hasClass('fa-window-maximize')){
    $('.chat-popup').css('transform','translate3d(0px, 0px, 0px)');
  }else{
    $('.chat-popup').css('transform','translate3d(0px, 255px, 0px)');
  }
  $(this).toggleClass('fa-window-minimize fa-window-maximize');
 });

// Draw Popups
//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
  for(var iii = 0; iii < popups.length; iii++)
  {
    if(id == popups[iii])
    {
      Array.remove(popups, iii);
      
      document.getElementById(id).style.display = "none";
      
      calculate_popups();
      
      return;
    }
  } 
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
  var right = gChatOpts.rightSpace;
  
  var iii = 0;
  for(iii; iii < total_popups; iii++)
  {
    if(popups[iii] != undefined)
    {
      var element = document.getElementById(popups[iii]);
      element.style.right = right + "px";
      right = right + 320;
      element.style.transform= "translate3d(0px, 0, 0)";
      element.style.display = "block";
    }
  }
  
  for(var jjj = iii; jjj < popups.length; jjj++)
  {
    var element = document.getElementById(popups[jjj]);
    element.style.transform= "translate3d(0, 285px, 0)";
    element.style.display = "none";
  }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(uid, name)
{
  id = "ds_cw_"+uid;
  for(var iii = 0; iii < popups.length; iii++)
  { 
    //already registered. Bring it to front.
    if(id == popups[iii])
    {
      Array.remove(popups, iii);
    
      popups.unshift(id);
      
      calculate_popups();
      
      
      return;
    }
  }       
  
  var element = '<div class="popup-box chat-popup" id="'+ id +'">';
  element = element + '<div class="popup-head">';
  element = element + '<div class="popup-head-left">'+ name +'</div>';
  element = element + '<div class="popup-head-right"><span class="pop-min"><i class="fa fa-window-minimize " aria-hidden="true"></i></span><a class="fa fa-times" href="javascript:close_popup(\''+ id +'\');"></a></div>';
  element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div>';
  element = element + '<div class="popup-foot"><div class="typing"></div><input type="text" onkeyup="chatSendMessage(this, event)" placeholder="Send a Message" data-uid="'+uid+'" data-un="'+name+'"><span class="fl-link"><i class="fa fa-paper-plane"></i></span></div></div>';
  document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  

  popups.unshift(id);
      
  calculate_popups();
  
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
  var width = window.innerWidth;
  if(width < 540)
  {
    total_popups = 0;
  }
  else
  {
    width = width - gChatOpts.rightSpace;
    //320 is width of a single popup box
    total_popups = parseInt(width/320);
  }
  
  display_popups();
  
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);

// Prevents input from having injected markup
function cleanInput (input) {
  return $('<div/>').text(input).text();
}

function getRandomInt() {
    return Math.floor(Math.random() * (10000 - 10 + 1)) + 10;
}

// Keyboard events
function getName(ele, evt) {
  ele = $(ele);
  // Auto-focus the current input when a key is typed
  if (!(evt.ctrlKey || evt.metaKey || evt.altKey)) {
    ele.focus();
  }
  // When the client hits ENTER on their keyboard
  if (evt.which === 13) {
    if (ele.val()!='') {
      gUserId = getRandomInt();
      gUserName = ele.val();
      gChatSockConn.connectionOpen({frmsock:0});
      $('.push-get-name').fadeOut(300);
      $('.push-chat-open').fadeIn(300);
    }
  }
};

function connectionopened(data) {
    console.log("data", data);
  var userHtml = [];
  if(data.frmsock){
    $.each(data.users, function(uid,user) {
      if(uid != gUserId){
        userHtml.push('<li class="u-'+user.uid+'"><i class="fa fa-circle online pull-left"></i> <a  href="javascript:register_popup('+user.uid+', \''+user.un+'\');">'+user.un+'</a></li>');
      }
    });
    $('.cnct-list').html(userHtml.join(''));
  }
}

function disconnected(data) {
  $('.cnct-list li.u-'+data['uid']).remove();
}

// Keyboard events
function chatSendMessage(ele, evt) {
  ele = $(ele);
  var sockData,
  uid = ele.data('uid'),
  un=ele.data('un'),
  // Prevent markup from being injected into the message
  msg=cleanInput(ele.val());
  // Auto-focus the current input when a key is typed
  if (!(evt.ctrlKey || evt.metaKey || evt.altKey)) {
    ele.focus();
  }
  sockData = {toid:uid, tonm: un, frmsock:0};
  updateTyping (sockData);
  // When the client hits ENTER on their keyboard
  if (evt.which === 13) {
    if (uid>0) {
      // if there is a non-empty message and a socket connection
      if (msg && gChatOpts.connected) {
        ele.val('');
        // tell server to execute 'new message' and send along one parameter
        sockData['msg'] = msg;
        gChatSockConn.newmessage(sockData);
      }
      gChatSockConn.stoptyping(sockData);
      gChatOpts.typing = false;
    }
  }
};

// Adds the visual chat message to the message list
function addChatMessage (data) {
    console.log("data", data);
    var uid, unm, ele, cls;
    if(data.frmsock){
      uid = data['fmid'];
      unm = data['fmnm'];
      cls = 'u-one';
      if(gUserId == data['fmid']){
        uid = data['toid'];
        unm = data['tonm'];
        cls = 'u-two';
      }
        console.log("cls", cls);
      if($('#ds_cw_'+uid).length==0){
        register_popup(uid, unm);
      }
      ele = $('#ds_cw_'+uid+' .popup-messages');
      ele.append('<div class="msg '+cls+'"><div class="usr-img"><span>'+data['fmnm'].charAt(0)+'</span></div><div class="msg-txt"><p>'+data['msg']+'</p></div></div>').children(':last').hide().fadeIn(600);
      ele.animate({ scrollTop: ele[0].scrollHeight }, 1000);
    }else{
      uid = data['toid'];
      unm = data['fmnm'];
      ele = $('#ds_cw_'+uid+' .popup-messages');
      ele.append('<div class="msg u-two"><div class="usr-img"><span>'+unm.charAt(0)+'</span></div><div class="msg-txt"><p>'+data['msg']+'</p></div></div>').children(':last').hide().fadeIn(600);
      ele.animate({ scrollTop: ele[0].scrollHeight }, 1000);
    }
}

// Updates the typing event
function updateTyping (data) {
  if (gChatOpts.connected) {
    if (!gChatOpts.typing) {
      gChatOpts.typing = true;
      gChatSockConn.typing(data);
    }
    gChatOpts.lastTypingTime = (new Date()).getTime();

    setTimeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - gChatOpts.lastTypingTime;
      if (timeDiff >= gChatOpts.typingTimer && gChatOpts.typing) {
        gChatSockConn.stoptyping(data);
        gChatOpts.typing = false;
      }
    }, gChatOpts.typingTimer);
  }
}

// Adds the visual chat typing message
function chatTypingMsg (data) {
  var uid, unm, ele, div;
  if(data.frmsock){
    uid = data['fmid'];
    unm = data['fmnm'];
    ele = $('#ds_cw_'+uid+' .typing');
    if(data['type']){
      ele.fadeOut(300);
    }else{
      ele.html(data['fmnm']+' is typing <img src="/chat-typing.svg" />').fadeIn(300);
    }
  }
}
