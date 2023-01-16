/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [themeType, setThemeType] = useState('light')
  const [username, setUsername] = useState()

  const syncTheme = new BroadcastChannel("theme");
  const syncLogin = new BroadcastChannel("login");

  const switchTheme = () => {
    if (themeType === 'light') {
      setThemeType('dark')
      syncTheme.postMessage('dark');
    } else {
      setThemeType('light')
      syncTheme.postMessage('light');
    }
  }

  const loggedIn = (state) => {
    if (state) {
      syncLogin.postMessage(true)
      setIsLoggedIn(true)
    } else {
      syncLogin.postMessage(false)
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    syncTheme.onmessage = channel => {
      console.log(channel)
      setThemeType(channel.data)
    }

    return () => {
      syncTheme.close()
    }
  }, [syncTheme, switchTheme])

  useEffect(() => {
    syncLogin.onmessage = channel => {
      console.log(channel)
      setIsLoggedIn(channel.data)
    }

    return () => {
      syncLogin.close()
    }
  }, [syncLogin, loggedIn])


  return (
    <>
      <div className={themeType === 'light' ? 'light-theme' : 'dark-theme'}>
        <h1>Welcome Sample Website</h1>
        {
          isLoggedIn ?
            <>
              <p>Hi <b>{username}</b>,</p>
              <p>You are logged in!</p>
              <p>Change Your Mode:
                {themeType === 'light' ?
                  <button className='p-5 m-5' onClick={() => switchTheme()}>
                    Switch Dark Mode
                  </button>
                  :
                  <button className='p-5 m-5' onClick={() => switchTheme()}>
                    Switch Light Mode
                  </button>
                }
              </p>
              <button className='p-5 m-5' onClick={() => loggedIn(false)}>Logout</button>
            </>

            :

            <>
              <label>
                <h4 className='m-5'>Login</h4>
                <input type='text' name='username' placeholder='Username' className='p-5' onChange={(e) => setUsername(e.target.value)} />
              </label>
              <button className='p-5 m-5' onClick={() => loggedIn(true)}>Login</button>
            </>
        }

      </div>
    </>
  );
}

export default App;
