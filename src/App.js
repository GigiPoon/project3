import React from 'react';
//styles sheet
import './App.css';
//api call
import axios from 'axios';
// use effect and use state
import { useEffect, useState } from 'react';
// to access our database, we must import the corresponding firebase modules
import { getDatabase, ref, push } from 'firebase/database'
import firebase from "./firebase";
//components
import Form from "./components/Form";
import NutritionData from "./components/NutritionData";
import EntryListData from './components/EntryListData';

const App = () => {
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



  const saveItemToDatabase = (item) => {
    //item = foodObject (api response)
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
    //pushing the item into firebase with newObject
    push(dbRef, newObject)
  }

  return (
    <div className="app">
      <h1>Food List</h1>
      <NutritionData nutritionData={nutritionData} />
      <Form errorState={errorState} setUserSubmit={setUserSubmit}   />
      <EntryListData />

    </div>
  );
};

export default App;