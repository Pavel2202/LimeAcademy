const { ethers } = require("hardhat");
const { abi } = require("../artifacts/contracts/Library.sol/Library.json");

const libraryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let deployer, library;

async function addBook(title, author, copies) {
  const tx = await library.addBook(title, author, copies);
  await tx.wait();
  console.log(
    `Added ${title} by ${author} to the library with ${copies} copies.`
  );
}

async function increaseCopies(copies) {
  const tx = await library.increaseCopies(0, copies);
  await tx.wait();
  console.log(`Copies increase with ${copies}`);
}

async function borrowBook() {
  const tx = await library.borrowBook(0);
  await tx.wait();
  console.log(`Book borrowed`);
}

async function returnBook() {
  const tx = await library.returnBook(0);
  await tx.wait();
  console.log(`Book returned`);
}

async function main() {
  deployer = (await ethers.getSigners())[0];
  library = new ethers.Contract(libraryAddress, abi, deployer);

  await addBook("1984", "George Orwell", 5);
  await increaseCopies(5);
  await borrowBook();
  await returnBook();
}

module.exports = main();
