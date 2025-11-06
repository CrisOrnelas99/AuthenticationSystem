import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/home.jsx";
import VerifyEmail from "./pages/verifyEmail.jsx";
import Login from "./pages/login.jsx";
import ResetPass from "./pages/resetPass.jsx";

const App = () => {
    return (
        <div >
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