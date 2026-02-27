"use strict";
let log = document.querySelector(".drop-button");
let logout = document.querySelector(".log-button"); //Logout Button
let add_btn = document.querySelector(".add");
let add_fn = document.getElementById("form-div"); //Add Form Button
let form = document.querySelector("form"); //For Form Functionality
let can = document.querySelector(".cancel"); //For Cancel Functionality
let searchInput = document.querySelector(".search"); //to retrive the value from seacrh input
let waitingField = document.getElementById("waiting-field"); //to fetch waiting field option
//Logout if someone click on dropdown button logout menu appears
log === null || log === void 0 ? void 0 : log.addEventListener('click', function () {
    if ((logout === null || logout === void 0 ? void 0 : logout.style.display) === 'none') {
        logout.style.display = 'block';
    }
    else {
        logout.style.display = 'none';
    }
});
//Add Form Display
add_btn === null || add_btn === void 0 ? void 0 : add_btn.addEventListener('click', function () {
    localStorage.removeItem("editIndex");
    if (form) {
        form.reset();
    }
    if ((add_fn === null || add_fn === void 0 ? void 0 : add_fn.style.display) === 'none') {
        add_fn.style.display = 'block';
    }
    else {
        add_fn.style.display = 'none';
    }
});
//Cancel Functionality
can === null || can === void 0 ? void 0 : can.addEventListener('click', function () {
    if (add_fn)
        add_fn.style.display = 'none';
});
//Add Form Functionality
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
    e.preventDefault();
    let title = document.getElementById("doc-title");
    let status = document.getElementById("doc-status");
    if (!title) {
        alert("Please Fill The Fields");
        return;
    }
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    // if (!Array.isArray(documents)) {
    //     documents = [];
    // }
    let editIndex = localStorage.getItem("editIndex");
    let waitingCount = document.getElementById("waiting-count");
    let newDocument = {
        title: title.value,
        status: status.value,
        waiting: status.value === "Pending" ? Number(waitingCount.value) : 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    if (editIndex !== null) {
        documents[parseInt(editIndex)] = newDocument;
        localStorage.removeItem("editIndex");
    }
    else {
        documents.push(newDocument);
    }
    localStorage.setItem("documents", JSON.stringify(documents));
    if (form) {
        form.reset();
    }
    if (waitingField) {
        waitingField.style.display = 'none';
    }
    if (add_fn) {
        add_fn.style.display = 'none';
    }
    displayDocuments();
});
//Display Functionality
function displayDocuments(filteredDoc = null) {
    const tableBody = document.getElementById("table-body");
    if (!tableBody)
        return;
    tableBody.innerHTML = "";
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    if (filteredDoc !== null) {
    }
}
;
function createRow(doc, index) {
    let statusClass = "";
    let btnClass = "";
    if (doc.status === 'Pending') {
        statusClass = 'Pending';
        btnClass = 'Preview';
    }
    else if (doc.status === 'Need-Signing') {
        statusClass = 'Need Signing';
        btnClass = 'Sign Now';
    }
    else {
        statusClass = 'Completed';
        btnClass = 'Download Pdf';
    }
    let row = `
        <tr>
            <td><input type = "checkbox"></td>
            <td class = "title">${doc.title}</td>
            <td class= "st-wait">
                <span class="status ${statusClass}">${doc.status}</span>${doc.status === "Pending"
        ? `<div class="waiting-text"><p class="waiting-for">Waiting for</p> <p class="wait-person">${doc.waiting} person<p></div>`
        : ""}
            </td>
            <td><small>${doc.date}<br>${doc.time}</small></td>
            <td><button class="btn ${statusClass}">${btnClass}</button></td>
            <td class="ed-button">
            <img class="dots"src="images/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 6.svg">
            <div class="edit-delete">
                <button class="btn-e"onclick="editDocument(${index})">
                Edit
                </button>
                <button class="btn-d" onclick="deleteDocument(${index})">
                Delete
                </button>
            </div>   
            </td>         
        </tr>
        `;
    tableBody.insertAdjacentHTML("beforeend", row);
}
// //SearchBar Functionality
searchInput.addEventListener('keyup', function () {
    let searchValue = searchInput.value.toLowerCase();
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    // if (!Array.isArray(documents)) {
    //     documents = [];
    // }
    if (searchValue === "") {
        displayDocuments();
        return;
    }
    let filteredDoc = documents
        .map((doc, index) => ({ doc, index })) // keep original index
        .filter(item => { var _a, _b; return (_b = (_a = item.doc) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchValue); });
    displayDocuments(filteredDoc);
});
displayDocuments();
//Delete Functionality
function deleteDocument(index) {
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    if (!Array.isArray(documents)) {
        documents = [];
    }
    documents.splice(index, 1);
    localStorage.setItem('documents', JSON.stringify(documents));
    displayDocuments();
}
;
function editDocument(index) {
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    let doc = documents[index];
    if (!doc)
        return;
    let titleInput = document.querySelector("#doc-title");
    let statusSelect = document.querySelector("#doc-status");
    if (titleInput)
        titleInput.value = doc.title;
    if (statusSelect)
        statusSelect.value = doc.status;
    localStorage.setItem("editIndex", index.toString(index));
}
//Functionality when someone click on other table for edit and delete
document.addEventListener("click", function (e) {
    //close all existing ones
    if (e.target.classList.contains("dots")) {
        document.querySelectorAll(".edit-delete").forEach((menu) => {
            menu.style.display = "none";
        });
        // Open clicked one
        let menu = e.target
            .closest(".ed-button")
            .querySelector(".edit-delete");
        menu.style.display = "flex";
    }
    // If clicked anywhere else → close all
    else {
        document.querySelectorAll(".edit-delete").forEach((menu) => {
            menu.style.display = "none";
        });
    }
});
//Waiting Functionality
let statusSelect = document.querySelector("#doc-status"); //to retrieve the value from select option
if (statusSelect && waitingField) {
    statusSelect === null || statusSelect === void 0 ? void 0 : statusSelect.addEventListener("change", function () {
        if (statusSelect.value === "Pending") {
            waitingField.style.display = "block";
        }
        else {
            waitingField.style.display = "none";
        }
    });
}
//# sourceMappingURL=script.js.map