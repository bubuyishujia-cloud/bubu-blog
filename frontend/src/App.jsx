import { useState, useEffect } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import MainPage from './components/MainPage';
import LoginModal from './components/LoginModal';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }

    // 生成或获取昵称
    let savedNickname = localStorage.getItem('nickname');
    if (!savedNickname) {
      savedNickname = generateNickname();
      localStorage.setItem('nickname', savedNickname);
    }
    setNickname(savedNickname);
  }, []);

  const generateNickname = () => {
    const adjectives = ['可爱的', '快乐的', '温柔的', '活泼的', '甜美的', '优雅的', '神秘的', '梦幻的'];
    const nouns = ['小兔', '小猫', '小熊', '小鹿', '小狐', '小鸟', '小鱼', '小花'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adj + noun;
  };

  const handleNicknameChange = (newNickname) => {
    setNickname(newNickname);
    localStorage.setItem('nickname', newNickname);
  };

  const handleEnter = () => {
    setShowWelcome(false);
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem('token', newToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      {showWelcome ? (
        <WelcomePage onEnter={handleEnter} />
      ) : (
        <MainPage
          isLoggedIn={isLoggedIn}
          token={token}
          nickname={nickname}
          onNicknameChange={handleNicknameChange}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
        />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
