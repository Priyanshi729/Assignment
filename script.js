let log = document.querySelector(".drop-button")
let logout = document.querySelector(".log-button")
log.addEventListener('click',function(){
    if(logout.style.display === 'none'){
        logout.style.display = 'block';
    }
    else{
        logout.style.display = 'none';
    }
});
let add_btn = document.querySelector(".add")
let add_fn = document.querySelector("#add-form")
add_btn.addEventListener('click',function(){
    if(add_fn.style.display === 'none'){
        add_fn.style.display = 'block';
    }
    else{
        add_fn.style .display = 'none';
    }
});
let form = document.querySelector(".form-doc");
form.addEventListener('submit',function(e){
    e.preventDefault();
    let title = document.getElementById("doc-title").value;
    let status = document.getElementById("doc-status").value;
    if(title == "" || status == ""){
        alert("Please Fill The Fields");
    }
    let newDocument = {
        title : title,
        status : status,
        date :new Date().toLocaleString()
    };
    let documents = JSON.parse(localStorage.getItem("documents"))|| [];
    documents.push(newDocument);
    localStorage.setItem("documents",JSON.stringify(documents));
    console.log(newDocument);
    // form.reset();
});