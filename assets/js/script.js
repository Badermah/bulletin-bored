const url = 'https://www.googleapis.com/youtube/v3/search';
let API_KEY;
let use_youtubeAPI = confirm('Do you want to use API KEY?'); //false will pull up a default set of video to conserve API KEY limit -- true will query actual YouTube API (100 queries per day per key)
if (use_youtubeAPI) {API_KEY =  youTubeApiKeys[Math.floor(Math.random() * youTubeApiKeys.length)];};

//query parameters -- vanilla javascript but could do JQuery
const $searchBtn = document.getElementById('searchBtn');
const container = document.getElementById("container"); //modified by buck//
const container2 = document.getElementById("container2"); //modified by buck//
var carousel = document.querySelector(".carouselbox");
var next = carousel.querySelector(".next");
var prev = carousel.querySelector(".prev");
var index = 0;
var currentImage;
let data = {};
var submitOption = document.getElementById("submit-option");
var showValue = document.getElementById("user-form");
let buttonHist = JSON.parse(localStorage.getItem("searchHist"));
const searchButHist = document.getElementById("oldsearch");
const pinActivity = document.getElementById("pinActivity");
let boredActivity;
let carouselVideo;
let videoName;
let videoImage;

// Function to display selected value on screen
function handleSubmit(event) {
  let customURL = '?';
  let selectedOption = document.forms["user-form"].acttype.value;
  let selectedOption2 = document.forms["user-form"].people.value;
  let selectedOption3 = document.forms["user-form"].supdog.value;

  if (selectedOption !=='any') {
    customURL = customURL+ 'type='+ selectedOption;
  }

  if (selectedOption2 ==='solo') {
    customURL = customURL+ '&maxparticipants=1';
  } else if (selectedOption2 ==='group') {
    customURL = customURL+ '&minparticipants=2';
  }

  if (selectedOption3 ==='free') {
    customURL = customURL+ '&maxprice=0.09';
  } else if (selectedOption3 ==='paid') {
    customURL = customURL+ '&minprice=0.1';
  }


  callBoredAPI(customURL);

}
//This Bored API will produce a random activity based on as many parameters as desired
const callBoredAPI = function(customURL) {

  // container.innerHTML = "";
  

  fetch(`https://www.boredapi.com/api/activity${customURL}`)
    .then(function (response) {
      return response.json();
  })
    .then(function (boredapi) {

      if (boredapi.activity === undefined) {
        // const activityName = document.createElement('h1');
        resultsHeader.textContent = 'Try again, no activity found';
        // $container.appendChild(activityName);
        return;
      }

    // // Create a header with the activity
    //   const activityName = document.createElement('h1');
        boredActivity =  boredapi.activity;
        resultsHeader.textContent = 'Activity: ' + boredActivity;
    //   $container.appendChild(activityName);
    // // Temporary text to understand details about the activity
    //   const info = document.createElement('h2');
    //   info.textContent = 'boredapi: participants: ' + boredapi.participants + ' | ' + 'price: ' + boredapi.price + ' | ' + 'type: ' + boredapi.type + ' | ' + 'accessibility: ' + boredapi.accessibility;
    //   $container.appendChild(info);
    //     // helps determine whether to call youtube api or dummy api
    


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
    .then(function (newdata) {
      // console.log(`${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`)
      data = newdata;

    showVideos(data);


    })};

// dummy object of data containing videos 
const dummyYoutube = function() {
      data = {
        items: [
        {id: {videoId:'5iZltDLFOfo'},
         snippet: {title:'Placeholder 1'}},
        {id: {videoId:'iC5dWobPSik'},
        snippet: {title:'Placeholder 2'}},
        {id: {videoId:'AArJoXSxzrM'},
        snippet: {title:'Placeholder 3'}},
        {id: {videoId:'PPG1-CqAghA'},
        snippet: {title:'Placeholder 4'}},
        {id: {videoId:'ofVXzHwx6Fk'},
        snippet: {title:'Placeholder 5'}},
        {id: {videoId:'kuY2nWj_EhA'},
        snippet: {title:'Placeholder 6'}},
        {id: {videoId:'LGYEE4Jjpkc'},
        snippet: {title:'Placeholder 7'}},
        {id: {videoId:'LAn0e2DOOnI'},
        snippet: {title:'Placeholder 8'}},
        {id: {videoId:'ypEcwmvUgR8'},
        snippet: {title:'Placeholder 9'}},
        {id: {videoId:'PznJqxon4zE'},
        snippet: {title:'Placeholder 10'}},]};

        showVideos(data);
};
 
// show videos
const showVideos = function(data) {

    // // create header Videos that may inspire you
    //   const inspireVideos = document.createElement('h2');
    //   inspireVideos.textContent = 'Videos that may inspire you';
    //   container.appendChild(inspireVideos)

    //loop through videos and create an embeded video for each (currently 10)
    navigate(0);
    
    };
    
function navigate(direction) {
      index = index + direction;
      if (index < 0) { 
        index = data.items.length - 1;
      } else if (index > data.items.length - 1) { 
        index = 0;
      }
      currentImage = data.items[index];
      carouselVideo = document.querySelector(".videoNew");
      carouselVideo.setAttribute('src', `https://www.youtube.com/embed/${currentImage.id.videoId}`)
      videoName = currentImage.snippet.title;
      videoImage = currentImage.id.videoId;
      
    }
    
    carousel.addEventListener("click", function() {
      window.location.href = data[index];
    });
    
    next.addEventListener("click", function(event) {
      event.stopPropagation();
      navigate(1);
    });
    
    prev.addEventListener("click", function(event) {
      event.stopPropagation();
      navigate(-1);
    });
 

const renderSearch = function () {

      searchButHist.innerHTML='';
    
      if (buttonHist !== null) {
        buttonHist.forEach(function (item,i) {
          const pastActList = document.createElement('li');
          const pastActObj = document.createElement('a');
          pastActObj.textContent = `Activity: ${item[0]} | (Video: ${item[2]})`;
          pastActObj.setAttribute('href',`https://img.youtube.com/vi/${item[1]}/0.jpg`)
          pastActObj.setAttribute('target','_blank');

          pastActList.setAttribute("data-index", i);

          var button = document.createElement("button");
          button.textContent = "Remove ✔️";
          pastActList.appendChild(button);

          pastActList.appendChild(pastActObj);
          searchButHist.appendChild(pastActList);
          console.log(`https://img.youtube.com/vi/${item[1]}/0.jpg`)
          
        });
      } else {
        buttonHist = [];
      }
    };
renderSearch();


const keepMe = function () {
  buttonHist.unshift([boredActivity,videoImage,videoName]);
  storeSearch();
  renderSearch();
};


const storeSearch = function () {
  localStorage.setItem("searchHist", JSON.stringify(buttonHist))
};

searchButHist.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    buttonHist.splice(index, 1);

    storeSearch();
    renderSearch();
  }
});

$searchBtn.addEventListener('click', handleSubmit);
pinActivity.addEventListener('click', keepMe);

// Buck's code below here //

const welcome = document.getElementById("welcome");
const display = document.getElementById("display");
const pinned = document.getElementById("pinned");
const newActivity = document.getElementById("new");
const reset = document.getElementById("parameterReset");
const letsGooooo = document.getElementById("letsGooooo");
const resultsHeader = document.getElementById("resultsHeader")

let activityType = "";
let social = "";
let price = "";


  welcome.addEventListener("click", e => {
    $("#header").fadeOut(1000);
    setTimeout(() => {
      $("#newOrOld").fadeIn(1200).css("display", "flex");
    }, "1000");
  })

  newActivity.addEventListener("click", e => {
    $("#newOrOld").fadeOut(1000);
    setTimeout(() => {
      $("#activityType").fadeIn(1200).css("display", "flex");
    }, "1000");
  })

  pinned.addEventListener("click", e => {
    $("#newOrOld").fadeOut(1000);
    setTimeout(() => {
      display.classList.remove("display");
      display.classList.add("display2");
      $("#stashed").fadeIn(1200).css("display", "flex");
    }, "1500");
  })

  function activityTypeChoice(objButton1) {
    activityType = objButton1.value;
    console.log(activityType);
      $("#activityType").fadeOut(1000);
      setTimeout(() => {
        $("#soloOrGroup").fadeIn(1200).css("display", "flex");
      }, "1000");
  }
    
  function participants(objButton2) {
    social = objButton2.value;
    console.log(social);
    $("#soloOrGroup").fadeOut(1000);
    setTimeout(() => {
      $("#priceTag").fadeIn(1200).css("display", "flex");
    }, "1000");
  }

  function cost(objButton3) {
    price = objButton3.value;
    console.log(price);

    let actTypeString = "You're down for anything, ";
      if (activityType != "any") {
        actTypeString = "You'd like to do something " + activityType + " related, ";
      };

    let socialString = "";
      if (social === "solo") {
        socialString = "on your own, "
      }
      else if (social === "group") {
        socialString = "with a group, "
      };

    let priceString = "and cost isn't a huge concern?";
      if (price === "free") {
        priceString = "and we're looking for little to no upfront investment?"
      }

    $("#priceTag").fadeOut(1000);
    document.getElementById("summaryText").textContent = actTypeString + socialString + priceString;
    setTimeout(() => {
      $("#summary").fadeIn(1200).css("display", "flex");
    }, "1000");
  }

  reset.addEventListener("click", e => {

    activityType = "";
    social = "";
    price = "";

    $("#summary").fadeOut(1000);
    setTimeout(() => {
      $("#activityType").fadeIn(1200).css("display", "flex");
    }, "1000");
  })
  
letsGooooo.addEventListener("click", e => {
  let customURL = '?';
  let selectedOption = activityType;
  let selectedOption2 = social;
  let selectedOption3 = price;

  if (selectedOption !=='any') {
    customURL = customURL+ 'type='+ selectedOption;
  }

  if (selectedOption2 ==='solo') {
    customURL = customURL+ '&maxparticipants=1';
  } else if (selectedOption2 ==='group') {
    customURL = customURL+ '&minparticipants=2';
  }

  if (selectedOption3 ==='free') {
    customURL = customURL+ '&maxprice=0.09';
  } else if (selectedOption3 ==='paid') {
    customURL = customURL+ '&minprice=0.1';
  }

  $("#summary").fadeOut(1000);
  display.classList.remove("display");
  display.classList.add("display2");
  callBoredAPI(customURL);
  setTimeout(() => {
    $("#container").fadeIn(1200).css("display", "flex");
    $("#container2").fadeIn(1200).css("display", "flex");
  }, "1000");
})
