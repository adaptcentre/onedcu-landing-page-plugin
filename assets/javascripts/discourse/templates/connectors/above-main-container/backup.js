import { withPluginApi } from "discourse/lib/plugin-api";
import Ember from 'ember';

// ---- ---- ---- ---- ---- ---- ---- ----
let slideshowInterval = null;

/*
function getTimeRemaining(endtime) {
  
  let t = Date.parse(endtime) - Date.parse( new Date() );
  
  if (t <= 0) {
    return {
      'total': 0,
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    };
  }
    
  return {
    'total': t,
    'days': Math.floor(t / (1000 * 60 * 60 * 24)),
    'hours': Math.floor((t / (1000 * 60 * 60)) % 24),
    'minutes': Math.floor((t / 1000 / 60) % 60),
    'seconds': Math.floor((t / 1000) % 60)
  };
}
*/

/*
function initializeClock(id, endtime) {
  
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    
    let timeRemaining = getTimeRemaining(endtime);

    let dayValue = ('0' + timeRemaining.days).slice(-2);
    daysSpan.innerHTML = dayValue;

    let hourValue = ('0' + timeRemaining.hours).slice(-2);
    hoursSpan.innerHTML = hourValue;

    let minuteValue = ('0' + timeRemaining.minutes).slice(-2);
    minutesSpan.innerHTML = minuteValue;

    let secondValue = ('0' + timeRemaining.seconds).slice(-2);
    secondsSpan.innerHTML = secondValue;

    if (dayValue == '01') {
      daysSpan.nextElementSibling.innerHTML = "Day";
    } else if (dayValue == '00'){
      var div = document.querySelector("#clockdiv > div:nth-child(1)");
      if (div && div != null) {      
        div.style.display = "none";
      }
    } else {
      daysSpan.nextElementSibling.innerHTML = "Days";
    }
    if (hourValue == '01') {
      hoursSpan.nextElementSibling.innerHTML = "Hour";
    } else {
      hoursSpan.nextElementSibling.innerHTML = "Hours";
    }
    if (minuteValue == '01') {
      minutesSpan.nextElementSibling.innerHTML = "Minute"
    } else {
      minutesSpan.nextElementSibling.innerHTML = "Minutes"
    }
    if (secondValue == '01') {
      secondsSpan.nextElementSibling.innerHTML = "Second"
    } else {
      secondsSpan.nextElementSibling.innerHTML = "Seconds"
    }

    if (timeRemaining.total <= 0) {
      clearInterval(timeinterval);
      hideClockShowEvents();
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}
*/

/*
function resolveTopic(topicData) {
  
  const body = topicData.post_stream.posts[0].cooked;
  
  let title = topicData.fancy_title;
  */
  /*
    Example title:
    A Distinctive NUI Galway - Our distinctive location

    Need to parse out first part

    so: "A Distinctive NUI Galway - Our distinctive location" turns into "Our distinctive location"

  */
  /*
  let tempIndex = title.indexOf('-');

  if(tempIndex > 0) {
    title = title.substring( tempIndex + 2 ); // +2 because there is a whitespace + - 
  }
  
  let startTime = '';
  let endTime = '';
  let urlLink = '';
  let category = '';
  let speakers = [];
  let bg_col = '';
  let lines = body.split('<br>');

  lines.forEach((text) => {
    let line = text
    line = line.replace('<p>', '')
    line = line.replace('</p>', '')
    line = line.trim();

    if (line.startsWith('Actual URL==' || line.startsWith('URL==') || line.startsWith('url=='))) {
      urlLink = line.split('==')[1].trim();
    } else if (line.startsWith('Start Time==') || line.startsWith('start time==')) {
      startTime = line.split('==')[1].trim()
    } else if (line.startsWith('End Time==') || line.startsWith('end time==')) {
      endTime = line.split('==')[1].trim()
    } else if (line.startsWith('Category==') || line.startsWith('category==')) {
      category = line.split('==')[1].trim()
    } else if (line.startsWith('Speakers==') || line.startsWith('speakers==')) {
      speakers = line.split('==')[1].trim().split(',')
      if (speakers.length === 1 && speakers[0] === '') {
        speakers = []
      }
    } else if (line.startsWith('Cat-bg==') || line.startsWith('Cat-bg==')) {
      bg_col = line.split('==')[1].trim()
    }
  });


  let result = {};

  result.title = title;
  result.url = urlLink
  result.startTime = startTime
  result.endTime = endTime
  result.speakers = speakers
  result.category = category
  result.bg_col = bg_col;
  
  return result;
}
*/

/*
function updateLandingPage(component, eventId, eventLabel, qEnd) {
  /*
  *   every page change you should check if the 'Now on' and 'Coming up' topics have been updated
  */

  // Get the Now On list and update the template

  /*
  fetch(`/c/${eventId}.json${qEnd}`)
  .then( (res) => {
    return res.json();
  })
  .then((data) => {
    
    if (data && data.topic_list) {
      
      const topics = data.topic_list.topics;
      const topicArray = [];
      const topicPromiseArr = [];

      let tempSeries = [];
      // for each topic (metadata) that is open in the topic_list get the actual topic text
      for (let i = 0; i < topics.length; i += 1) {
        // if the topic is open and isn't the default 'About the...' topic make a new request
        if ( !(topics[i].title.startsWith('About the')) && topics[i].closed === false ) {
          topicArray.push(topics[i]);
          
          const p1 = fetch(`/t/${topics[i].id}.json${qEnd}`);
  
          topicPromiseArr.push(p1);
        }
      }

      return Promise.all(topicPromiseArr).then((topicResponses) => {
        return Promise.all( topicResponses.map( singleTopicResponse => singleTopicResponse.json() ) );
      })
    } else {
      return [];
    }
  })
  .then((topicDataArray) => {
    // return topicDataArray.forEach(topicData => resolveTopic(topicData))
    const resultsData = topicDataArray.map(topicData => resolveTopic(topicData))
    return resultsData;
  })
  .then((finalTopicData) => {
    component.set(eventLabel, finalTopicData)
  })
  .catch( (e) => {
    console.log('A "updateLandingPage()" error occurred: ');
    console.log(e);
  });
}
*/

functionInitClock(elementId, deadline) {

  
  function isOver(remainig) {
    if( remainig.days <= 0 && remainig.hours <= 0 && remainig.minutes <= 0 && remainig.seconds <= 0 ) {
      return true;
    }

    return false;
  }

  function update() {
    let remainig = moment().countdown(
      deadline, 
      countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, 
      NaN,
      0
    );

    console.log( remainig.toString() );

    if ( isOver(remainig) ) {
      clearInterval(timeinterval);
    }
  }

  let timeinterval = setInterval(update, 1000);

}


// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

function initializePlugin(api, component) {

  // ----------------------------------------------------

  component.set('showLandingPage', true);
  
  // Show or hide the landing page based on current url
  api.onPageChange( (url, title) => {

   /*
      API key + user information
      --------------------------
      
      For the pulgin to function correctly, we need user api keys. These are created within the admin interface of the discourse app.
      Once created, they can be hard coded in the files /config/settings.yml. Or they can also be changed used the admin interface of the discourse app
    */

    const apiKey_1 = component.siteSettings.nuig_api_key_1;
    const apiKeyUser_1 = component.siteSettings.nuig_user_api_key_1;

    const apiKey_2 = component.siteSettings.nuig_api_key_2;
    const apiKeyUser_2 = component.siteSettings.nuig_user_api_key_2;

    const nowOnId = component.siteSettings.nuig_now_on_cat_id;
    const comingUpId = component.siteSettings.nuig_comming_up_cat_id;

    const queryEndpoints = [
      `?api_key=${apiKey_1}&api_username=${apiKeyUser_1}`,
      `?api_key=${apiKey_2}&api_username=${apiKeyUser_2}`
    ];

    const deadline = new Date(component.siteSettings.onedcu_deadline);

    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    if (url === '/' || url === '/categories') {
      
      //const endpointLive = queryEndpoints[ Math.floor( Math.random() * queryEndpoints.length ) ];
      //const endpointNext = queryEndpoints[ Math.floor( Math.random() * queryEndpoints.length ) ];

      //updateLandingPage(component, nowOnId, 'liveEvents', endpointLive);
      //updateLandingPage(component, comingUpId, 'nextEvents', endpointNext);
      
      component.set('showLandingPage', true);

      //do we need to show the countdown clock?
      if( new Date() >= deadline ) {
        // no we do not need to show it
        console.log('hiding countdown clock!');

        // give DOM time to load
        //setTimeout(function() {
          //hideClockShowEvents();
          //initializeClock('clockdiv', deadline);
        //}, 500);
      } else {
        console.log('showing countdown clock!');

        initClock( 'clock-remaining-input', deadline );

        //setTimeout(function() {
        //  initializeClock('clockdiv', deadline);
        //}, 500);
      }
      
      //need to calulate slideshow height
      //setTimeout(function() {
      //  calcImgHeight();
      //}, 500);
    } else {
      component.set('showLandingPage', false);
    }
  });

  //start slideshow
  //need to wait for DOM to load
  //setTimeout( function() {
  //  startSlideshow();
  //}, 500);
  
}


/*
function startSlideshow() {
  //https://css-tricks.com/snippets/jquery/simple-auto-playing-slideshow/
  if(slideshowInterval === null) {
    let duration = 5000;

    $('#custom-slideshow div:gt(0)').removeClass('no-display');
    $('#custom-slideshow div:gt(0)').hide();
    
    setInterval(function() {
      
      if ( document.hasFocus() ) {
        // code to be run every 7 seconds, but only when tab is focused

        $('#custom-slideshow > div:first')
          .fadeOut(1000)
          .next()
          .fadeIn(1000)
          .end()
          .appendTo('#custom-slideshow');
      }
    }, duration );
  }
}
*/

// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

// Code for img slider -> to calculate correct height and init slider

/*
$( window ).resize( () => {
  calcImgHeight();
});
$( document ).ready( () => {
  calcImgHeight();
});

function calcImgHeight() {
  let imgHeight = 0;

  $('#custom-slideshow img').each( (index, value) => {
    let tempH = $(value).height();

    imgHeight = Math.max(tempH, imgHeight);
  });

  if(imgHeight === 0) {
    imgHeight = 350;
  }

  $('#custom-slideshow').css('height', imgHeight + 'px');
}
*/

// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

export default {
  setupComponent(args, component) {
    withPluginApi('0.8.8', api => initializePlugin(api, component, args))
  },
};
