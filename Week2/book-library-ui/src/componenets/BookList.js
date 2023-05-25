import BookCard from "./BookCard";

export default function BookList({ books }) {
  return (
    <>
      {books.length > 0 ? (
        books.map((x) => <BookCard key={x.id} book={x} />)
      ) : (
        <div>
          <p>No books</p>
        </div>
      )}
    </>
  );
}
