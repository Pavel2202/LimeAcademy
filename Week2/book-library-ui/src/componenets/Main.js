import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { address, abi } from "../constants";

export default function Main() {
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const libraryAddress = chainId in address ? address[chainId] : null;

  const { runContractFunction: getBook } = useWeb3Contract({
    abi: abi,
    contractAddress: libraryAddress,
    functionName: "getBook",
    params: { _id: "0" },
  });

  const {
    runContractFunction: addBook,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: libraryAddress,
    functionName: "addBook",
    params: { title: "Test", author: "Test", copies: "3" },
  });

  const { runContractFunction: increaseCopies } = useWeb3Contract({
    abi: abi,
    contractAddress: libraryAddress,
    functionName: "increaseCopies",
    params: { _id: "1", newCopies: "2" },
  });

  const { runContractFunction: borrowBook } = useWeb3Contract({
    abi: abi,
    contractAddress: libraryAddress,
    functionName: "borrowBook",
    params: { _id: "1" },
  });

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async () => {
          await addBook({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error),
          });
        }}
        disabled={isLoading || isFetching}
      >
        {isLoading || isFetching ? (
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          "Add"
        )}
      </button>
      <button
        onClick={async () => {
          await increaseCopies();
        }}
      >
        Increase
      </button>
      <button
        onClick={async () => {
          await borrowBook();
        }}
      >
        Borrow
      </button>
      <button
        onClick={async () => {
          let tx = await getBook();
          console.log(tx);
          console.log(tx.author);
        }}
      >
        get
      </button>
    </div>
  );
}
