const url = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = keys.jo;
use_youtubeAPI = false; //false will pull up a default set of video to conserve API KEY limit -- true will query actual YouTube API (100 queries per day per key)

//query parameters -- vanilla javascript but could do JQuery
const $searchBtn = document.getElementById('searchBtn');
const $container = document.querySelector('.container');


//This Bored API will produce a random activity based on as many parameters as desired
const callBoredAPI = function() {

  $container.innerHTML = "";

  fetch(`https://www.boredapi.com/api/activity`)
    .then(function (response) {
      return response.json();
  })
    .then(function (boredapi) {

    // Create a header with the activity
      const activityName = document.createElement('h1');
      activityName.textContent = 'Activity: ' + boredapi.activity;
      $container.appendChild(activityName);
    // Temporary text to understand details about the activity
      const info = document.createElement('p');
      info.textContent = 'boredapi: participants: ' + boredapi.participants + ' | ' + 'price: ' + boredapi.price + ' | ' + 'type: ' + boredapi.type + ' | ' + 'accessibility: ' + boredapi.accessibility;
      $container.appendChild(info);

        // helps determine whether to call youtube api or dummy api
      if (use_youtubeAPI) {
      callYoutubeAPI(boredapi);
      } else {
        dummyYoutube(boredapi);
      }


    })};

// Youtube API limited to 100 per day under same API key, searches exact text of bored API
const callYoutubeAPI = function(boredapi) {

  fetch(`${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(`${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`)


    showVideos(data);

    })};

// dummy object of data containing videos 
const dummyYoutube = function() {
      const data = {
        items: [
        {id: {videoId:'5iZltDLFOfo'}},
        {id: {videoId:'iC5dWobPSik'}},
        {id: {videoId:'AArJoXSxzrM'}},
        {id: {videoId:'PPG1-CqAghA'}},
        {id: {videoId:'ofVXzHwx6Fk'}},
        {id: {videoId:'kuY2nWj_EhA'}},
        {id: {videoId:'LGYEE4Jjpkc'}},
        {id: {videoId:'LAn0e2DOOnI'}},
        {id: {videoId:'ypEcwmvUgR8'}},
        {id: {videoId:'PznJqxon4zE'}}]};

        showVideos(data);
};
 
// show videos
const showVideos = function(data) {

    // create header Videos that may inspire you
      const inspireVideos = document.createElement('h2');
      inspireVideos.textContent = 'Videos that may inspire you';
      $container.appendChild(inspireVideos)

    //loop through videos and create an embeded video for each (currently 10)
      for (let i = 0; i < data.items.length; i++) {
        const $img = document.createElement('iframe');
        $img.setAttribute('src', `https://www.youtube.com/embed/${data.items[i].id.videoId}`)
        $container.appendChild($img);

      }
    };


     
$searchBtn.addEventListener('click', callBoredAPI);

