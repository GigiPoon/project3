// import './App.css';
// import axios from 'axios';


// import { useEffect, useState } from 'react';

// //apple ID 3ab71f34
// //key a9702f60c91b02c4d5e4501e4dede988
// //x-remote-user-id 0
// function ApiCall() {

//     const [input, setUserInput] = useState([])

//     useEffect(() => {
//         axios({
//             headers: {
//                 "x-app-id": "3ab71f34",
//                 "x-app-key": "a9702f60c91b02c4d5e4501e4dede988",
//                 "Content-Type": "application/json",
//             },
//             method: "GET",
//             url: `https://trackapi.nutritionix.com/v2/search/instant`,
//             dataResponse: "json",
//             params: {
//                 query: "apple"
//             },
//         }).then(response => {
//             console.log(response.data.common[0])
//             setUserInput(response.data.common[0])
//             return axios({
//                 headers: {
//                     "Content-Type": "application/json",
//                     "x-app-id": "3ab71f34",
//                     "x-app-key": "a9702f60c91b02c4d5e4501e4dede988",
//                 },
//                 data: {
//                     query: response.data.common[0].food_name,
//                 },
//                 method: "POST",
//                 url: `https://trackapi.nutritionix.com/v2/natural/nutrients`,
//                 dataResponse: "json",
//             });
//         })
//             .then(response => {
//                 setUserInput(response)
//                 console.log(response)
//             })

//     }, [])

// }

// export default ApiCall;
