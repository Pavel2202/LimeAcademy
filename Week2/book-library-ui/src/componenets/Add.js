import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { address, abi } from "../constants";

export default function Main() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const libraryAddress = chainId in address ? address[chainId] : null;

  const [provider, setProvider] = useState({});

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  async function addBook(e) {
    e.preventDefault();

    const library = new ethers.Contract(
      libraryAddress,
      abi,
      provider.getSigner()
    );

    let formData = new FormData(e.target);

    let title = formData.get("title");
    let author = formData.get("author");
    let copies = formData.get("copies");

    await library.functions.addBook(title, author, copies);
  }

  return (
    <>
      <form onSubmit={addBook}>
        <div className="mb-6">
          <label className="inline text-gray-700 text-sm font-bold mb-2 mr-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-1/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></input>
        </div>
        <div className="mb-6">
          <label className="inline text-gray-700 text-sm font-bold mb-2 mr-2">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="w-1/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></input>
        </div>
        <div className="mb-6">
          <label className="inline text-gray-700 text-sm font-bold mb-2 mr-2">
            Copies
          </label>
          <input
            type="text"
            id="copies"
            name="copies"
            className="w-1/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></input>
        </div>
        <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
          Add
        </button>
      </form>
    </>
  );
}
