const myLibrary = [];

function Book(title, author, pages, isBookRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isBookRead = isBookRead;
};

function addBookToLibrary(...books) {
    books.forEach(book => myLibrary.push(book));
}

// Have some initial Books
const book1 = new Book("To Kill A Mocking Bird", "Harper Lee", 336, true);
const book2 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
const book3 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
const book4 = new Book("1984", "George Orwell", 328, true);
const book5 = new Book("Moby Dick", "Herman Melville", 635, false);

addBookToLibrary(book1, book2, book3, book4, book5);
console.log(myLibrary);
myLibrary.forEach(book =>
    console.log(`${book.title}, ${book.author}, ${book.pages}, ${book.isBookRead}`)
);

//----------------------------Dispaly books--------------------------------

function displayBooks() {
    const tableBody = document.querySelector("table tbody");
    myLibrary.forEach(book => {
        const bookEntry = createBookEntry(book);
        tableBody.appendChild(bookEntry);
    });
}

// Creates a row entry for each book
function createBookEntry(book) {
    const tableRow = document.createElement("tr");

    for (let key in book) {
        const rowCell = createDataCell(key, book[key]);
        tableRow.appendChild(rowCell);
    }
    return tableRow;
}

function createDataCell(key, value) {
    const cellData = document.createElement("td");
    if (key === "isBookRead") {
        cellData.innerHTML = bookCompletionStatus(value, cellData);
        
    } else {
        cellData.textContent = value;
    }
    return cellData;
}

// I want to use check / corss mark to represnt wheater or not a book was read
function bookCompletionStatus(bool, cell) {
    if(bool) {
        cell.classList.add("green-text");
        return "&#10004;";
    } else {
        cell.classList.add("red-text");
        return "&#10005;";
    }
}





displayBooks();