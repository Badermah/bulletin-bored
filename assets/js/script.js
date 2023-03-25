
// This code cycles through a number apikeys for youtube search, this method allows for ~300 calls a day 
const url = "https://www.googleapis.com/youtube/v3/search";
let youTubeApiKeys = ["AIzaSyD2PmplJhcQf_D1kXvvqHwJW8MYPyhzdKg", "AIzaSyDSRVOnBgzTFsC6Z5pNddA4XFXFgIcT0lE", "AIzaSyBpza-PA_3AcF09iqQkA6Jgd2k0-jmRanc"];
const API_KEY = youTubeApiKeys[Math.floor(Math.random() * youTubeApiKeys.length)];
let use_youtubeAPI = true;

// Declaration of variables 
var carousel = document.querySelector(".carouselbox");
var next = carousel.querySelector(".next");
var prev = carousel.querySelector(".prev");
var index = 0;
var currentImage;
var submitOption = document.getElementById("submit-option");
var showValue = document.getElementById("user-form");

const $searchBtn = document.getElementById("searchBtn");
const container = document.getElementById("container"); 
const container2 = document.getElementById("container2");
const searchButHist = document.getElementById("oldsearch");
const pinActivity = document.getElementById("pinActivity");
const welcome = document.getElementById("welcome");
const display = document.getElementById("display");
const pinned = document.getElementById("pinned");
const newActivity = document.getElementById("new");
const reset = document.getElementById("parameterReset");
const letsGooooo = document.getElementById("letsGooooo");
const resultsHeader = document.getElementById("resultsHeader");
const home = document.getElementById("home");
const pinnedRedirect = document.getElementById("pinnedRedirect");

let data = {};
let activityType = "";
let social = "";
let price = "";
let boredActivity;
let carouselVideo;
let videoName;
let videoImage;
let buttonHist = JSON.parse(localStorage.getItem("searchHist"));

// This Bored API will produce a random activity based on as many parameters as desired
const callBoredAPI = function (customURL) {

  fetch(`https://www.boredapi.com/api/activity${customURL}`)
    .then(function (response) {
      return response.json();
    })

    .then(function (boredapi) {
      if (boredapi.activity === undefined) {
        resultsHeader.textContent = "Try again, no activity found";
        return;
      }

    boredActivity = boredapi.activity;
    resultsHeader.textContent = "Activity: " + boredActivity;

      if (use_youtubeAPI) {
        callYoutubeAPI(boredapi);
      } else {
        dummyYoutube(boredapi);
      }
    });
};

// Youtube API limited to 100 per day under same API key, searches exact text of bored API
const callYoutubeAPI = function (boredapi) {
  fetch(
    `${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (newdata) {
      data = newdata;
      showVideos(data);
    });
};

// dummy object of data containing videos. This was used during testing and is not utilized in live app. 
const dummyYoutube = function () {
  data = {
    items: [
      { id: { videoId: "5iZltDLFOfo" }, snippet: { title: "Placeholder 1" } },
      { id: { videoId: "iC5dWobPSik" }, snippet: { title: "Placeholder 2" } },
      { id: { videoId: "AArJoXSxzrM" }, snippet: { title: "Placeholder 3" } },
      { id: { videoId: "PPG1-CqAghA" }, snippet: { title: "Placeholder 4" } },
      { id: { videoId: "ofVXzHwx6Fk" }, snippet: { title: "Placeholder 5" } },
      { id: { videoId: "kuY2nWj_EhA" }, snippet: { title: "Placeholder 6" } },
      { id: { videoId: "LGYEE4Jjpkc" }, snippet: { title: "Placeholder 7" } },
      { id: { videoId: "LAn0e2DOOnI" }, snippet: { title: "Placeholder 8" } },
      { id: { videoId: "ypEcwmvUgR8" }, snippet: { title: "Placeholder 9" } },
      { id: { videoId: "PznJqxon4zE" }, snippet: { title: "Placeholder 10" } },
    ],
  };

  showVideos(data);
};


const showVideos = function (data) {
  navigate(0);
};

// This function loads our video carousel with the querried video data from the youtube api
function navigate(direction) {
  index = index + direction;
  if (index < 0) {
    index = data.items.length - 1;
  } else if (index > data.items.length - 1) {
    index = 0;
  }
  currentImage = data.items[index];
  carouselVideo = document.querySelector(".videoNew");
  carouselVideo.setAttribute(
    "src",
    `https://www.youtube.com/embed/${currentImage.id.videoId}`
  );
  videoName = currentImage.snippet.title;
  videoImage = currentImage.id.videoId;
}

// The next few functions add event listeners to button clicks on and below the video carousel to navigate the returned video options
carousel.addEventListener("click", function () {
  window.location.href = data[index];
});

next.addEventListener("click", (event) => {
  event.stopPropagation();
  navigate(1);
  pinActivity.classList.remove("saved-idea");
  pinActivity.classList.add("button5");
  pinActivity.textContent = "Pin Activity";
});

prev.addEventListener("click", function (event) {
  event.stopPropagation();
  navigate(-1);
  pinActivity.classList.remove("saved-idea");
  pinActivity.classList.add("button5");
  pinActivity.textContent = "Pin Activity";
});


// The renderSearch function creates and sets the attributes of the card elements that store saved activies 
const renderSearch = function () {
  searchButHist.innerHTML = "";

  if (buttonHist !== null) {
    buttonHist.forEach(function (item, i) {

      const pinnedDiv = document.createElement("div");
      pinnedDiv.setAttribute("class", "col cardSpacing");
      
      const pastActList = document.createElement("div");
      pastActList.setAttribute("class", "card cardSpacing card-sizing");
      pinnedDiv.appendChild(pastActList);
      
      searchButHist.appendChild(pastActList);
      const pastActImg = document.createElement("img");
      pastActImg.setAttribute("class", "card-img-top");
      pastActImg.setAttribute("alt", "YouTube Thumbnail");
      pastActImg.setAttribute("src", `https://img.youtube.com/vi/${item[1]}/0.jpg`);

      const anchor = document.createElement("a");
      anchor.setAttribute("href", `https://www.youtube.com/embed/${item[1]}`);
      anchor.appendChild(pastActImg);
      anchor.setAttribute("target", "_blank");
      pastActList.appendChild(anchor);

      const cardBody = document.createElement("div");
      cardBody.setAttribute("class", "card-body");
      cardBody.setAttribute("style", "color: black;");
      pastActList.appendChild(cardBody);

      const cardTitle = document.createElement("h5");
      cardTitle.setAttribute("class", "card-title");
      cardTitle.setAttribute("style", "color: black; text-shadow: none;");
      cardTitle.textContent = `Activity: ${item[0]}`;
      cardBody.appendChild(cardTitle);

      const cardText = document.createElement("p");
      cardText.setAttribute("class", "card-text");
      cardText.setAttribute("style", "color: black; text-shadow: none;");
      cardText.textContent = `Video: ${item[2]}`;
      cardBody.appendChild(cardText);

      const removeBtn = document.createElement("a");
      removeBtn.setAttribute("class", "btn btn-primary button");
      removeBtn.setAttribute("style", "text-shadow: none;");
      removeBtn.textContent = "Remove ✔️";
      cardBody.appendChild(removeBtn);
      pastActList.setAttribute("data-index", i);

    });
  } else {
    buttonHist = [];
  }
};

renderSearch();

// The next three functions work together to store activity searches locally, and call on local storage to retrieve saved activities
const keepMe = function () {
  buttonHist.unshift([boredActivity, videoImage, videoName]);
  storeSearch();
  renderSearch();
};

const storeSearch = function () {
  localStorage.setItem("searchHist", JSON.stringify(buttonHist));
};

searchButHist.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches(".button") === true) {
    var index = element.parentElement.parentElement.getAttribute("data-index");
    buttonHist.splice(index, 1);

    storeSearch();
    renderSearch();
  }
});

// This function calls the the keepMe function when the corresponding button is clicked and handles some button styling
pinActivity.addEventListener("click", (e) => {
  pinActivity.classList.remove("button5");
  pinActivity.classList.add("saved-idea");
  pinActivity.textContent = "Saved!";
  keepMe();
})

// This function makes the welcome screen disappear and the option to start a new search or go to pinned activites
welcome.addEventListener("click", (e) => {
  $("#header").fadeOut(1000);
  setTimeout(() => {
    $("#newOrOld").fadeIn(1000).css("display", "flex");
  }, "1000");
});

// This functon brings up the first menu of buttons when selecting a new activity
newActivity.addEventListener("click", (e) => {
  $("#newOrOld").fadeOut(1000);
  setTimeout(() => {
    $("#activityType").fadeIn(1000).css("display", "flex");
  }, "1000");
});

// This function brings up the pinned activities 
pinned.addEventListener("click", (e) => {
  $("#newOrOld").fadeOut(1000);
  setTimeout(() => {
    display.classList.remove("display");
    display.classList.add("display2");
    $("#stashed").fadeIn(1000).css("display", "flex");
  }, "1500");
});

// After selecting an activity theme this function brings up the next menu that lists participant options
function activityTypeChoice(objButton1) {
  activityType = objButton1.value;
  // console.log(activityType);
  $("#activityType").fadeOut(1000);
  setTimeout(() => {
    $("#soloOrGroup").fadeIn(1000).css("display", "flex");
  }, "1000");
}

// After selecting the number of participants this function brings up the menu for cost options
function participants(objButton2) {
  social = objButton2.value;
  // console.log(social);
  $("#soloOrGroup").fadeOut(1000);
  setTimeout(() => {
    $("#priceTag").fadeIn(1000).css("display", "flex");
  }, "1000");
}

// After selecting the cost option, this function builds a string based on the users selections and gives the use the option to continue with their search or start over
function cost(objButton3) {
  price = objButton3.value;
  // console.log(price);

  let actTypeString = "You're down for anything, ";
    if (activityType != "any") {
      actTypeString = "You'd like to do something " + activityType + " related, ";
    }

  let socialString = "";
    if (social === "solo") {
      socialString = "on your own, ";
    } else if (social === "group") {
      socialString = "with a group, ";
    }

  let priceString = "and cost isn't a huge concern?";
    if (price === "free") {
      priceString = "and we're looking for little to no upfront investment?";
    }

  $("#priceTag").fadeOut(1000);
  document.getElementById("summaryText").textContent = actTypeString + socialString + priceString;
  setTimeout(() => {
    $("#summary").fadeIn(1000).css("display", "flex");
  }, "1000");
}

// If the user elects to start over this function will take them back to the first menu where they can select a new activity theme
reset.addEventListener("click", (e) => {
  activityType = "";
  social = "";
  price = "";

  $("#summary").fadeOut(1000);
  setTimeout(() => {
    $("#activityType").fadeIn(1000).css("display", "flex");
  }, "1000");
});

// This button, located on the navbar, gives the user the option to return to the welcome screen from anywhere within the app
home.addEventListener("click", (e) => {
  activityType = "";
  social = "";
  price = "";

  $("#summary").fadeOut(1000);
  $("#activityType").fadeOut(1000);
  $("#priceTag").fadeOut(1000);
  $("#newOrOld").fadeOut(1000);
  $("#soloOrGroup").fadeOut(1000);
  $("#stashed").fadeOut(1000);
  $("#container").fadeOut(1000);
  $("#container2").fadeOut(1000);
  pinActivity.classList.remove("saved-idea");
  pinActivity.classList.add("button5");
  pinActivity.textContent = "Pin Activity";
  display.classList.add("display");
  display.classList.remove("display2");
  
  setTimeout(() => {
    $("#header").fadeIn(1000).css("display", "flex");
  }, "1000");
});

// This button, located on the navbar, gives the user the option to go to the pinned activites screen from anywhere within the app
pinnedRedirect.addEventListener("click", (e) => {
  activityType = "";
  social = "";
  price = "";

  $("#summary").fadeOut(1000);
  $("#activityType").fadeOut(1000);
  $("#priceTag").fadeOut(1000);
  $("#newOrOld").fadeOut(1000);
  $("#soloOrGroup").fadeOut(1000);
  $("#header").fadeOut(1000);
  $("#container").fadeOut(1000);
  $("#container2").fadeOut(1000);
  pinActivity.classList.remove("saved-idea");
  pinActivity.classList.add("button5");
  pinActivity.textContent = "Pin Activity";
  display.classList.remove("display");
  display.classList.add("display2");
  
  setTimeout(() => {
    $("#stashed").fadeIn(1000).css("display", "flex");
  }, "1000");
});

// If the user elects to go forward with their search this function builds a custom url based on their selected parameters to run through the bored api, and subsequently the youtube search api, and then brings the user to the results page
letsGooooo.addEventListener("click", (e) => {
  let customURL = "?";
  let selectedOption = activityType;
  let selectedOption2 = social;
  let selectedOption3 = price;

  if (selectedOption !== "any") {
    customURL = customURL + "type=" + selectedOption;
  }

  if (selectedOption2 === "solo") {
    customURL = customURL + "&maxparticipants=1";
  } else if (selectedOption2 === "group") {
    customURL = customURL + "&minparticipants=2";
  }

  if (selectedOption3 === "free") {
    customURL = customURL + "&maxprice=0.09";
  } else if (selectedOption3 === "paid") {
    customURL = customURL + "&minprice=0.1";
  }

  $("#summary").fadeOut(1000);
  display.classList.remove("display");
  display.classList.add("display2");
  callBoredAPI(customURL);
  setTimeout(() => {
    $("#container").fadeIn(1000).css("display", "flex");
    $("#container2").fadeIn(1000).css("display", "flex");
  }, "1000");
});
