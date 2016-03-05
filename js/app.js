if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {

		if(reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}

		//If push notification is prompted
		if ("true") {
			// To check push is supported and enabled
			isPushNotification(reg);
		}
	}).catch(function(error) {
		// registration failed
		console.log('Registration failed with ' + error);
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise(function(resolve, reject) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve(`Direct message from SW: ${event.data}`);
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}
