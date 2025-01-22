'use strict';

(function () {
  const STORAGE_KEY = 'BOOKSHELF_APP';
  const bookForm = document.getElementById('bookForm');
  const searchBookForm = document.getElementById('searchBook');
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  const getBooks = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const saveBooks = (books) => localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

  const createBookElement = ({ id, title, author, year, isComplete }) => {
    const bookContainer = document.createElement('div');
    bookContainer.setAttribute('data-bookid', id);
    bookContainer.setAttribute('data-testid', 'bookItem');
    bookContainer.innerHTML = `
      <h3 data-testid="bookItemTitle">${title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${author}</p>
      <p data-testid="bookItemYear">Tahun: ${year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${isComplete ? 'Belum selesai' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    const toggleButton = bookContainer.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const editButton = bookContainer.querySelector('[data-testid="bookItemEditButton"]');
    const deleteButton = bookContainer.querySelector('[data-testid="bookItemDeleteButton"]');

    toggleButton.addEventListener('click', () => toggleBookStatus(id));
    editButton.addEventListener('click', () => editBook(id));
    deleteButton.addEventListener('click', () => deleteBook(id));

    return bookContainer;
  };

  const renderBooks = (books) => {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  const addBook = (title, author, year, isComplete) => {
    const books = getBooks();
    const newBook = {
      id: Date.now(),
      title,
      author,
      year: parseInt(year, 10),
      isComplete,
    };
    books.push(newBook);
    saveBooks(books);
    renderBooks(books);
  };

  const toggleBookStatus = (id) => {
    const books = getBooks();
    const bookIndex = books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      books[bookIndex].isComplete = !books[bookIndex].isComplete;
      saveBooks(books);
      renderBooks(books);
    }
  };

  const deleteBook = (id) => {
    const books = getBooks();
    const filteredBooks = books.filter((book) => book.id !== id);
    saveBooks(filteredBooks);
    renderBooks(filteredBooks);
  };

  const editBook = (id) => {
    const books = getBooks();
    const book = books.find((book) => book.id === id);
    if (book) {
      const newTitle = prompt('Edit Judul:', book.title) || book.title;
      const newAuthor = prompt('Edit Penulis:', book.author) || book.author;
      const newYear = prompt('Edit Tahun:', book.year) || book.year;

      book.title = newTitle;
      book.author = newAuthor;
      book.year = parseInt(newYear, 10);

      saveBooks(books);
      renderBooks(books);
    }
  };

  const searchBooks = (query) => {
    const books = getBooks();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    renderBooks(filteredBooks);
  };

  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchBookTitle').value;
    searchBooks(query);
  });

  // Initialize app
  document.addEventListener('DOMContentLoaded', () => {
    renderBooks(getBooks());
  });
})();
