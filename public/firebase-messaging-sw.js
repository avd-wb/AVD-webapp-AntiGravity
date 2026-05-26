importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCxsQ4SEAN5nDP7xuNxT3FKCHuFENJai6o",
  authDomain: "avd-wb-portal.firebaseapp.com",
  projectId: "avd-wb-portal",
  storageBucket: "avd-wb-portal.firebasestorage.app",
  messagingSenderId: "589128110508",
  appId: "1:589128110508:web:29af72a95cd6eaf1d0ea09"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/apple-touch-icon.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
