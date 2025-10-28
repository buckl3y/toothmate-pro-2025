import PropTypes from "prop-types";
import { useState } from "react";

/**
 * Profile to show on login page.
 * Includes fake password verification to demonstrate intent for full app
 * and hopefully prevent random internet users from accessing the app.
 * 
 * @author Skye Pooley
 */
export default function Profile({name, picture, setLoggedin}) {
    const fakePassword = "TillyBean1015!"; //yes, I know. shut up.
    const backupPassword = "0dontOgenesis";
    const [hover, setHover] = useState(false);
    const [showLogin, setShowLogin] = useState(false)
    const [passwordFieldContent, setPasswordFieldContent] = useState("");
    const [showPasswordWarning, setShowPasswordWarning] = useState(false);

    const frostedStyle = {
        margin: '40px',
        padding: '20px',
        background: 'rgba(238, 238, 238, 0.25)',
        borderRadius: '5%',
        boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.20)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        width: "280px"
    };

    const frostedHoverStyle = {
        ...frostedStyle,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    };

    const tryLogin = () => {
        if (passwordFieldContent === fakePassword || passwordFieldContent === backupPassword) {
            setPasswordFieldContent("");
            setShowPasswordWarning(false);
            setTimeout(() => setLoggedin(true), 500);
        }
        else {
            setPasswordFieldContent("");
            setShowPasswordWarning(true)
        }
    }

    return (
        <div
            style={hover ? frostedHoverStyle : frostedStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <img
                src={"assets/avatar/" + picture}
                style={{ borderRadius: "50%", margin: 'auto', width: '220px' }}
                onClick={() => setShowLogin(!showLogin)}
            />
            <h4 className="text-center text-bold text-2xl">{name}</h4>

            {showLogin &&
            <>
            <div>
                <input 
                    autoFocus={true}
                    type="password" 
                    style={{borderColor: '#AAA', borderWidth: '1px', borderStyle: 'inset'}}
                    placeholder="Password..."
                    onKeyDown={e => {
                        if (e.key === "Enter") tryLogin();
                    }}
                    value={passwordFieldContent}
                    onChange={e => setPasswordFieldContent(e.target.value)}
                />
                <button className="btn" onClick={() => tryLogin()}>↩︎</button>
            </div>
            {showPasswordWarning && <span style={{color: 'red'}}>Password Incorrect.</span>}
            </>}
        </div>
    );
}

Profile.propTypes = {
    name: PropTypes.string,
    picture: PropTypes.string,
    setLoggedin: PropTypes.func,
    focused: PropTypes.bool
}