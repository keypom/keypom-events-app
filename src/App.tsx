import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://nearbuilders.org" target="_blank">
          <img
            src={
              "https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
            }
            className="logo"
            alt="Near Builders logo"
          />
        </a>
      </div>
      <h1>NEAR Builders</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the NEAR Builders logo to learn more
      </p>
    </>
  );
}

export default App;
