const baseurl = ''; //Insert url from crudcrud here

const deleteButton = document.getElementById("delete");
deleteButton.addEventListener("click", deleteItem)
const todoList = document.getElementById("todos");
document.querySelector("form").addEventListener("submit", save);

var todoItems = [];
var selected = -1;

function printItems(){
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    for(var i = 0; i < todoItems.length; i++) {
        const li = document.createElement("LI");
        li.dataset.id = i;
        li.addEventListener("click", handleClick)
        li.innerText = todoItems[i].title;
        todoList.appendChild(li);
    }
}

async function save(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector("[name=title]");
    if (selected >= 0){
        var itemId = todoItems[selected]._id;
        const response = await fetch(baseurl + '/todos/' + itemId, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({"title": title.value}),
        });
        if(response.ok) {
            alert("SAVED");
            todoItems[selected].title = title.value;
            postUpdate();
        } else {
            alert("FAILED");
        }
    }
    else{
        const response = await fetch(baseurl + '/todos', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({"title": title.value}),
        });
        if(response.ok) {
            document.querySelector("input").value = "";
            alert("SAVED");
        } else {
            alert("FAILED");
        }
    }
    
}

async function list() {
    const response = await fetch(baseurl + '/todos', {
        method: 'get',
        headers: {
            'accept': 'application/json',
        },
    });
    if(response.ok) {
        const todos = await response.json();
        todoItems = todos;
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
        for(var i = 0; i < todoItems.length; i++) {
            const li = document.createElement("LI");
            li.dataset.id = i;
            li.addEventListener("click", handleClick);
            li.innerText = todoItems[i].title;
            todoList.appendChild(li);
        }
    } else {
        alert("FAILED");
    }
}

function handleClick(event){
    selected = event.target.dataset.id;
    deleteButton.hidden = false;
    document.querySelector("input").value = todoItems[selected].title;
}

async function deleteItem(event){
    var itemId = todoItems[selected]._id;
    const response = await fetch(baseurl + '/todos/' + itemId, {
        method: 'delete',
        headers: {
            'accept': 'application/json',
        },
    });
    if(response.ok) {
        todoItems.splice(selected, 1)
        postUpdate();
    } else {
        alert("FAILED");
    }
}

function postUpdate(){
    selected = -1;
    deleteButton.hidden = true;
    printItems();
    document.querySelector("input").value = "";
}