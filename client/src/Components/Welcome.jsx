import { useNavigate } from "react-router-dom";


export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                background: "linear-gradient(to bottom, #fff 0%, #eae5ffff 100%)"
            }}
        >
            <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 pl-4 justify-center">
                    <img src='logo.svg' style={{height: '70px', marginRight: "15px"}} />
                    <div className="text-logo-purple font-extrabold text-6xl">ToothMate</div>
                    <div className="text-logo-dark-purple font-extrabold text-6xl">Pro</div>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="space-x-2 rounded btn mx-auto"
                    style={{
                        display: 'inline',
                        marginTop: '20px',
                        padding: '10px',
                        paddingInline: '25px',
                        borderRadius: '5px'
                    }}
                >
                    <span className="text-xl font-semibold px-3">Welcome ↪︎ </span>
                </button>
            </div>
        </div>
    )
}