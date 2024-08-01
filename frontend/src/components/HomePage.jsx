import React, { useState } from 'react';
import Navbar from './Navbar';
import Form from './Form';
import PasswordList from './PasswordList';

const HomePage = () =>{

    //shared state variables in Parent component 
    const [updatePasswordList, setUpdatePasswordList] = useState(false);
    
    // function to toggle updatePasswordList when submit is clicked on Form
    const toggle =()=>{
        setUpdatePasswordList(!updatePasswordList)
    }
    return(
        <>
            <Navbar/>
            <Form  toggle = {toggle}/>
            <PasswordList  toggleVariable = {updatePasswordList} />
        </>
    )
}

export default HomePage