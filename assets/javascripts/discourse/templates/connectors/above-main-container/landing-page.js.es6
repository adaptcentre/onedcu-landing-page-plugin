import { withPluginApi } from "discourse/lib/plugin-api";

function prettyPrintTime(value) {
  let output = '';
  if(value < 10) {
    output += '0';
  }

  return output += value.toString();
}

function initClock(deadline, clockInterval, onDealineReachedCallback) {
  
  if(clockInterval !== null) {
    clearInterval(clockInterval);
  }

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

    //let's remove the days component (col) if the remaining days are 0
    if(remainig.days === 0) {
      $('#clock-main-days-col').css('display', 'none');
    } else {
      $('#clock-days-value').text( prettyPrintTime( remainig.days ) );
    }

    $('#clock-hours-value').text( prettyPrintTime( remainig.hours ) );
    $('#clock-minutes-value').text( prettyPrintTime( remainig.minutes ) );
    $('#clock-seconds-value').text( prettyPrintTime( remainig.seconds ) );

    if ( isOver(remainig) ) {
      clearInterval(clockInterval);
      onDealineReachedCallback();
    }
  }

  setTimeout( () => {
    clockInterval = setInterval(update, 1000);  
  }, 500);
}

function isCorrectUrl( url ) {

  if( url === '/' ) {
    return true;
  }

  return false;
}

function initSlideshow(slideshowInterval) {
  
  //https://css-tricks.com/snippets/jquery/simple-auto-playing-slideshow/
  if(slideshowInterval !== null) {
    return false;
  }

  let duration = 7000;

  $('#media-slideshow div:gt(0)').removeClass('no-display');
  $('#media-slideshow div:gt(0)').hide();
    
  slideshowInterval = setInterval( () => {
      
    if ( document.hasFocus() ) {
      // code to be run every 5 seconds, but only when tab is focused

      $('#media-slideshow > div:first')
        .fadeOut(1500)
        .next()
        .fadeIn(1500)
        .end()
        .appendTo('#media-slideshow');
    }
  }, duration );
}

function calculateSlideShowImageHeight() {
  let imgHeight = 0;

  $('#media-slideshow img').each( (index, value) => {
    let tempH = $(value).height();

    imgHeight = Math.max(tempH, imgHeight);
  });

  if(imgHeight === 0) {
    imgHeight = 350;
  }

  $('#media-slideshow').css('height', imgHeight + 'px');
}

function getEvents(eventId, qEnd) {

  let p = new Promise( (resolve, reject) => {

    fetch(`/c/${eventId}.json${qEnd}`)
    .then( (res) => {
      return res.json();
    })
    .then( (data) => {

      if(!data && !data.topics_list) {
        return null;
      }

      const topics = data.topic_list.topics;
      const asyncTasks = [];

      //this loop creates an array of tasks which will then be executed in a controlled manner
      for( let topic of topics ) {
        let title = topic.title;
        let isClosed = topic.closed;

        if( title.startsWith('About the') || isClosed ) {
          continue;
        }

        ((topic) => {

          asyncTasks.push( (callback) => {
          
            //console.log( 'Getting data for post:', topic.title );

            fetch(`/t/${topic.id}.json${qEnd}`)
            .then( (res) => {
              return res.json()
            })
            .then( (data) => {
              callback(null, data); 
            })
            .catch( (err) => {
              callback(err, null);
            });
          });
        })(topic);
      }

      return asyncTasks
    })
    .then( (tasks) => {

      let p = new Promise( (resolve, reject) => {
        async.series( tasks, (err, results) => {

          if(err) {
            console.log(err);
            reject(err);
          }

          resolve(results);
        });
      });

      return p;
    })
    .then( (allTopics) => {

      let output = allTopics.map( (topicData) => {
        return resolveTopic(topicData);
      })
      resolve(output);
    })
    .catch( (err) => {
      reject(err);
    });
  });

  return p;
} 

function resolveTopic(topicData) {
 
  const body = topicData.post_stream.posts[0].cooked;
  
  let title = topicData.fancy_title;
  
  /*
    Example title:
    A Distinctive NUI Galway - Our distinctive location

    Need to parse out first part

    so: "A Distinctive NUI Galway - Our distinctive location" turns into "Our distinctive location"
  */
  
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
  result.url = urlLink;
  result.startTime = startTime;
  result.endTime = endTime;
  result.speakers = speakers;
  result.category = category;
  result.bg_col = bg_col;
  
  return result;
}

function initializePlugin(api, component) {

  /*
    API key + user information
    --------------------------
    
    For the pulgin to function correctly, we need user api keys. These are created within the admin interface of the discourse app.
    Once created, they can be hard coded in the files /config/settings.yml. Or they can also be changed used the admin interface of the discourse app
  */

  let apiKey = null;
  let apiKeyUser = null;
  
  let comingUpCatId = null;
  let nowOnCatId = null;

  

  let queryEndpoint = null;
  let deadline = null;
  let isEnabled = null;
  let clockInterval = null;

  let slideshowInterval = null;

  $( window ).resize( () => {
    calculateSlideShowImageHeight();
  });

  api.onPageChange( (url, title) => {

    // need to call this incase any of the values have been changed in admin panel;
    setGlobalSettings(component);    

    if( !isEnabled || !isCorrectUrl( url ) ) {
      component.set('showLandingPage', false); 
      return null;
    }
    
    // lets show the whole component
    component.set('showLandingPage', true); 

    //lets init the slideshow
    $( document ).ready( () => {
      calculateSlideShowImageHeight();
      initSlideshow(slideshowInterval);
    });

    //lets check if we need to show the clock
    if( new Date() <= deadline ) {
      $( document ).ready( () => {
        $('#clock-main').removeClass('no-display');

        initClock( deadline, clockInterval ,() => {
          $('#clock-main').addClass('no-display');t
        });
      });
    }

    //first we need to show it.
    $( document ).ready( () => {
      $('#events-main').removeClass('no-display');
    });
    
    //now lets update the events - this is async so no need to wait until doc is ready
    getEvents(nowOnCatId, queryEndpoint)
    .then( (liveTopics) => {
      component.set('liveEvents', liveTopics);

      return getEvents(comingUpCatId, queryEndpoint);
    })
    .then( (commingUpTopics) => {
      component.set('nextEvents', commingUpTopics);
    });

  });

  
  function setGlobalSettings(component) {
    apiKey = component.siteSettings.onedcu_api_key;
    apiKeyUser = component.siteSettings.onedcu_user_api_key;

    queryEndpoint = `?api_key=${apiKey}&api_username=${apiKeyUser}`;
    
    nowOnCatId = component.siteSettings.onedcu_now_on_cat_id;
    comingUpCatId = component.siteSettings.onedcu_coming_up_cat_id;

    deadline = new Date( component.siteSettings.onedcu_deadline );

    isEnabled = component.siteSettings.onedcu_enabled;
  }
}




// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

export default {
  setupComponent(args, component) {
    withPluginApi('0.8.8', api => initializePlugin(api, component, args))
  },
};
