import { useState } from 'react';

const Form = ({errorState, setUserSubmit}) => {

    const [userInput, setUserInput] = useState('');

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

    return (
        <form onSubmit={(e) => {handleSubmit(e) }}>
            <label htmlFor="newSearch"></label>
            <input
                type="text"
                id="newSearch"
                onChange={(e) => {handleInputChange(e) }}
                value={userInput}
            />
            <button>Add</button>
            {errorState ? <p className='errP'>no data found</p> : null}
        </form>
    )
}

export default Form;
