import { withPluginApi } from "discourse/lib/plugin-api";

function prettyPrintTime(value) {
  let output = '';
  if(value < 10) {
    output += '0';
  }

  return output += value.toString();
}

function initClock(deadline) {
  
  $('#clock-main').removeClass('no-display');

  let timeinterval = null;

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

    $('#clock-days-value').text( prettyPrintTime( remainig.days ) );
    $('#clock-hours-value').text( prettyPrintTime( remainig.hours ) );
    $('#clock-minutes-value').text( prettyPrintTime( remainig.minutes ) );
    $('#clock-seconds-value').text( prettyPrintTime( remainig.seconds ) );

    if ( isOver(remainig) ) {
      clearInterval(timeinterval);
      $('#clock-main').addClass('no-display');
    }
  }

  setTimeout( () => {
    timeinterval = setInterval(update, 1000);  
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

  let duration = 5000;

  $('#media-slideshow div:gt(0)').removeClass('no-display');
  $('#media-slideshow div:gt(0)').hide();
    
  slideshowInterval = setInterval( () => {
      
    if ( document.hasFocus() ) {
      // code to be run every 5 seconds, but only when tab is focused

      $('#media-slideshow > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#media-slideshow');
    }
  }, duration );
}

function calculateSlidehowImageHeight() {
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

function initializePlugin(api, component) {

  let slideshowInterval = null;

  api.onPageChange( (url, title) => {

    /*
      API key + user information
      --------------------------
      
      For the pulgin to function correctly, we need user api keys. These are created within the admin interface of the discourse app.
      Once created, they can be hard coded in the files /config/settings.yml. Or they can also be changed used the admin interface of the discourse app
    */

    const apiKey_1 = component.siteSettings.onedcu_api_key_1;
    const apiKeyUser_1 = component.siteSettings.onedcu_user_api_key_1;

    const apiKey_2 = component.siteSettings.nuig_api_key_2;
    const apiKeyUser_2 = component.siteSettings.onedcu_user_api_key_2;

    const nowOnId = component.siteSettings.onedcu_now_on_cat_id;
    const comingUpId = component.siteSettings.onedcu_comming_up_cat_id;

    const queryEndpoints = [
      `?api_key=${apiKey_1}&api_username=${apiKeyUser_1}`,
      `?api_key=${apiKey_2}&api_username=${apiKeyUser_2}`
    ];

    const deadline = new Date( component.siteSettings.onedcu_deadline );

    const isEnabled = component.siteSettings.onedcu_enabled || true;
    const correctUrl = isCorrectUrl( url );

    if( !isEnabled && !correctUrl ) {
      component.set('showLandingPage', false); 
      return null;
    }
    
    // lets show the component
    component.set('showLandingPage', true); 

    //lets init the slideshow
    $( document ).ready( () => {
      calculateSlidehowImageHeight();
      initSlideshow(slideshowInterval);
    });

    //lets check if we need to show the clock
    if( new Date() <= deadline ) {
      $( document ).ready( () => {
        initClock( deadline );
      });
    }
    

  });
  
}







// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

export default {
  setupComponent(args, component) {
    withPluginApi('0.8.8', api => initializePlugin(api, component, args))
  },
};
