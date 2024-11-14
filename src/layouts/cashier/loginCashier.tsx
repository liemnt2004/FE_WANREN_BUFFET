import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

type LoginCashierProps = {
  onLoginSuccess: () => void;
};

type User = {
  username?: string;
  password?: string;
  userType?: string;
}



const LoginCashier: React.FC<LoginCashierProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/User/findByUsername`, {
        params: { username }
      });

      const matchedUser = response.data;




      if (matchedUser && matchedUser.password === password && matchedUser.roles[0].roleId === 3) {
        onLoginSuccess();
      } else {
        setError("Sai mật khẩu");
      }
    } catch (error) {
      setError("Không tìm thấy người dùng");
    }
  };

  return (
    <StyledWrapper>
      <div className="container d-flex justify-content-center h100vh align-items-center">
        <div className="card">
          <a className="login">Log in</a>
          <div className="inputBox">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required={true} />
            <span className="user">Username</span>
          </div>
          <div className="inputBox">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
            <span>Password</span>
          </div>
          <button className="enter" onClick={handleLogin}>Enter</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .h100vh {
    height: 100vh;
  }
  .login {
    color: #000;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    font-weight: bold;
    font-size: x-large;
  }

  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 350px;
    width: 300px;
    flex-direction: column;
    gap: 35px;
    background: #e3e3e3;
    box-shadow: 16px 16px 32px #c8c8c8,
          -16px -16px 32px #fefefe;
    border-radius: 8px;
  }

  .inputBox {
    position: relative;
    width: 250px;
  }

  .inputBox input {
    width: 100%;
    padding: 10px;
    outline: none;
    border: none;
    color: #000;
    font-size: 1em;
    background: transparent;
    border-left: 2px solid #000;
    border-bottom: 2px solid #000;
    transition: 0.1s;
    border-bottom-left-radius: 8px;
  }

  .inputBox span {
    margin-top: 5px;
    position: absolute;
    left: 0;
    transform: translateY(-4px);
    margin-left: 10px;
    padding: 10px;
    pointer-events: none;
    font-size: 12px;
    color: #000;
    text-transform: uppercase;
    transition: 0.5s;
    letter-spacing: 3px;
    border-radius: 8px;
  }

  .inputBox input:valid~span,
  .inputBox input:focus~span {
    transform: translateX(113px) translateY(-15px);
    font-size: 0.8em;
    padding: 5px 10px;
    background: #000;
    letter-spacing: 0.2em;
    color: #fff;
    border: 2px;
  }

  .inputBox input:valid,
  .inputBox input:focus {
    border: 2px solid #000;
    border-radius: 8px;
  }

  .enter {
    height: 45px;
    width: 100px;
    border-radius: 5px;
    border: 2px solid #000;
    cursor: pointer;
    background-color: transparent;
    transition: 0.5s;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 2px;
    margin-bottom: 1em;
  }

  .enter:hover {
    background-color: rgb(0, 0, 0);
    color: white;
  }`;

export default LoginCashier;
