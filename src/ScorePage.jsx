import { useLocation, useNavigate } from "react-router-dom";
import BgMusic from '/jazzyfrenchy.mp3';

const ScorePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const score = location.state?.score ?? 0;

    const handlePlayAgain = () => {
        navigate("/game");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
        >
            <div
                style={{
                    background: "rgba(255,255,255,0.9)",
                    padding: "40px 60px",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.5rem",
                        color: "#4f3c8d",
                        marginBottom: "20px",
                        letterSpacing: "2px",
                    }}
                >
                    Your Score
                </h1>
                <div
                    style={{
                        fontSize: "4rem",
                        fontWeight: "bold",
                        color: "#667eea",
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "pop 0.7s cubic-bezier(.68,-0.55,.27,1.55)",
                        marginBottom: "32px",
                    }}
                >
                    {score} 🦟
                </div>
                <button
                    onClick={handlePlayAgain}
                    style={{
                        padding: "12px 32px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#fff",
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.17)",
                        cursor: "pointer",
                        transition: "transform 0.1s, box-shadow 0.1s",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(31, 38, 135, 0.27)";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(31, 38, 135, 0.17)";
                    }}
                >
                    Play Again
                </button>
                <audio src={BgMusic} autoPlay loop controls={false} hidden />
            </div>
            <style>{`
                @keyframes pop {
                    0% { transform: scale(0.7); opacity: 0.5; }
                    70% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ScorePage;
