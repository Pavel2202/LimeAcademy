import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { address, abi } from "../constants";

export default function BookCard({ book }) {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const libraryAddress = chainId in address ? address[chainId] : null;

  const [provider, setProvider] = useState({});

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  async function increaseCopies(e) {
    e.preventDefault();
    const library = new ethers.Contract(
      libraryAddress,
      abi,
      provider.getSigner()
    );

    await library.functions.increaseCopies(book.id, 1);
  }

  async function borrowBook(e) {
    e.preventDefault();
    const library = new ethers.Contract(
      libraryAddress,
      abi,
      provider.getSigner()
    );

    await library.functions.borrowBook(book.id);
  }

  async function returnBook(e) {
    e.preventDefault();
    const library = new ethers.Contract(
      libraryAddress,
      abi,
      provider.getSigner()
    );

    await library.functions.returnBook(book.id);
  }

  return (
    <>
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-center">{book.title}</div>
          <div className="text-xl mb-2 text-center">Author: {book.author}</div>
          <div className="text-xl mb-2 text-center">Copies {book.copies}</div>
          <div>
            <button
              onClick={increaseCopies}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Increase Copies
            </button>
            <button onClick={borrowBook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Borrow
            </button>
            <button onClick={returnBook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Return
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
