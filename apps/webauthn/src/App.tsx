import React from 'react';
import { useWebauthnRegister } from './hooks/useWebauthnRegister.ts';
import './App.css';

function App() {
  const [username, setUsername] = React.useState('');

  const { register } = useWebauthnRegister();

  const handleLogin = React.useCallback(async () => {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        rpId: window.location.hostname,
      } });

    console.log({ credential });
  }, []);

  const handleRegister = React.useCallback(async () => {
    const response = await register(username);
    console.log(response);
  }, [register, username]);

  return (
    <>
      <h1>Authenticate</h1>
      <div className="card">
        <input type="text" placeholder="Username" onChange={
          (event) => setUsername(event.target.value)
        } />
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1em'}}>
        <button onClick={handleRegister}>
          Register
        </button>
        <button onClick={handleLogin}>
          Login
        </button>
      </div>
      <div>
        <p>
          User interface example for webauthn authentication.
        </p>
      </div>
    </>
  );
}

export default App;
