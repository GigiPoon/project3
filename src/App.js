import firebase from "./firebase";
import axios from 'axios';
import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
// to access our database, we must import the corresponding firebase modules
import { getDatabase, ref, push } from 'firebase/database'
import EntryListData from "./components/EntryListData";

const App = () => {

  const [userInput, setUserInput] = useState('');
  // const [entryList, setEntryList] = useState([]);
  const [userSubmit, setUserSubmit] = useState('');
  const [nutritionData, setNutritionData] = useState([]);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    if (userSubmit !== ''){
      axios({
        headers: {
          "x-app-id": "8f7e1a0a",
          "x-app-key": "0bc92fd2b2bbd2ed314204494ce73a34",
        },
        url: `https://trackapi.nutritionix.com/v2/search/instant`,
        params: {
          query: userSubmit,
        },
      }).then(response => {
        const commonArray = response.data.common

      if (commonArray.length === 0) {
        throw Error ('no data found')
      }
        setErrorState(false)
        return axios({
          headers: {
            "x-app-id": "8f7e1a0a",
            "x-app-key": "0bc92fd2b2bbd2ed314204494ce73a34",
          },
          method: "POST",
          url: `https://trackapi.nutritionix.com/v2/natural/nutrients`,
          data: {
            query: commonArray[0].food_name,
          },
        });
      })
        .then((response) => {
          const foodObject = response.data.foods
          setNutritionData(foodObject)
          saveItemToDatabase(foodObject)
        })
        .catch((error) => {
          setErrorState(true)
        })
    }
  }, [userSubmit])

  // useEffect(() => {
  //   const database = getDatabase(firebase)
  //   // we then create a variable that makes reference to our database
  //   const dbRef = ref(database)
  //   // add an event listener to that variable that will fire
  //   // from the database, and call that data 'response'.
  //   onValue(dbRef, (response) => {
  //   //   // here we use Firebase's .val() method to parse our database info the way we want it
  //     const newState = [];
  //     const data = response.val();
  //     //loop to access each key and data
  //     for (let key in data) {
  //       newState.push({key: key, name: data[key]});
  //   }
  //   // then, we call setEntryList in order to update our component's state using the local array newState
  //   setEntryList(newState);
  //   })
  // }, [])

  const saveItemToDatabase = (item) => {
    // create a variable that holds our database details
    const database = getDatabase(firebase)
    // we then create a variable that makes reference to our database
    const dbRef = ref(database)

    //create a variable to hold all the data needed to be stored in firebase
    const newObject = {
      photo: {
        thumb: item[0].photo.thumb
      },
      food_name: item[0].food_name, 
      nf_calories: item[0].nf_calories, 
      nf_total_carbohydrate: item[0].nf_total_carbohydrate,
      nf_protein: item[0].nf_protein,
      nf_dietary_fiber: item[0].nf_dietary_fiber,
      serving_unit: item[0].serving_unit,
      tags: {
        tag_id: item[0].tags.tag_id
      }
    }
    push(dbRef, newObject)
  }

  // this event will fire every time there is a change in the input it is attached to
  const handleInputChange = (event) => {
  // we're telling React to update the state of our `App` component to be 
  // equal to whatever is currently the value of the input field
    setUserInput(event.target.value)
  }
  const handleSubmit = (event) => {
    // event.preventDefault prevents the default action (form submission and page refresh)
    event.preventDefault();
    //usersubmit = to the value of userinput after hitting submit
    setUserSubmit(userInput)
    // setUserInput back to nothing after submitting
    setUserInput('');
  }

  // // // this function takes an argument, which is the ID of the list we want to remove
  // const handleRemoveBook = (entryListId) => {
  //   // here we create a reference to the database 
  //   //   // this time though, instead of pointing at the whole database, we make our dbRef point to the specific node of the list we want to remove
  //   const database = getDatabase(firebase);
  //   const dbRef = ref(database, `/${entryListId}`);
  //   // using the Firebase method remove(), we remove the node specific to the list ID
  //   remove(dbRef)
  // }

  return (
    <div className="app">
      <h1>Food List</h1>
      <div className="wrapper">
        <ul className="menu">
          {nutritionData.map((food) => {
            return (
              <li key={food.tag_id}>
                <img 
                src={food.photo.thumb}
                alt={food.serving_unit}
                />
                <h2>{food.food_name}</h2>
                <p>Calories: {food.nf_calories}</p>
                <p>Carbohydrates: {food.nf_total_carbohydrate}</p>
                <p>Protein: {food.nf_protein}</p>
                <p>Dietary Fiber: {food.nf_dietary_fiber}</p>
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
        {errorState ? <p>no data found</p> : null}
      </form>
      {/* passed in a component of EntryListData */}
      <EntryListData />
      {/* <ul className="storedInfo">
        {entryList.map((food) => {
          return (
            <li key={food.key} className="storedList">
              <img 
              src={food.name.photo.thumb}
              alt={food.name.serving_unit} />
              <h2>{food.name.food_name}</h2>
              <p>Calories: {food.name.nf_calories}</p>
              <p>Carbohydrates: {food.name.nf_total_carbohydrate}</p>
              <p>Protein: {food.name.nf_protein}</p>
              <p>Dietary Fiber: {food.name.nf_dietary_fiber}</p>
              <button onClick={() => handleRemoveBook(food.key)} className="removeButton" > Remove </button>
            </li>
          )
        })}
      </ul> */}
    </div>
  );
};

export default App;