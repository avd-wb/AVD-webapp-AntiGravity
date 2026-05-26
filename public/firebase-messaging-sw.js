importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB1IgFvznmhD8fajKMbts6Hfl0XErXQSM4",
  authDomain: "nimble-reserve-ws7sz.firebaseapp.com",
  projectId: "nimble-reserve-ws7sz",
  storageBucket: "nimble-reserve-ws7sz.firebasestorage.app",
  messagingSenderId: "1038907174254",
  appId: "1:1038907174254:web:0056dfe2cf8d4b22c4a57f"
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
