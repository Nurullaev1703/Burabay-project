importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZXLSBkE51MH_mWhbNT3LdkMvK79qsGD4",
  authDomain: "burabay-4ca6e.firebaseapp.com",
  projectId: "burabay-4ca6e",
  storageBucket: "burabay-4ca6e.firebasestorage.app",
  messagingSenderId: "137677890221",
  appId: "1:137677890221:web:a88195eb9d471205351c24",
  measurementId: "G-7WL9N59WV1"
});

const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
  if (event.data) {
    const payload = event.data.json();
    
    if (payload.data) {
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        badge: payload.data.icon,
        requireInteraction: true,
        data: { url: payload.data.click_action },
      };

      event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
    }
  }
});
