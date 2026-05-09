import './WelcomePage.css';
import backgroundImg from '../assets/background.jpg';

function WelcomePage({ onEnter }) {
  return (
    <div className="welcome-page" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="welcome-content">
        <h1 className="welcome-title">欢迎光临</h1>
        <p className="welcome-subtitle">布布的家</p>
        <button className="enter-button" onClick={onEnter}>
          进入
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
