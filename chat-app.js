'use strict';
angular.module('chatApp', ['btford.socket-io'])
.controller('chatController', function($window,$scope,) {

  $window.onload = function () {
    socket.emit("history");
   };

  const socket = io.connect('http://localhost:3000');
  const chatController = this;

  chatController.typedInput = '';
  chatController.words = [];
  chatController.history = [];

  socket.on('history', payload => {
    chatController.history = [];
    chatController.history = payload;
    // $scope.test = payload;
    console.log('chatController', chatController.history);
  });


  console.log('initial state ', chatController.history);

  chatController.handleDelete = function (idx) {
    chatController.history.splice(idx,1);
    socket.emit("delete", chatController.history)
  }


  chatController.updateWords = function(inputWords) {
    chatController.words.push(inputWords);
    chatController.checkWordList();
    chatController.history.push(inputWords);
  }

  chatController.checkWordList = function() {
    while(chatController.words.length > 15) {
      chatController.words.shift();
    };
  }

  chatController.handleSubmit = function() {
    if(chatController.typedInput === ""){
      alert("Please enter a valid input!")
    }else {
      chatController.updateWords(chatController.typedInput);
      socket.emit('text', chatController.typedInput);
      chatController.typedInput = '';
    }
  };

});