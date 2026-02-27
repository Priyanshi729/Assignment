let log = document.querySelector(".drop-button")
let logout = document.querySelector(".log-button")
let main_window = document.querySelector(".container")
//Logout if someone click on dropdown button logout menu appears
log.addEventListener('click', function () {
    if (logout.style.display === 'none') {
        logout.style.display = 'block';
    }
    else {
        logout.style.display = 'none';
    }
});

//Add Form Display
let add_btn = document.querySelector(".add")
let add_fn = document.querySelector("#form-div")
add_btn.addEventListener('click', function () {
    localStorage.removeItem("editIndex");
    form.reset();
    if (add_fn.style.display === 'none') {
        add_fn.style.display = 'block';
    }
    else {
        add_fn.style.display = 'none';
        main_window.style.filter = 'none';
    }
});

//Cancel Functionality
let can = document.querySelector(".cancel");
can.addEventListener('click', function () {
    add_fn.style.display = 'none';
})

//Add Form Functionality
let form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let title = document.getElementById("doc-title").value;
    let status = document.getElementById("doc-status").value;
    if (title == "") {
        alert("Please Fill The Fields");
        return;
    }
    let documents = JSON.parse(localStorage.getItem("documents"));
    if (!Array.isArray(documents)) {
        documents = [];
    }
    let editIndex = localStorage.getItem("editIndex");
    let waitingCount = document.getElementById("waiting-count").value;

    let newDocument = {
        title: title,
        status: status,
        waiting: status === "Pending" ? waitingCount : 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    if (editIndex !== null) {
        documents[parseInt(editIndex)] = newDocument;
        localStorage.removeItem("editIndex");
    } else {
        documents.push(newDocument);
    }
    // documents.push({
    //     title : title,
    //     status : status,
    //     date :new Date().toLocaleDateString(),
    //     time : new Date().toLocaleTimeString()
    // });
    // documents.push(newDocument);
    localStorage.setItem("documents", JSON.stringify(documents));
    form.reset();
    waitingField.style.display = 'none';
    add_fn.style.display = 'none';
    displayDocuments();
});

//Display Functionality
function displayDocuments(filteredDoc = null) {
    let documents = JSON.parse(localStorage.getItem("documents"));
    if (!Array.isArray(documents)) {
        documents = [];
    }
    if (filteredDoc !== null) {
        documents = filteredDoc;
    }
    let tableBody = document.getElementById('table-body');
    tableBody.innerHTML = "";
    documents.forEach((item) => {
        if (!item) return;

        let doc = item.doc ? item.doc : item;
        let index = item.index !== undefined ? item.index : documents.indexOf(item);
        if(!doc) return;
        let statusClass = "";
        let btnClass = "";
        if (doc.status === 'Pending') {
            statusClass = 'Pending';
            btnClass = 'Preview';
        }
        else if (doc.status === 'Need-Signing') {
            statusClass = 'Need-Signing';
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
                <button class="btn-e"onclick="editDocument(${index})">Edit</button>
                <button class="btn-d" onclick="deleteDocument(${index})">Delete</button>
            </div>   
            </td>         
        </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });

};

// //SearchBar Functionality
let searchInput = document.querySelector(".search");
searchInput.addEventListener('keyup', function () {
    let searchValue = searchInput.value.toLowerCase();
    let documents = JSON.parse(localStorage.getItem("documents"));
    if (!Array.isArray(documents)) {
        documents = [];
    }
    if (searchValue === "") {
        displayDocuments();
        return;
    }
    let filteredDoc = documents
    .map((doc, index) => ({ doc, index }))   // keep original index
    .filter(function (item) {
        return item.doc &&
               item.doc.title &&
               item.doc.title.toLowerCase().includes(searchValue);
    });

    displayDocuments(filteredDoc);
})


// document.getElementById("table-body").addEventListener("click", function (e) {
//     if (e.target.classList.contains("dots")) {
//         let editDelete = e.target.nextElementSibling;

//         if (editDelete.style.display === "block") {
//             editDelete.style.display = "none";
//         } else {
//             editDelete.style.display = "block";
//         }
//     }
// });
displayDocuments();

//Delete Functionality
function deleteDocument(index) {
    let documents = JSON.parse(localStorage.getItem("documents"));
    if (!Array.isArray(documents)) {
        documents = [];
    }
    documents.splice(index, 1);
    localStorage.setItem('documents', JSON.stringify(documents));
    displayDocuments();
};
function editDocument(index) {
    let documents = JSON.parse(localStorage.getItem("documents"));
    let doc = documents[index];
    document.getElementById('doc-title').value = doc.title;
    document.getElementById('doc-status').value = doc.status;
    localStorage.setItem('editIndex', index);
    add_fn.style.display = 'block';
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
let statusSelect = document.getElementById("doc-status");
let waitingField = document.getElementById("waiting-field");

statusSelect.addEventListener("change", function () {

    if (statusSelect.value === "Pending") {
        waitingField.style.display = "block";
    } else {
        waitingField.style.display = "none";
    }

});