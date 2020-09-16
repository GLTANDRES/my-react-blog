import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCIpppyXOi3Mn72WNfVh2hYxiHVPuXeV3Q",
  authDomain: "socialape-58897.firebaseapp.com",
  databaseURL: "https://socialape-58897.firebaseio.com",
  projectId: "socialape-58897",
  storageBucket: "socialape-58897.appspot.com",
  messagingSenderId: "150954191262",
  appId: "1:150954191262:web:10517140e9776e7c7bce8f",
  measurementId: "G-JJVE3E690J",
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export default firebase;
