import { Route, Routes } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import Header from "./componenets/Header";
import Main from "./componenets/Main";
import Add from "./componenets/Add";
import "./App.css";

function App() {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Header />

      <main>
        <Routes>
        <Route path="/" element={<Main />}></Route>
          <Route path="/add" element={<Add />}></Route>
        </Routes>
      </main>
    </MoralisProvider>
  );
}

export default App;
