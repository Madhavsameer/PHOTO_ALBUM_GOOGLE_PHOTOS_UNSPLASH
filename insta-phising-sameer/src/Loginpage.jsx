import React from 'react';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="phone-container">
        <img
          src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
          alt="Instagram Mobile Preview"
          className="phone-image"
        />
      </div>

      <div className="login-form-container">
        <div className="login-form">
          <h1>Instagram</h1>
          <form>
            <input type="text" placeholder="Phone number, username, or email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
            <div className="divider">
              <hr className="line" />
              <span>OR</span>
              <hr className="line" />
            </div>
            <button className="facebook-login">Log in with Facebook</button>
            <a href="/" className="forgot-password">Forgot password?</a>
          </form>
        </div>

        <div className="signup-container">
          <p>Don't have an account? <a href="/">Sign up</a></p>
        </div>

        <div className="get-app">
          <p>Get the app.</p>
          <div className="app-stores">
            <img
              src="https://www.instagram.com/static/images/appstore-btn.png/68a64e0c0f4e.png"
              alt="Download on the App Store"
            />
            <img
              src="https://www.instagram.com/static/images/playstore-btn.png/3cd8a35915f9.png"
              alt="Get it on Google Play"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
