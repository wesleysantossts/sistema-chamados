import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
// import "dotenv/config";

const firebaseConfig = {
  apiKey: "AIzaSyB0m68BJXMntuKJUa54XMRW2wdD4SJK_hU",
  authDomain: "sistema-70e6d.firebaseapp.com",
  projectId: "sistema-70e6d",
  storageBucket: "sistema-70e6d.appspot.com",
  messagingSenderId: "583416315127",
  appId: "1:583416315127:web:0a8163abf70f16809fa7f2",
  measurementId: "G-PY9F53T3R8"
};
  
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;