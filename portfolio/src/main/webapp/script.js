// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */

function Random() {
    var rnd = Math.floor(Math.random() * 20 + 1);
    document.getElementById('tb').value = rnd;
    document.getElementById('button').style.display='none';
    if(rnd > 11){
        document.getElementById('highRoller').style.display='block';
        document.getElementById('lowRoller').style.display='none';
    }
    else{
        document.getElementById('highRoller').style.display='none';
        document.getElementById('lowRoller').style.display='block';
    }
}
    
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

function welcomeMessage() {
  fetch('/welcome').then(response => response.text()).then((quote) => {
    document.getElementById('welcome').innerText = quote;
  });
}

async function getMessages() { 
  var url = '/data?max-comments=';
  url+=document.getElementById('max-comments').value;
  console.log(url);
  const response = await fetch(url);
  const comments = await response.json();
  console.log(comments); 
  const commentElement = document.getElementById('comment-container');
  while(commentElement.firstChild){
    commentElement.removeChild(commentElement.firstChild);
  }
  comments.forEach((comment) => {
    commentElement.appendChild(createCommentElement(comment));
    });
}

function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}


function createCommentElement(message) {
  const messageElement = document.createElement('li');
  messageElement.className = 'message';

  const titleElement = document.createElement('span');
  titleElement.innerText = message.message;
  
  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = 'Delete';
  deleteButtonElement.addEventListener('click', () => {
    deleteComment(message);

    // Remove the task from the DOM.
    messageElement.remove();
  });
 
  messageElement.appendChild(titleElement);
  messageElement.appendChild(deleteButtonElement);
  return messageElement;
}

function deleteComment(comment){
    const params = new URLSearchParams();
    params.append('id', comment.id); 
    fetch('/delete-comment', {method: 'POST', body: params});

}
