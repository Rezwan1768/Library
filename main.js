class Book {
    static #library = [];

    // It is valid to create instances wihin a static block, since a static block is
    // exceuted after the class has been defined
    static {
        // Create some initial books
        const book1 = new Book("To Kill A Mocking Bird", "Harper Lee", 336, true);
        const book2 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
        const book3 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
        const book4 = new Book("1984", "George Orwell", 328, true);
        const book5 = new Book("Moby Dick", "Herman Melville", 635, false);
        const book6 = new Book("On the Origin of Species", "Charles Darwin", 574, true);
        this.addBook(book1, book2, book3, book4, book5, book6);
    }

    static addBook(...books) {
        books.forEach(book => this.#library.push(book));
    }

    static removeBook(index) {
        this.#library.splice(index, 1);
    }

    static get library() {
        return this.#library;
    }

    #title;
    #author;
    #pages;
    #isBookRead;
    constructor(title, author, pages, isBookRead) {
        this.#title = title;
        this.#author = author;
        if(pages > 0) this.#pages = pages;
        this.#isBookRead = isBookRead;
    }

    getDetails() {
        return {
            title: this.#title,
            author: this.#author,
            pages: this.#pages,
            isBookRead: this.#isBookRead
        }
    }

    get isBookRead() { return this.#isBookRead; }
    toggleReadStatus() { this.#isBookRead = !this.#isBookRead; }
}

const library = (function () {
    const tableBody = document.querySelector("table tbody");
    const library = Book.library;

    function displayBooks() {
        library.forEach(book => {
            const bookEntry = createBookEntry(book);
            tableBody.appendChild(bookEntry);
        });
    }

    let index = 0;
    function createBookEntry(book) {
        const bookDetails = book.getDetails();
        const tableRow = document.createElement("tr");
        tableRow.dataset.entry = index;
        index++;
        tableRow.appendChild(createDeleteButton());
        for (let key in bookDetails) {
            const rowCell = createDataCell(key, bookDetails[key]);
            tableRow.appendChild(rowCell);
        }
        tableRow.appendChild(createToggleButton(book));
        return tableRow;
    }

    function createDataCell(key, value) {
        const dataCell = document.createElement("td");
        if (key === "isBookRead") {
            dataCell.classList.add("read-cell")
            dataCell.innerHTML = bookCompletionStatus(value, dataCell);
        } else {
            dataCell.textContent = value;
        }
        return dataCell;
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

    function createDeleteButton() {
        const cell = document.createElement("td");
        const deleteButton = document.createElement("button");
        cell.classList.add("transparent");
        deleteButton.classList.add("del-button");

        deleteButton.innerHTML = `
        <svg class="trashcan" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>Remove</title>
        <path
          d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
      </svg>`;

        deleteButton.addEventListener("click", deleteBook);
        cell.appendChild(deleteButton);

        return cell;
    }

    function deleteBook(event) {
        let bookEntryIndex = event.target.closest("tr").dataset.entry;
        Book.removeBook(bookEntryIndex);
        tableBody.innerHTML = '';
        index = 0;
        displayBooks();
    }

    function createToggleButton(book) {
        const cell = document.createElement("td");
        const toggleButton = document.createElement("button");

        toggleButton.innerHTML = bookCompletionStatus(!book.isBookRead, toggleButton);
        toggleButton.addEventListener("click", () => {
            book.toggleReadStatus();
            toggleButton.innerHTML = bookCompletionStatus(!book.isBookRead, toggleButton);

            const bookEntry = toggleButton.closest("[data-entry]")
            const bookReadCell = bookEntry.querySelector(".read-cell");
            bookReadCell.innerHTML = bookCompletionStatus(book.isBookRead, bookReadCell);
        });

        cell.appendChild(toggleButton);
        cell.classList.add("transparent");
        return cell;
    }

    displayBooks();
    return { createBookEntry };
})();


const modal = (function () {
    const form = document.querySelector("form");
    const formButton = document.querySelector('button.add-book');
    const modal = document.querySelector('dialog.modal');;

    formButton.addEventListener('click', () => modal.showModal());

    form.addEventListener("submit", getFormData);

    function getFormData(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = validateFormData(formData);
        const newBook = new Book(data.title, data.author, +data.pages,
            data["completion-status"]);
        Book.addBook(newBook);
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
        const bookEntry = library.createBookEntry(book);
        tableBody.appendChild(bookEntry);
    }

    const cancelButton = document.querySelector("button.cancel");
    cancelButton.addEventListener("click", () => modal.close());
})();