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
let index = 0;
function createBookEntry(book) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-index", index)
    const deleteButtonCell = createDeleteButton();
    tableRow.appendChild(deleteButtonCell);

    for (let key in book) {

        const rowCell = createDataCellFromBook(key, book[key]);
        tableRow.appendChild(rowCell);
    }
    const toggleButtonCell = createToggleButton(book);
    tableRow.appendChild(toggleButtonCell);
    return tableRow;
}


// Create a delete button for each book
function createDeleteButton() {
    const cell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("del-button");
    
    index++;
    deleteButton.innerHTML = `
    <svg class="trashcan" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <title>Remove</title>
    <path
      d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
  </svg>`;

    deleteButton.addEventListener("click", deleteBook);
    cell.appendChild(deleteButton);
    cell.classList.add("transparent")
    return cell;
}

function deleteBook(event) {
    let bookIndex = event.target.closest("tr").getAttribute("data-index");
    myLibrary.splice(bookIndex, 1);
    document.querySelector('tbody').innerHTML = '';
    index = 0;
    displayBooks();
}

function createDataCellFromBook(key, value) {
    const cellData = document.createElement("td");
    if (key === "isBookRead") {
        cellData.classList.add("read-cell")
        cellData.innerHTML = bookCompletionStatus(value, cellData);
    } else {
        cellData.textContent = value;
    }
    return cellData;
}

// For the toggle button
function createToggleButton(book) {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    
    button.innerHTML = bookCompletionStatus(!book.isBookRead, button);
    button.addEventListener("click", () => {
        button.innerHTML = bookCompletionStatus(book.isBookRead, button);
        book.isBookRead = !book.isBookRead;
        const bookEntry = button.closest("[data-index]")
        const bookReadCell = bookEntry.querySelector(".read-cell");
        bookReadCell.innerHTML = bookCompletionStatus(book.isBookRead, bookReadCell);
    });

    cell.appendChild(button);
    cell.classList.add("transparent");
    return cell;
}


// I want to use check / corss mark to represnt wheater or not a book was read
function bookCompletionStatus(bool, element) {
    element.classList.remove("green-text", "red-text");
    if (bool) {
        element.classList.add("green-text");
        return "&#10004;";
    } else {
        element.classList.add("red-text");
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
        if (key === "completion-status") {
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