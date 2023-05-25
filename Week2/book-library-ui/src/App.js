import { Route, Routes } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import Header from "./componenets/Header";
import Home from "./componenets/Home";
import Add from "./componenets/Add";
import "./App.css";

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add" element={<Add />}></Route>
        </Routes>
      </main>
    </MoralisProvider>
  );
}

export default App;
