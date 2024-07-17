import "./App.css";
import { DynamicAuthProvider } from "./DynamicAuth";
import reactLogo from "./assets/react.svg";
import { Transact } from "./transaction/Transact";
import { useAuthContext } from "./useAuthContext";
import viteLogo from "/vite.svg";

const Connect = () => {
  const { authenticated, loginUser } = useAuthContext();

  if (authenticated) return <Transact />;

  return <button onClick={() => loginUser()}>Login</button>;
};

function App() {
  return (
    <DynamicAuthProvider>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Connect />
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </DynamicAuthProvider>
  );
}

export default App;
