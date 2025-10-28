import { useState } from "react"
import Dashboard from "../Dashboard/Dashboard";
import Profile from "./Profile";

/**
 *  Login page for app.
 * Intended to be practice specific so this would show profiles of the people working there.
 * 
 * @author Skye Pooley
 */
export default function Login() {
    const [loggedin, setLoggedin] = useState(false);

    return (
        loggedin ?
        <Dashboard /> :

        <div
            className="flex items-center justify-center min-h-screen background-gradient"
        >
            <div className="flex items-center space-x-2 pr-8 justify-center">
                <img src='logo.svg' style={{height: '70px', marginRight: "15px"}} />
                <div>
                    <div className="flex">
                        <div className="text-logo-purple font-extrabold text-6xl">ToothMate</div>
                        <div className="text-logo-dark-purple font-extrabold text-6xl">Pro</div>
                    </div>
                    <div>
                        <span className="ml-2 font-bold">KidCare Dental</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <Profile name={"Alana Payne"} picture={"alana.jpeg"} setLoggedin={setLoggedin}z/>
            </div>
            
        </div>
    )
}