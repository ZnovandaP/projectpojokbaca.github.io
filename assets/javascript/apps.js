const booksData = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-event";
const STORAGE_KEY = "MY_BOOKSHELF";

// fungsi memeriksa local storage pada browser
function checkWebStorage() {
	if (typeof Storage === undefined) {
		alert("Broeser yang anda gunakan tidak mendukung fitur web storage");
		return false;
	}
	return true;
}

// fungsi untuk menyimpan data ke local storage
function saveDataBook() {
	if (checkWebStorage()) {
		const parsedToStrings = JSON.stringify(booksData);
		localStorage.setItem(STORAGE_KEY, parsedToStrings);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

// fungsi memuat data dari local storage yang akan ditampilkan pada UI
function loadDataFromLocalStorage() {
	const getSavingData = localStorage.getItem(STORAGE_KEY);

	let data = JSON.parse(getSavingData);

	if (data !== null) {
		for (const bookSaving of data) {
			booksData.push(bookSaving);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

// function membuat id unik
generatedId = () => {
	return +new Date();
};

// function membuat object (spesifikasi/data buku)
generateObjectBookData = (id, title, author, year, genre, cover, isCompleted) => {
	return {
		id,
		title,
		author,
		year,
		genre,
		cover,
		isCompleted,
	};
};

addDataBooks = () => {
	const id = generatedId();
	const title = document.getElementById("inputTitleBook").value;
	const author = document.getElementById("inputAuthor").value;
	const year = document.getElementById("inputBookYear").value;
	const genre = document.getElementById("inputBookGenre").value;
	const cover = document.getElementById("inputCoverBook").value;
	const isCompleted = document.getElementById("inputBookIsComplete").checked;

	const bookObject = generateObjectBookData(id, title, author, year, genre, cover, isCompleted);
	booksData.push(bookObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBook();
};

makeBookshelf = (objectBookData) => {
	const { id, title, author, year, genre, cover, isCompleted } = objectBookData;

	// membuat element untuk cover buku
	const coverBook = document.createElement("img");
	coverBook.setAttribute("src", `${cover}`);

	// membuat element parrent untuk menampung element cover book
	const coverBookParrent = document.createElement("div");
	coverBookParrent.classList.add("bookCover");
	coverBookParrent.append(coverBook);

	// membuat element spesifikasi buku (data buku)
	// element judul buku
	const bookTitle = document.createElement("div");
	bookTitle.classList.add("bookTitle");
	bookTitle.innerText = title;

	// element author buku
	const bookAuthor = document.createElement("div");
	bookAuthor.classList.add("bookAuthor");
	bookAuthor.innerText = author;

	// element genre buku
	const bookGenre = document.createElement("div");
	bookGenre.classList.add("bookGenre");
	bookGenre.innerText = genre;

	// element tahun terbit buku
	const bookYear = document.createElement("div");
	bookYear.classList.add("bookYear");
	bookYear.innerText = year;

	// membuat element parrent untuk menampung data buku / spesifikasi buku
	const bookDataParrent = document.createElement("div");
	bookDataParrent.classList.add("bookData");
	bookDataParrent.append(bookTitle, bookAuthor, bookGenre, bookYear);

	// create element button (parrent/container button)
	const buttonContainer = document.createElement("div");
	buttonContainer.classList.add("actionButton");

	if (isCompleted) {
		// create element for removebutton (undo book list)
		const removeButton = document.createElement("button");
		removeButton.classList.add("remove");
		removeButton.setAttribute("id", `remove`);
		removeButton.addEventListener("click", function () {
			undoBookFromCompletedList(id);
		});

		// create element for delete button
		const deleteButton = document.createElement("button");
		deleteButton.classList.add("delete");
		deleteButton.setAttribute("id", `delete`);
		deleteButton.addEventListener("click", function () {
			deleteBookFromList(id);
		});

		buttonContainer.append(removeButton, deleteButton);
	} else {
		// create element for checklist button
		const checklistButton = document.createElement("button");
		checklistButton.classList.add("checklist");
		checklistButton.setAttribute("id", `checklist`);
		checklistButton.addEventListener("click", function () {
			addBookToCompletedList(id);
		});

		// create element for delete button
		const deleteButton = document.createElement("button");
		deleteButton.classList.add("delete");
		deleteButton.setAttribute("id", `delete`);
		deleteButton.addEventListener("click", function () {
			deleteBookFromList(id);
		});

		buttonContainer.append(checklistButton, deleteButton);
	}

	// membuat element container untuk menampung semua data
	const container = document.createElement("div");
	container.classList.add("book", "shadow");
	container.setAttribute("id", `book-${id}`);
	container.append(coverBookParrent, bookDataParrent, buttonContainer);

	return container;
};

// fungsi mencari item pada buku list
findBookList = (bookId) => {
	for (const getBookObject of booksData) {
		if (getBookObject.id === bookId) {
			return getBookObject;
		}
	}
};

// fungsi mencari index pada buku list
findBookListIndex = (bookId) => {
	for (const index in booksData) {
		if (booksData[index].id === bookId) {
			return index;
		}
	}
};

// fungsi menambahkan buku kedalam completed book list
addBookToCompletedList = (bookId) => {
	const bookItemTarget = findBookList(bookId);

	bookItemTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBook();
};

// fungsi meng-undo Book list dari compeleted book list kedalam uncompleted book list
undoBookFromCompletedList = (bookId) => {
	const bookItemTarget = findBookList(bookId);

	bookItemTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveDataBook();
};

// fungsi menghapus book list
deleteBookFromList = (bookId) => {
	const bookItemTarget = findBookListIndex(bookId);
	const mainContainer = document.getElementById("containerPopupConfirm");

	// create element for popup confirm and background overlay

	// create element background overlay
	const backgroundOverlay = document.createElement("div");
	backgroundOverlay.classList.add("backgroundOverlay");

	// create element message for popup
	const iconWarning = document.createElement("img");
	iconWarning.setAttribute("src", "assets/icon/icon-warning.svg");

	const messageHeading2 = document.createElement("h2");
	messageHeading2.innerText = "Apakah anda yakin untuk menghapus buku ini daris list anda?";

	const messageHeading3 = document.createElement("h3");
	messageHeading3.innerText = 'Jika anda ingin Menghapusnya click button "delete"';

	const containerMessage = document.createElement("div");
	containerMessage.classList.add("message");
	containerMessage.append(iconWarning, messageHeading2, messageHeading3);

	// create element button for popup
	const buttonDelete = document.createElement("button");
	buttonDelete.classList.add("buttonDelete");
	buttonDelete.innerText = "Delete";
	buttonDelete.addEventListener("click", function (event) {
		event.preventDefault();
		booksData.splice(bookItemTarget, 1);
		document.dispatchEvent(new Event(RENDER_EVENT));
		saveDataBook();

		const popupAlertDeleteBook = document.querySelector("div.popupAlert");

		popupAlertDeleteBook.innerText = "Buku berhasil dihapus dari rak buku";
		popupAlertDeleteBook.classList.add("deleteBook");
		popupAlertDeleteBook.classList.remove("addBook");

		popupAlertDeleteBook.style.opacity = "1";
		popupAlertDeleteBook.style.transform = "translateY(0)";

		setTimeout(() => {
			popupAlertDeleteBook.style.opacity = "0";
			popupAlertDeleteBook.style.transform = "translateY(-100%)";
		}, 2000);

		backgroundOverlay.style.opacity = "0";
		backgroundOverlay.style.transform = "scale(0)";
		popupConfirm.style.opacity = "0";
		popupConfirm.style.transform = "scale(0)";
	});

	const buttonCancel = document.createElement("button");
	buttonCancel.classList.add("buttonCancel");
	buttonCancel.innerText = "Cancel";
	buttonCancel.addEventListener("click", function (event) {
		event.preventDefault();
		backgroundOverlay.style.opacity = "0";
		backgroundOverlay.style.transform = "scale(0)";
		popupConfirm.style.opacity = "0";
		popupConfirm.style.transform = "scale(0)";
	});

	const containerButton = document.createElement("div");
	containerButton.classList.add("containerButton");
	containerButton.append(buttonDelete, buttonCancel);

	// container popup confirm
	const popupConfirm = document.createElement("div");
	popupConfirm.classList.add("popupConfirm");
	popupConfirm.append(containerMessage, containerButton);

	// main container popup container and background overlay
	mainContainer.append(backgroundOverlay, popupConfirm);
};

// event submit form
document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("inputDataBook");

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		addDataBooks();

		// popup alert add book to list
		const title = document.getElementById("inputTitleBook").value;
		const popupAlertAddBook = document.querySelector("div.popupAlert");

		popupAlertAddBook.innerText = `Buku ${title} berhasil ditambahkan`;
		popupAlertAddBook.classList.add("addBook");
		popupAlertAddBook.classList.remove("deleteBook");

		popupAlertAddBook.style.opacity = "1";
		popupAlertAddBook.style.transform = "translateY(0)";

		setTimeout(() => {
			popupAlertAddBook.style.opacity = "0";
			popupAlertAddBook.style.transform = "translateY(-100%)";
		}, 2000);
	});

	if (checkWebStorage()) {
		loadDataFromLocalStorage();
	}
});

// event untuk mencari book list pada searchbox
document.getElementById("searchSubmit").addEventListener("click", function (event) {
	const searchField = document.getElementById("searchField");
	const searchResult = document.getElementById("searchResult");

	const bookCardSearchField = document.getElementById("bookCardSearchField");
	bookCardSearchField.innerHTML = "";

	if (searchField.value.length === 0) {
		searchResult.innerHTML = "";
		bookCardSearchField.innerHTML = "";
	} else {
		searchResult.innerHTML = `<span>Hasil pencarian judul buku</span> "${searchField.value}"`;
	}

	for (const bookObject of booksData) {
		if (bookObject.title.toLowerCase().includes(searchField.value.toLowerCase())) {
			if (bookObject.isCompleted === true) {
				// membuat element untuk cover buku
				const coverBook = document.createElement("img");
				coverBook.setAttribute("src", `${bookObject.cover}`);

				// membuat element parrent untuk menampung element cover book
				const coverBookParrent = document.createElement("div");
				coverBookParrent.classList.add("bookCover");
				coverBookParrent.append(coverBook);

				// membuat element spesifikasi buku (data buku)
				// element judul buku
				const bookTitle = document.createElement("div");
				bookTitle.classList.add("bookTitle");
				bookTitle.innerText = bookObject.title;

				// element author buku
				const bookAuthor = document.createElement("div");
				bookAuthor.classList.add("bookAuthor");
				bookAuthor.innerText = bookObject.author;

				// element genre buku
				const bookGenre = document.createElement("div");
				bookGenre.classList.add("bookGenre");
				bookGenre.innerText = bookObject.genre;

				// element tahun terbit buku
				const bookYear = document.createElement("div");
				bookYear.classList.add("bookYear");
				bookYear.innerText = bookObject.year;

				// element status buku
				const bookStatus = document.createElement("div");
				bookStatus.classList.add("status", "completed");
				bookStatus.innerText = "Done";

				// membuat element parrent untuk menampung data buku / spesifikasi buku
				const bookDataParrent = document.createElement("div");
				bookDataParrent.classList.add("bookData");
				bookDataParrent.append(bookTitle, bookAuthor, bookGenre, bookYear, bookStatus);

				// create element for remove button
				const removeButton = document.createElement("button");
				removeButton.classList.add("remove");
				removeButton.setAttribute("id", `remove`);
				removeButton.addEventListener("click", function () {
					undoBookFromCompletedList(bookObject.id);
				});

				// create element for delete button
				const deleteButton = document.createElement("button");
				deleteButton.classList.add("delete");
				deleteButton.setAttribute("id", `delete`);
				deleteButton.addEventListener("click", function () {
					deleteBookFromList(bookObject.id);
				});

				// create element button (parrent/container button)
				const buttonContainer = document.createElement("div");
				buttonContainer.classList.add("actionButton");
				buttonContainer.append(removeButton, deleteButton);

				// membuat element container untuk menampung semua data
				const container = document.createElement("div");
				container.classList.add("book", "shadow");
				container.append(coverBookParrent, bookDataParrent, buttonContainer);

				// final element container/ container utama
				bookCardSearchField.append(container);
			} else {
				// membuat element untuk cover buku
				const coverBook = document.createElement("img");
				coverBook.setAttribute("src", `${bookObject.cover}`);

				// membuat element parrent untuk menampung element cover book
				const coverBookParrent = document.createElement("div");
				coverBookParrent.classList.add("bookCover");
				coverBookParrent.append(coverBook);

				// membuat element spesifikasi buku (data buku)
				// element judul buku
				const bookTitle = document.createElement("div");
				bookTitle.classList.add("bookTitle");
				bookTitle.innerText = bookObject.title;

				// element author buku
				const bookAuthor = document.createElement("div");
				bookAuthor.classList.add("bookAuthor");
				bookAuthor.innerText = bookObject.author;

				// element genre buku
				const bookGenre = document.createElement("div");
				bookGenre.classList.add("bookGenre");
				bookGenre.innerText = bookObject.genre;

				// element tahun terbit buku
				const bookYear = document.createElement("div");
				bookYear.classList.add("bookYear");
				bookYear.innerText = bookObject.year;

				// element status buku
				const bookStatus = document.createElement("div");
				bookStatus.classList.add("status", "uncompleted");
				bookStatus.innerText = "Ongoing";

				// membuat element parrent untuk menampung data buku / spesifikasi buku
				const bookDataParrent = document.createElement("div");
				bookDataParrent.classList.add("bookData");
				bookDataParrent.append(bookTitle, bookAuthor, bookGenre, bookYear, bookStatus);

				// create element for checklist button
				const checklistButton = document.createElement("button");
				checklistButton.classList.add("checklist");
				checklistButton.setAttribute("id", `checklist`);
				checklistButton.addEventListener("click", function () {
					addBookToCompletedList(bookObject.id);
				});

				// create element for delete button
				const deleteButton = document.createElement("button");
				deleteButton.classList.add("delete");
				deleteButton.setAttribute("id", `delete`);
				deleteButton.addEventListener("click", function () {
					deleteBookFromList(bookObject.id);
				});

				// create element button (parrent/container button)
				const buttonContainer = document.createElement("div");
				buttonContainer.classList.add("actionButton");
				buttonContainer.append(checklistButton, deleteButton);

				// membuat element container untuk menampung semua data
				const container = document.createElement("div");
				container.classList.add("book", "shadow");
				container.append(coverBookParrent, bookDataParrent, buttonContainer);

				// final element container/ container utama
				bookCardSearchField.append(container);
			}
		}
	}
});

// Saved Event (custom event)
document.addEventListener(SAVED_EVENT, function () {
	console.log("Data sudah disimpan kedalam Web Storage");
});

// Render Event (custom event)
document.addEventListener(RENDER_EVENT, function () {
	console.log(booksData);
	const uncompletedBook = document.getElementById("uncompletedBook");
	const completedBook = document.getElementById("completedBook");

	// clearing book list / item
	uncompletedBook.innerHTML = "";
	completedBook.innerHTML = "";

	for (let i = 0; i < booksData.length; i++) {
		const bookList = booksData[i];
		const bookElement = makeBookshelf(bookList);

		if (bookList.isCompleted) {
			completedBook.append(bookElement);
		} else {
			uncompletedBook.append(bookElement);
		}
	}
});

// event untuk mengubah text button pada form field
const checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("change", function () {
	if (checkbox.checked) {
		document.getElementById("submitForm").setAttribute("value", "Submit Kedalam Rak Buku (Tamat)");
	} else {
		document.getElementById("submitForm").setAttribute("value", "Submit Kedalam Rak Buku  (Ongoing)");
	}
});

// event mem humburger menu
const humMenu = document.querySelector(".humburgerMenu");
humMenu.addEventListener("click", function () {
	const listMenu = document.querySelector(".list-menu")
	listMenu.classList.toggle("slider");

	const mainElement = document.querySelector("main");
	mainElement.classList.toggle("blur")
});