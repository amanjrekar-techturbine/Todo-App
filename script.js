let input = document.querySelector(".input-wrapper input")
let clearAll_btn = document.querySelector(".clear_all_btn")
let task_wrapper = document.querySelector(".task-wrapper")
let pending_wrapper = document.querySelector(".pending-wrapper")
let pending_task = 0
let dataList = [] // [{todo, isCompleted}]

// Get Previous Data From LocalStorage
function getPreviousData() {
    let previousData = JSON.parse(localStorage.getItem("todo_list") || '[]')

    if (previousData.length > 0) {

        dataList = JSON.parse(localStorage.getItem("todo_list"))

        dataList.forEach((todo) => {
            appendTaskHTML(todo.title, todo.isCompleted)

            if (!todo.isCompleted) {
                updatePendingTask(pending_task + 1)
            }

        })

    }
}
getPreviousData()

// Update dataList variable and localstorage
function updateDataList(todo, action) {      // todo : {title, isCompleted} || action : append/update/remove/clear

    switch (action) {
        
        case "append":
            dataList.push(todo);
            break;

        case "update":
            let todo_index = dataList.findIndex((x) => {
                return x.title == todo.title
            })
            dataList.splice(todo_index, 1, todo)

            // Sort Checked and unchecked todo
            let removedTodo = dataList.splice(todo_index, 1)[0]

            if (removedTodo.isCompleted) {
                dataList.unshift(removedTodo)
            } else {
                dataList.push(removedTodo)
            }

            task_wrapper.innerHTML = "";

            dataList.forEach((todo) => {
                appendTaskHTML(todo.title, todo.isCompleted)

            })
            break;
            
        case "remove":
            let todo_index2 = dataList.findIndex((x) => {
                return x.title == todo.title
            })
            dataList.splice(todo_index2, 1)
            break;

        case "clear":
            dataList = []
            break;
    }

    localStorage.setItem("todo_list", JSON.stringify(dataList))

}

// To Update Pending Task
function updatePendingTask(newVal = pending_task) {
    pending_task = newVal
    pending_wrapper.querySelector("p").textContent = `You have ${pending_task} pending tasks`
}
updatePendingTask()

// To Add a task
function addTodo(e) {
    e.preventDefault()

    let inputVal = input.value

    // Blank Input Validation
    if (inputVal.trim().length == 0) {
        // alert("Please enter a task")
        swal("Oops!", "Please add a valid task!", "error");
        input.value = ""
        return;
    }

    // Checks if todo already exists
    if (checkTodoAlreadyExist(inputVal)) {
        swal("Oops!", "Todo Already Present!", "error");
        input.value = ""
        return;
    }

    // Append Task in HTML
    appendTaskHTML(inputVal.trim(), false);

    // Update Pending Task
    updatePendingTask(pending_task + 1)

    // Add todo in DataList(to store in localstorage)
    let todo = { title: inputVal.trim(), isCompleted: false }
    updateDataList(todo, "append")

    // Clears Input After submission
    input.value = ""
}

// Append Task in HTML
function appendTaskHTML(title, isCompleted) {
    let todoTemp = `<div class="task">
                <span class="checkbox-wrapper">
                    <input type="checkbox" ${(isCompleted) ? "checked" : ""} name="" id="" onclick="onCheckboxChange(event)">
                </span>
                <p>${title}</p>
                <button class="delete_task" onclick="deleteTodo(event)"><i class="fa-solid fa-trash"></i></button>
            </div>`

    task_wrapper.insertAdjacentHTML("afterBegin", todoTemp)
}


// Delete Todo
function deleteTodo(e) {

    let userConfirmation = confirm("Do you want to delete todo?")

    if(!userConfirmation){
        return
    }

    let deleteBtn = e.currentTarget;
    let todo = deleteBtn.parentNode
    let title = todo.children[1].textContent
    let checkbox = todo.children[0].children[0]

    todo.remove()

    updateDataList({ title }, "remove")

    if (!checkbox.checked) {
        updatePendingTask(pending_task - 1)
    }
}

//  Clear All Task
clearAll_btn.addEventListener("click", (e) => {

    if(dataList.length == 0){
        return
    }

    let userConfirmation = confirm("Do you want to delete all todos?")

    if(!userConfirmation){
        return
    }

    task_wrapper.innerHTML = ""

    updateDataList(null, "clear")

    updatePendingTask(0)
})


// CheckBox Logic
function onCheckboxChange(e) {
    let checkbox = e.target;
    let todo = e.target.parentNode.parentNode
    let title = todo.children[1].textContent
    let isCompleted = checkbox.checked

    updateDataList({ title, isCompleted }, "update")

    if (checkbox.checked) {
        updatePendingTask(pending_task - 1)
    } else {
        updatePendingTask(pending_task + 1)
    }

}

// Check if todo exist
function checkTodoAlreadyExist(title) {
    return dataList.some((x) => {

        return x.title.trim().toLowerCase() == title.trim().toLowerCase()
    })
}



