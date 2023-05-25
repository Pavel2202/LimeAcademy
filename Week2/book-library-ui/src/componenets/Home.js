import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { address, abi } from "../constants";
import BookList from "./BookList";

export default function Home() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const libraryAddress = chainId in address ? address[chainId] : null;

  const [provider, setProvider] = useState({});
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, []);

  async function loadBooks(e) {
    e.preventDefault();
    const library = new ethers.Contract(
      libraryAddress,
      abi,
      provider.getSigner()
    );

    let tempBooks = []
    const booksCount = await library.functions.getBooksCount();

    for (let index = 0; index < booksCount; index++) {
      let tx = await library.functions.getBook(index);

      let book = {
        id: tx[0].id.toString(),
        title: tx[0].title,
        author: tx[0].author,
        copies: tx[0].copies.toString(),
      };
      tempBooks.push(book);
    }
    setBooks(tempBooks)

    e.target.hidden = true;
  }

  return (
    <>
      <button onClick={loadBooks}>Click to get all the books</button>
      <BookList books={books} />
    </>
  );
}
