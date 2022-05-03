import firebase from "./firebase";
import axios from 'axios';
import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
// to access our database, we must import the corresponding firebase modules
import { getDatabase, ref, onValue, push, remove } from 'firebase/database'


//3fd684dd
//da1f41a37b4009e916aee78562f757df



const App = () => {


  const [userInput, setUserInput] = useState('');
  const [entryList, setEntryList] = useState([]);
  const [userSubmit, setUserSubmit] = useState('');
  const [commonArray, setcommonArray] = useState({});
  const [nutritionData, setNutritionData] = useState([]);


  useEffect(() => {
    // console.log("userInput", userInput)
    // console.log("userSubmit", userSubmit)
    if (userSubmit !== ''){
      axios({
        headers: {
          "x-app-id": "95ab18c0",
          "x-app-key": "df053117dc540f359b77109f77c17c45",
        },
        url: `https://trackapi.nutritionix.com/v2/search/instant`,
        params: {
          query: userSubmit,
        },
      }).then(response => {
        const commonArray = response.data.common
        setcommonArray(commonArray)
        console.log("commonArray", commonArray)
        // console.log("commonarray", commonArray)
        return axios({
          headers: {
            "x-app-id": "95ab18c0",
            "x-app-key": "df053117dc540f359b77109f77c17c45",
          },
          method: "POST",
          url: `https://trackapi.nutritionix.com/v2/natural/nutrients`,
          data: {
            query: commonArray[0].food_name,
          },
        });
      })

        .then((response) => {
          // Set response to state with nutrients data
          const foodObject = response.data.foods
          setNutritionData(foodObject)
          console.log("nutritionData", nutritionData)
          saveItemToDatabase(foodObject)
          // console.log(foodObject)
          // console.log("nutrition data", nutritionData)
          // const database = getDatabase(firebase);
          // const dbRef = ref(database);

          // // // push the value of the `userInput` state to the database
          // push(dbRef, nutritionData);


          //   // reset the state to an empty string

        })
    }

  }, [userSubmit])

  useEffect

  const saveItemToDatabase = (item) => {
    // create a variable that holds our database details
    const database = getDatabase(firebase)

    // we then create a variable that makes reference to our database
    const dbRef = ref(database)

    const newObject = {
      photo: {
        thumb: item[0].photo.thumb
      },
      food_name: item[0].food_name, 
      nf_calories: item[0].nf_calories, 
      nf_total_carbohydrate: item[0].nf_total_carbohydrate,
      nf_protein: item[0].nf_protein,
      nf_dietary_fiber: item[0].nf_dietary_fiber,

    }

    push(dbRef, newObject)


    // add an event listener to that variable that will fire
    // from the database, and call that data 'response'.
    // onValue(dbRef, (response) => {
    //   // here we use Firebase's .val() method to parse our database info the way we want it
    //   console.log(response.val())
    //   const newState = [];

    //   // here we store the response from our query to Firebase inside of a variable called data.
    //   // .val() is a Firebase method that gets us the information we want
    //   const data = response.val();
    //   // console.log("data", data)
    //   // data is an object, so we iterate through it using a for in loop to access each list name 

    //   for (let key in data) {
    //     // newState.push(data[key]);
    //     console.log
    //   }
    //   console.log("newSTate", newState)

    //   // console.log("data", data)

    //   // then, we call setEntryList in order to update our component's state using the local array newState
    //   newState.reverse();
    //   setEntryList(newState);
    //   // console.log("entry list", entryList)
    // });
  }



  // // this event will fire every time there is a change in the input it is attached to
  const handleInputChange = (event) => {
    //   // we're telling React to update the state of our `App` component to be 
    //   // equal to whatever is currently the value of the input field

    //   //what we are typing in the search bar "every letter"
    setUserInput(event.target.value)

  }

  const handleSubmit = (event) => {
    // event.preventDefault prevents the default action (form submission and page refresh)
    event.preventDefault();

    //   //usersubmit = to the value of userinput after hitting submit
    setUserSubmit(userInput)
    // console.log("userInput", userInput)

    // create a reference to our database
    setUserInput('');
  }


  // // this function takes an argument, which is the ID of the list we want to remove
  const handleRemoveBook = (entryListId) => {
    //   // here we create a reference to the database 
    //   // this time though, instead of pointing at the whole database, we make our dbRef point to the specific node of the list we want to remove
    // const database = getDatabase(firebase);
    // const dbRef = ref(database, `/${entryListId}`);

    // //   // using the Firebase method remove(), we remove the node specific to the list ID
    // remove(dbRef)
  }
  // const { food_name, nf_calories, nf_total_carbohydrate, nf_protein, nf_dietary_fiber, serving_qty, serving_unit, photo } = nutritionData


  // console.log("entryList", entryList)

  return (
    <div className="app">
      <h1>Food List</h1>
      <div className="wrapper">
        {/* <h2>{food_name}</h2> */}
        {/* <div className="picture">
          <img src={photo.thumb} />
        </div> */}
        {/* <ul>
          <li>
            <p>{serving_unit} ({serving_qty})</p>
          </li>
          <li>
            <p>Calories: {nf_calories}</p>
          </li>
          <li>
            <p>Carbohydrates: {nf_total_carbohydrate}</p>
          </li>
          <li>
            <p>Protein: {nf_protein}</p>
          </li>
          <li>
            <p>Dietary Fiber: {nf_dietary_fiber}</p>
          </li>
        </ul> */}
        <ul>

          {nutritionData.map((food) => {
            return (
              <li key={commonArray[0].tag_id}>
                <img src={food.photo.thumb} />

                <p>{food.food_name}</p>
                <p>Calories: {food.nf_calories}</p>
                <p>Carbohydrates: {food.nf_total_carbohydrate}</p>
                <p>Protein: {food.nf_protein}</p>
                <p>Dietary Fiber: {food.nf_dietary_fiber}</p>

                <button onClick={() => handleRemoveBook(food.key)}> Remove </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* attach the `handleSubmit` function to our input form */}
      <form onSubmit={(e) => {handleSubmit(e)}}>
        <label htmlFor="newSearch"></label>
        <input
          type="text"
          id="newSearch"
          onChange={(e) => {handleInputChange(e)}}
          value={userInput}
        />

        <button>Add</button>
      </form>

    </div>
  );
};

export default App;