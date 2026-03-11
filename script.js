"use strict";
let log = document.querySelector(".drop-button");
let logout = document.querySelector(".log-button");
let add_btn = document.querySelector(".add");
let add_fn = document.querySelector("#form-div");
let cancel = document.querySelector(".cancel");
let form = document.querySelector("#form-con");
//when status pending show waiting for
let statusSelect = document.querySelector("#doc-status");
let waitingField = document.querySelector("#waiting-field");
let formHeading = document.querySelector("#form-heading");
let submitBtn = document.querySelector("#submit-btn");
//For Pending
const Status_pending = "Pending";
//For Signing 
const Need_Signing = "Need-signing";
//For Completed
const Completed = "Completed";
//Logout Button
log === null || log === void 0 ? void 0 : log.addEventListener('click', function () {
    if (logout) {
        if (logout.style.display === 'none') {
            logout.style.display = 'block';
        }
        else {
            logout.style.display = 'none';
        }
    }
});
//Display Functionality of add form
add_btn === null || add_btn === void 0 ? void 0 : add_btn.addEventListener('click', function () {
    localStorage.removeItem("editIndex");
    form === null || form === void 0 ? void 0 : form.reset();
    if (formHeading)
        formHeading.textContent = "Add Document";
    if (submitBtn)
        submitBtn.textContent = "Add";
    if (add_fn) {
        add_fn.style.display = "block";
    }
});
//Cancel Button display functioning
cancel === null || cancel === void 0 ? void 0 : cancel.addEventListener('click', function () {
    if (add_fn) {
        add_fn.style.display = 'none';
    }
});
//Add Functionality
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
    e.preventDefault();
    let title = document.querySelector("#doc-title");
    let status = document.querySelector("#doc-status");
    let waitingCount = document.querySelector("#waiting-count");
    if (!title || title.value.trim() === "") {
        alert("Please Fill the Field");
        return;
    }
    if ((status === null || status === void 0 ? void 0 : status.value) === Status_pending) {
        let waitingValue = Number(waitingCount === null || waitingCount === void 0 ? void 0 : waitingCount.value);
        if (!waitingCount || waitingValue < 1) {
            alert("Waiting person must be at least 1 when status is Pending");
            return;
        }
    }
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    if (!Array.isArray(documents)) {
        documents = [];
    }
    let newDoc = {
        id: Date.now().toString(),
        title: title.value,
        status: (status === null || status === void 0 ? void 0 : status.value) || Status_pending,
        waiting: (status === null || status === void 0 ? void 0 : status.value) === Status_pending ? Number(waitingCount === null || waitingCount === void 0 ? void 0 : waitingCount.value) || 0 : 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    let editIndex = localStorage.getItem("editIndex");
    if (editIndex) {
        let index = documents.findIndex(d => d.id === editIndex);
        if (index !== -1) {
            newDoc.id = editIndex;
            documents[index] = newDoc;
        }
        localStorage.removeItem("editIndex");
    }
    else {
        documents.push(newDoc);
    }
    localStorage.setItem("documents", JSON.stringify(documents));
    form === null || form === void 0 ? void 0 : form.reset();
    add_fn.style.display = 'none';
    waitingField.style.display = 'none';
    if (searchInput && searchInput.value.trim() !== "") {
        searchInput.dispatchEvent(new Event("keyup"));
    }
    else {
        displayDocuments();
    }
    // displayDocuments();
});
//Display Functionality
function displayDocuments(filteredDoc = null) {
    let myArray = JSON.parse(localStorage.getItem("documents") || "[]");
    if (!Array.isArray(myArray)) {
        myArray = [];
    }
    let data = filteredDoc !== null ? filteredDoc : myArray;
    let tableBody = document.querySelector("#table-body");
    if (!tableBody)
        return;
    tableBody.innerHTML = "";
    if (data.length === 0) {
        tableBody.innerHTML = `
        <tr>
           <td colspan="6" style="text-align : center">No Document Found</td>
        </tr>`;
        return;
    }
    if (!Array.isArray(data)) {
        data = [];
    }
    data.forEach((doc) => {
        // const id = doc.id;
        let statusClass = "";
        let btnClass = "";
        if (doc.status === Status_pending) {
            statusClass = Status_pending;
            btnClass = "Preview";
        }
        else if (doc.status === Need_Signing) {
            statusClass = Need_Signing;
            btnClass = "Sign Now";
        }
        else {
            statusClass = Completed;
            btnClass = "Download Pdf";
        }
        let row = `
      <tr>
            <td><input type = "checkbox"></td>
            <td class = "title">${doc.title}</td>
            <td>
            <div class="st-wait">
                <span class="status ${statusClass}">${doc.status}</span>${doc.status === "Pending"
            ? `<div class="waiting-text"><p class="waiting-for">Waiting for</p> <p class="wait-person">${doc.waiting} person</p></div>`
            : ""}
            </div>
            </td>
            <td><small>${doc.date}<br>${doc.time}</small></td>
            <td><button class="btn ${statusClass}">${btnClass}</button></td>
            <td class="ed-button">
            <img class="dots"src="images/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 6.svg">
            <div class="edit-delete">
                <button class="btn-e"onclick ="editDocument('${doc.id}')">Edit</button>
                <button class="btn-d"onclick = "deleteDocument('${doc.id}')">Delete</button>
            </div>   
            </td>         
        </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}
;
displayDocuments();
document.addEventListener("click", function (e) {
    var _a;
    const target = e.target;
    // If clicked on dots icon = toggle menu
    if (target && target.classList.contains("dots")) {
        document.querySelectorAll(".edit-delete").forEach((menu) => {
            menu.style.display = "none";
        });
        const menu = (_a = target.closest(".ed-button")) === null || _a === void 0 ? void 0 : _a.querySelector(".edit-delete");
        if (menu) {
            menu.style.display = "flex";
        }
    }
    // If clicked anywhere else = close all menus
    else {
        document.querySelectorAll(".edit-delete").forEach((menu) => {
            menu.style.display = "none";
        });
    }
});
//Edit Functionality
function editDocument(id) {
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    if (!Array.isArray(documents))
        return;
    let doc = documents.find(d => d.id === id);
    if (!doc)
        return;
    const titleInput = document.querySelector('#doc-title');
    const statusSelect = document.querySelector('#doc-status');
    const waitingInput = document.querySelector('#waiting-count');
    if (titleInput)
        titleInput.value = doc.title;
    if (statusSelect)
        statusSelect.value = doc.status;
    if (waitingInput)
        waitingInput.value = doc.waiting.toString();
    if (waitingField) {
        if (doc.status === Status_pending) {
            waitingField.style.display = "block";
            if (waitingInput)
                waitingInput.required = true;
        }
        else {
            waitingField.style.display = "none";
            if (waitingInput)
                waitingInput.required = false;
        }
    }
    //storing the index of document in which we are editing
    localStorage.setItem('editIndex', id);
    // change heading and button for edit mode
    if (formHeading)
        formHeading.textContent = "Edit Document";
    if (submitBtn)
        submitBtn.textContent = "Edit";
    if (searchInput) {
        searchInput.value = "";
    }
    if (add_fn) {
        add_fn.style.display = 'block';
    }
}
//Delete Function
function deleteDocument(id) {
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    if (!Array.isArray(documents))
        return;
    documents = documents.filter(doc => doc.id !== id);
    localStorage.setItem("documents", JSON.stringify(documents));
    if (searchInput) {
        searchInput.value = "";
    }
    displayDocuments();
}
if (statusSelect && waitingField) {
    statusSelect.addEventListener("change", function () {
        if (statusSelect.value === Status_pending) {
            waitingField.style.display = "block";
        }
        else {
            waitingField.style.display = "none";
        }
    });
}
let searchInput = document.querySelector(".search");
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keyup', function () {
    var _a, _b;
    let searchValue = (_b = (_a = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    let documents = JSON.parse(localStorage.getItem("documents") || '[]');
    if (!Array.isArray(documents)) {
        documents = [];
    }
    if (searchValue === "") {
        displayDocuments();
        return;
    }
    let filteredDoc = documents.filter((doc) => doc.title.toLowerCase().includes(searchValue));
    displayDocuments(filteredDoc);
});
document.addEventListener("click", function (e) {
    const target = e.target;
    if (add_fn && add_fn.style.display === "block") {
        if (!target.closest("#form-div") &&
            !target.closest(".add") &&
            !target.closest(".btn-e") // ignore edit button
        ) {
            add_fn.style.display = "none";
        }
    }
});
