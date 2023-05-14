const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Library", function () {
  let libraryFactory, library, accounts, player;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    player = accounts[1];

    libraryFactory = await ethers.getContractFactory("Library");
    library = await libraryFactory.deploy();
    await library.deployed();
  });

  describe("addBook", function () {
    it("Should revert if not called by owner", async function () {
      await expect(
        library.connect(player).addBook("1984", "George Orwell", 5)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Successfully executes", async function () {
      await expect(library.addBook("1984", "George Orwell", 5))
        .to.emit(library, "BookAdded")
        .withArgs(0, "1984", "George Orwell", 5);

      const book = await library.books(0);
      assert.equal(book.id, 0);
      assert.equal(book.title, "1984");
      assert.equal(book.author, "George Orwell");
      assert.equal(book.copies, 5);
    });
  });

  describe("increaseCopies", function () {
    it("Should revert if not called by owner", async function () {
      await expect(
        library.connect(player).increaseCopies(0, 5)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if bookId is invalid", async function () {
      await expect(library.increaseCopies(0, 5)).to.be.revertedWithCustomError(
        library,
        "InvalidId"
      );
    });

    it("Successfully executes", async function () {
      await library.addBook("1984", "George Orwell", 5);
      await expect(library.increaseCopies(0, 5))
        .to.emit(library, "CopiesIncreased")
        .withArgs(0, 10);

      const book = await library.books(0);
      assert.equal(book.copies, 10);
    });
  });

  describe("borrowBook", function () {
    it("Should revert if bookId is invalid", async function () {
      await expect(library.borrowBook(0)).to.be.revertedWithCustomError(
        library,
        "InvalidId"
      );
    });

    it("Should revert if book is already borrowed", async function () {
      await library.addBook("1984", "George Orwell", 5);
      await library.borrowBook(0);

      await expect(library.borrowBook(0)).to.be.revertedWithCustomError(
        library,
        "BookAlreadyBorrowed"
      );
    });

    it("Should revert if book has 0 copies", async function () {
      await library.addBook("1984", "George Orwell", 0);

      await expect(library.borrowBook(0)).to.be.revertedWithCustomError(
        library,
        "InsufficientCopies"
      );
    });

    it("Successfully executes", async function () {
      await library.addBook("1984", "George Orwell", 5);

      await expect(library.borrowBook(0))
        .to.emit(library, "BookBorrowed")
        .withArgs(0, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "1984");

      const book = await library.books(0);
      assert.equal(book.copies, 4);

      const isBookBorrowed = await library.borrowedBooks(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        0
      );
      assert.equal(isBookBorrowed, true);

      const bookBorrower = await library.usersByBook(0, 0);
      assert.equal(bookBorrower, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });
  });

  describe("returnBook", function () {
    it("Should revert if bookId is invalid", async function () {
      await expect(library.returnBook(0)).to.be.revertedWithCustomError(
        library,
        "InvalidId"
      );
    });

    it("Should revert if user has not borrowed the book", async function () {
      await library.addBook("1984", "George Orwell", 5);

      await expect(library.returnBook(0)).to.be.revertedWithCustomError(
        library,
        "BookNotBorrowed"
      );
    });

    it("Successfully executes", async function () {
      await library.addBook("1984", "George Orwell", 5);
      await library.borrowBook(0);

      await expect(library.returnBook(0))
        .to.emit(library, "BookReturned")
        .withArgs(0, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "1984");

      const book = await library.books(0);
      assert.equal(book.copies, 5);

      const isBookBorrowed = await library.borrowedBooks(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        0
      );
      assert.equal(isBookBorrowed, false);
    });
  });
});
