
import firebase from "./firebase";
import axios from 'axios';
import React from 'react';
import './App.css';

import { useEffect, useState } from 'react';
// to access our database, we must import the corresponding firebase modules
import { getDatabase, ref, onValue, push, remove } from 'firebase/database'

const App = () => {


  const [userInput, setUserInput] = useState('');
  const [entryList, setEntryList] = useState([]);
  const [userSubmit, setUserSubmit] = useState('');
  const [nutritionData, setNutritionData] = useState({});



  useEffect(() => {
    console.log("userInput", userInput)
    console.log("userSubmit", userSubmit)
    axios({
      headers: {
        "x-app-id": "3ab71f34",  
        "x-app-key": "a9702f60c91b02c4d5e4501e4dede988", 
        "Content-Type": "application/json",
      },
      url: `https://trackapi.nutritionix.com/v2/search/instant`,
      dataResponse: "json",
      params: {
        query: userSubmit,
      },
    }).then(response => {
      const commonArray = response.data.common[0]
      setUserInput(commonArray)
      console.log("commonarray", commonArray)
      return axios({
        headers: {
          "Content-Type": "application/json",
          "x-app-id": "3ab71f34", 
          "x-app-key": "a9702f60c91b02c4d5e4501e4dede988",
        },
        method: "POST",
        url: `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        dataResponse: "json",
        data: {
          query: commonArray.food_name,
        },
      });
    })
  
      .then((response) => {
        // Set response to state with nutrients data
        const foodObject = response.data.foods[0]
        setNutritionData(foodObject)
        console.log("foodObject", foodObject)

      })

  }, [userSubmit])



  useEffect(() => {
    // create a variable that holds our database details
    const database = getDatabase(firebase)

    // we then create a variable that makes reference to our database
    const dbRef = ref(database)

    // add an event listener to that variable that will fire
    // from the database, and call that data 'response'.
    onValue(dbRef, (response) => {
      // here we use Firebase's .val() method to parse our database info the way we want it

      const newState = [];

      // here we store the response from our query to Firebase inside of a variable called data.
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();

      // data is an object, so we iterate through it using a for in loop to access each list name 

      for (let key in data) {
        newState.push({ key: key, name: data[key], data: nutritionData});
      }

      console.log("data", data)

      // then, we call setEntryList in order to update our component's state using the local array newState
      newState.reverse();
      setEntryList(newState);
    });
  }, [nutritionData]);

  // this event will fire every time there is a change in the input it is attached to
  const handleInputChange = (event) => {
    // we're telling React to update the state of our `App` component to be 
    // equal to whatever is currently the value of the input field

    //what we are typing in the search bar "every letter"
    setUserInput(event.target.value)

  }

  const handleSubmit = (event) => {
    // event.preventDefault prevents the default action (form submission and page refresh)
    event.preventDefault();

    //usersubmit = to the value of userinput after hitting submit
    setUserSubmit(userInput)
    console.log("userInput", userInput)


    // create a reference to our database
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    // push the value of the `userInput` state to the database
    push(dbRef, nutritionData);
    

    // reset the state to an empty string
    setUserInput('');
  }


  // this function takes an argument, which is the ID of the list we want to remove
  const handleRemoveBook = (entryListId) => {
    // here we create a reference to the database 
    // this time though, instead of pointing at the whole database, we make our dbRef point to the specific node of the list we want to remove
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${entryListId}`);

    // using the Firebase method remove(), we remove the node specific to the list ID
    remove(dbRef)
  }

  return (
    <div className="app">
      <ul>
        {entryList.map((entryList) => {
          return (
            <li key={entryList.key}>

              <p>{entryList.name} - {entryList.key} - {entryList.data.food_name} </p>

              <button onClick={() => handleRemoveBook(entryList.key)}> Remove </button>
            </li>
          )
        })}
      </ul>
      {/* attach the `handleSubmit` function to our input form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="newSearch">What would you like to eat?</label>
        <input
          type="text"
          id="newSearch"
          onChange={handleInputChange}
          value={userInput}
          placeholder="apple"
        />

        <button>Add</button>
      </form>

    </div>
  );
};

export default App;