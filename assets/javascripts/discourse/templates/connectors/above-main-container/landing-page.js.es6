import { withPluginApi } from "discourse/lib/plugin-api"

// Value are unique to each discourse instance
/***********/
const apiKey = '172d73af3122e6560fae33626f58130741877acfd1a9c8cfd9041a5ebc69fd9b'
const username = 'dturner';
const queryEnd = `?api_key=${apiKey}&api_username=${username}`

const apiKey1 = 'afea9cb58122c4ffc9d3d6bc7615cb51028d860c17c9d243bcf16a6dc9acfe75'
const username1 = 'aoifebrady';
const queryEnd1 = `?api_key=${apiKey1}&api_username=${username1}`

const nowOnId = 12
const comingUpId = 13

let year   = undefined;
let month  = undefined;
let day    = undefined;
let hour   = undefined;
let minute = undefined;
let second = undefined;
let newTime = false;
/***********/
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  if (t <= 0) {
    return {
      'total': 0,
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    };
  }
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    if (newTime) {
      endtime = new Date(year, month, day, hour, minute, second);
      newTime = false;
    }
    var t = getTimeRemaining(endtime);

    var dayValue = ('0' + t.days).slice(-2);
    daysSpan.innerHTML = dayValue;

    var hourValue = ('0' + t.hours).slice(-2);
    hoursSpan.innerHTML = hourValue

    var minuteValue = ('0' + t.minutes).slice(-2);
    minutesSpan.innerHTML = minuteValue;

    var secondValue = ('0' + t.seconds).slice(-2);
    secondsSpan.innerHTML = secondValue
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

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

function resolveTopic(topicData) {
  const body = topicData.post_stream.posts[0].cooked;
  let title = topicData.fancy_title;
  let startTime = ''
  let endTime = ''
  let urlLink = ''
  let category = ''
  let speakers = []
  let lines = body.split('<br>')
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
    }
  });
  let result = {}
  result.title = title;
  result.url = urlLink
  result.startTime = startTime
  result.endTime = endTime
  result.speakers = speakers
  result.category = category
  return result;
}

function updateLandingPage(component, eventId, eventLabel, qEnd) {
  /*
    * every page change you should check if the 'Now on' and 'Coming up' topics have been updated
    */
  // Get the Now On list and update the template
  fetch(`/c/${eventId}.json${qEnd}`)
  .then((res) => {
    return res.json();
  }).then((data) => {
    if (data && data.topic_list) {
      const topics = data.topic_list.topics;
      const topicArray = [];
      const topicPromiseArr = [];
      // for each topic (metadata) that is open in the topic_list get the actual topic text
      for (let i = 0; i < topics.length; i += 1) {
        // if the topic is open and isn't the default 'About the...' topic make a new request
        if (!(topics[i].title.startsWith('About the')) && topics[i].closed === false) {
          topicArray.push(topics[i]);
          const p1 = fetch(`/t/${topics[i].id}.json${qEnd}`);
          topicPromiseArr.push(p1);
        }
      }
      return Promise.all(topicPromiseArr).then((topicResponses) => {
        return Promise.all(topicResponses.map(singleTopicResponse => singleTopicResponse.json()))
      })
    } else {
      return [];
    }
  }).then((topicDataArray) => {
    // return topicDataArray.forEach(topicData => resolveTopic(topicData))
    const resultsData = topicDataArray.map(topicData => resolveTopic(topicData))
    return resultsData;
  }).then((finalTopicData) => {
    component.set(eventLabel, finalTopicData)
  }).catch((e) => {
    console.log('A "updateLandingPage()" error occurred: ');
    console.log(e);
  });
}

function initializePlugin(api, component) {
  component.set('showLandingPage', true)
  // Show or hide the landing page based on current url
  api.onPageChange((url, title) => {
    if (url == '/' || url == '/categories') {
      updateLandingPage(component, nowOnId, 'liveEvents', queryEnd)
      updateLandingPage(component, comingUpId, 'nextEvents', queryEnd1)
      component.set('showLandingPage', true)
      let deadline = new Date(Date.UTC(year || 2019, month || 2, day || 7, hour || 8, minute || 0, second || 0));
      setTimeout(function() {
        initializeClock('clockdiv', deadline);
      }, 500);
    } else {
      component.set('showLandingPage', false)
    }
  });

}

export default {
  setupComponent(args, component) {
    withPluginApi('0.8.8', api => initializePlugin(api, component, args))
  },
};
