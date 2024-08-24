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
const book6 = new Book("On the Origin of Species", "Charles Darwin", 574, true);

addBookToLibrary(book1, book2, book3, book4, book5, book6);
console.log(myLibrary);

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
        const rowCell = createDataCellFromBook(key, book[key]);
        tableRow.appendChild(rowCell);
    }
    return tableRow;
}

function createDataCellFromBook(key, value) {
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
    if (bool) {
        cell.classList.add("green-text");
        return "&#10004;";
    } else {
        cell.classList.add("red-text");
        return "&#10005;";
    }
}

displayBooks();

//----------------------------------Form-----------------------------------
const formButton = document.querySelector('button.add-book');

formButton.addEventListener('click', showForm);

function showForm() {
    const modal = document.querySelector('dialog.modal');
    modal.showModal();
}

//-------------------------Add form data to the table--------------------------
const form = document.querySelector("form");

form.addEventListener("submit", getFormData);

function getFormData(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = validateFormData(formData);
    const newBook = new Book(data.title, data.author, +data.pages,
         data["completion-status"]);
    addBookToLibrary(newBook);
    displayNewBook(newBook);
    event.target.reset();
}

function validateFormData(formData) {
    const data = {};
    formData.forEach((value, key) => {
        if(key === "completion-status") {
            data[key] = value === "read" ? true : false;
        } else {
            data[key] = value;
        }
        
    });
    return data;
}

function displayNewBook(book) {
    const tableBody = document.querySelector("table tbody");
    const bookEntry = createBookEntry(book);
    tableBody.appendChild(bookEntry);
}

const cancelButton = document.querySelector("button.cancel");
cancelButton.addEventListener("click", closeForm);
function closeForm() {
    const modal = document.querySelector('dialog.modal');
    modal.close();
}