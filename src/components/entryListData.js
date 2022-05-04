import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import firebase from '../firebase';


const EntryListData = () => {


    const [entryList, setEntryList] = useState([]);

    useEffect(() => {
        const database = getDatabase(firebase)
        // we then create a variable that makes reference to our database
        const dbRef = ref(database)
        // add an event listener to that variable that will fire
        // from the database, and call that data 'response'.
        onValue(dbRef, (response) => {
            // here we use Firebase's .val() method to parse our database info the way we want it
            //creating an array to hold the .map unique Key and data
            const newState = [];
            const data = response.val();
            //loop to access each key and data
            for (let key in data) {
                newState.push({ key: key, name: data[key] });
            }
            // then, we call setEntryList in order to update our component's state using the local array newState
            setEntryList(newState);
        })
    }, [])


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
        <ul className="storedInfo">
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
        </ul>
    )
}

export default EntryListData;
