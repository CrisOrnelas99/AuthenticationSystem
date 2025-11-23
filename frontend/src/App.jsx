import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/home.jsx";
import VerifyEmail from "./pages/verifyEmail.jsx";
import Login from "./pages/login.jsx";
import ResetPass from "./pages/resetPass.jsx";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <div>
            <ToastContainer/>

            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/email-verify' element={<VerifyEmail/>}/>
                <Route path='/reset-password' element={<ResetPass/>}/>
            </Routes>
        </div>
    )
}
export default App;