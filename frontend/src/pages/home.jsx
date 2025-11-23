import React from "react";
import Navbar from "../components/navbar.jsx";
import Header from "../components/header.jsx";

const Home = () => {
    // Renders the landing layout with navigation and hero header on top of the branded background
    return (
        <div className='flex flex-col items-center justify-center min-h-screen
                        bg-[url("/bg_img.png")] bg-cover bg-center'>
           <Navbar/>
           <Header/>
        </div>
    )
}

export default Home;
