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
// limitations under the Licens

var map;
function initMap() {
  console.log("Map initialized");
  
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Columbia University</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Columbia University</b> is the university which I currently attend. ' +
      'Situated on the upper East side of Manhattan and directly in front of a  '+
      'subway station, it is located idealy close to and far from the center of '+
      'the city. Those wishing to explore can do so with ease, and those wishing '+
      'to stay far away from tons of people can do so as well. I thoroughly enjoy '+
      'my time on campus, spending a lot of time in my previous two dorms (John Jay '+
      'Hall and Wallach Hall), or in various libraries both on our main campus and  '+
      'Barnard\'s campus, just across the street. There\s also a wonderful halal cart '+
      'on 115 and broadway, along with good food on and off campus. </p>'+
      '</div>'+
      '</div>';


  var campus = { lat: 40.807612, lng: -73.962302} ;
  map = new google.maps.Map(document.getElementById("map"), {
    center: campus,
    zoom: 13,
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]

  });

  var marker = new google.maps.Marker({position: campus, map: map, title: 'Columbia University'});

    var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}

async function userLogin(){
  const response = await fetch('/login');
  console.log(response);
  const text = await response.text();
  var loginVal = text.toString().trim();
  console.log(loginVal);
  if (loginVal.localeCompare("true")==0){
    console.log("user is logged in");
    document.getElementById("classified").style.display='block';
    document.getElementById("general").style.display="none";

  }
  else if (loginVal.localeCompare("false")==0){
    console.log("user is not logged in");
    document.getElementById("classified").style.display='none';
    document.getElementById("general").style.display="block";
  }
  else{
    console.log("Something went wrong");
    console.log(loginVal);
    console.log(loginVal.localeCompare("true"));
  }
}

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
  userLogin();
  fetch('/welcome').then(response => response.text()).then((quote) => {
    document.getElementById('welcome').innerText = quote;
  });
}

async function getMessages() { 
  initMap();
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
