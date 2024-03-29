import React from 'react';
import { useWebauthnRegister } from './hooks/useWebauthnRegister.ts';
import './App.css';

function App() {
  const { register } = useWebauthnRegister({
    username: 'alice',
  });

  const handleLogin = React.useCallback(async () => {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        rpId: window.location.hostname,
      } });

    console.log({ credential });
  }, []);

  const handleRegister = React.useCallback(async () => {
    const response = await register();
    console.log(response);
  }, [register]);

  return (
    <>
      <h1>Authenticate</h1>
      <div className="card">
        <input type="text" placeholder="Username" />
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
