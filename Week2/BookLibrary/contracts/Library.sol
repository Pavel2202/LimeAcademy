//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

error InvalidId();
error InsufficientCopies();
error BookAlreadyBorrowed();
error BookNotBorrowed();

contract Library is Ownable {
    Book[] public books;
    mapping(uint256 => address[]) public usersByBook;
    mapping(address => mapping(uint256 => bool)) public borrowedBooks;

    struct Book {
        uint256 id;
        string title;
        string author;
        uint256 copies;
    }

    event BookAdded(uint256 indexed id, string title, string author, uint256 copies);
    event CopiesIncreased(uint256 indexed id, uint256 copies);
    event BookBorrowed(uint256 indexed id, address indexed borrower, string title);
    event BookReturned(uint256 indexed id, address indexed returned, string title);

    modifier validateId(uint256 _id) {
        if (_id >= books.length) {
            revert InvalidId();
        }
        _;
    }

    modifier checkIfBookIsBorrowed(uint256 _id) {
        if (borrowedBooks[msg.sender][_id]) {
            revert BookAlreadyBorrowed();
        }
        _;
    }

    modifier checkIfUserBorrowedBook(uint256 _id) {
        if (!borrowedBooks[msg.sender][_id]) {
            revert BookNotBorrowed();
        }
        _;
    }

    function addBook(string memory title, string memory author, uint256 copies) external onlyOwner {
        uint256 id = books.length;
        books.push(Book(id, title, author, copies));
        emit BookAdded(id, title, author, copies);
    }

    function increaseCopies(uint256 _id, uint256 newCopies) external onlyOwner validateId(_id) {
        Book storage book = books[_id];
        book.copies += newCopies;
        emit CopiesIncreased(_id, book.copies);
    }

    function borrowBook(uint256 _id) external validateId(_id) checkIfBookIsBorrowed(_id) {
        Book storage book = books[_id];

        if (book.copies == 0) {
            revert InsufficientCopies();
        }

        book.copies--;
        borrowedBooks[msg.sender][book.id] = true; 
        usersByBook[book.id].push(msg.sender);
        emit BookBorrowed(_id, msg.sender, book.title);
    }

    function returnBook(uint256 _id) external validateId(_id) checkIfUserBorrowedBook(_id) {
        Book storage book = books[_id];
        book.copies++;
        borrowedBooks[msg.sender][book.id] = false; 
        emit BookReturned(_id, msg.sender, book.title);
    }
}