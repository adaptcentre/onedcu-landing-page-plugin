import { withPluginApi } from "discourse/lib/plugin-api";

function initClock(elementId, deadline) {
  
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

  
    $(elementId).text( remainig.toString() );

    if ( isOver(remainig) ) {
      clearInterval(timeinterval);
    }
  }

  setTimeout( () => {
    timeinterval = setInterval(update, 1000);  
  }, 500);
}


// ---- ---- ---- ---- ---- ---- ---- ----
// ---- ---- ---- ---- ---- ---- ---- ----

function initializePlugin(api, component) {

  component.set('showLandingPage', true);
  
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

    const deadline = new Date( component.siteSettings.onedcu_deadline );

    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

    if (url === '/' || url === '/categories') {
            
      component.set('showLandingPage', true);

      
      if( new Date() >= deadline ) {
      
        console.log('hiding countdown clock!');

      } else {
        console.log('showing countdown clock!');

        initClock( '#clock-remaining-input', deadline );

      }
      
    } else {
      component.set('showLandingPage', false);
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
