var checkRemotePermission = function (permissionData) {
  document.getElementById('log').innerHTML += '<br>checkRemotePermission, ' + JSON.stringify(permissionData);
  if (permissionData.permission === 'default') {
      // This is a new web service URL and its validity is unknown.
      window.safari.pushNotification.requestPermission(
        'https://localhost:3000', // The web service URL.
        'web.com.leocode.login',     // The Website Push ID.
        {
          mySecretUserToken: 'qwdqwdqwdwefwefwe'
        }, // Data that you choose to send to your server to help you identify the user.
        checkRemotePermission         // The callback function.
      );
  }
  else if (permissionData.permission === 'denied') {
    // The user said no.
  }
  else if (permissionData.permission === 'granted') {
    // The web service URL is a valid push provider, and the user said yes.
    // permissionData.deviceToken is now available to use.
    document.getElementById('log').innerHTML += '<br>permission granted, sending push in 1 second';
    setTimeout(function() {
      // Dispatch message sending after one second, so you can hide the browser
      fetch('/push', 
        {
          method: 'post',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            "title": "ROAR!",
            "message": "Message from the Lion",
            "token": permissionData.deviceToken
          })
        }
      ).then(function (response) {
        response.json().then( function(result) { 
          document.getElementById('log').innerHTML += `<br>${ response.status == 200 ? 'success' : 'error' }: ${result.message}`;
        });
      });
    }, 1000);
    
  }
};

// Initialize only in Safari, only on desktop (iOS `pushNotification` doesn't exist)
if ('safari' in window && 'pushNotification' in window.safari) {
  var permissionData = window.safari.pushNotification.permission('web.com.leocode.login');
  checkRemotePermission(permissionData);
} else {
  document.getElementById('log').innerHTML += '<br>safari.pushNotification not supported';
}