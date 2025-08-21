import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { count, windowAction } from "../renderer";
import "./App.css";

function App() {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    count(number);
  }, [number]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setNumber((number) => number + 1)}>
          number is {number}
        </button>
        <br />
        <br />
        <button onClick={() => windowAction("maximize-window")}>
          Maximize
        </button>
        <br />
        <br />
        <button onClick={() => windowAction("minimize-window")}>
          Minimize
        </button>
        <br />
        <br />
        <button onClick={() => windowAction("close-window")}>Close App</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
