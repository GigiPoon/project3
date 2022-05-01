// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYl7iMJ4CW-QltZa2tCxW5rSFpjHtvygY",
    authDomain: "project3-545ca.firebaseapp.com",
    databaseURL: "https://project3-545ca-default-rtdb.firebaseio.com",
    projectId: "project3-545ca",
    storageBucket: "project3-545ca.appspot.com",
    messagingSenderId: "474075000696",
    appId: "1:474075000696:web:4459e6a0792e63776c628d"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);


export default firebase;