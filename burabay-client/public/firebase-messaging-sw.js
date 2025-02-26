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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});