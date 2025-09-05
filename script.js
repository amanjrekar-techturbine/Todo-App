let input = document.querySelector(".input-wrapper input")
let clearAll_btn = document.querySelector(".clear_all_btn")
let task_wrapper = document.querySelector(".task-wrapper")
let pending_wrapper = document.querySelector(".pending-wrapper")
let hidden_data_field = document.querySelector("#hidden_data")
let completed_todos_btn = document.querySelector(".completed_todos_btn")
let incompleted_todos_btn = document.querySelector(".incompleted_todos_btn")
let home_btn = document.querySelector(".home_btn")
let pending_task = 0
let dataList = [] // [{todo, isCompleted}]

// Get Previous Data From LocalStorage
function getPreviousData() {
    let previousData = JSON.parse(localStorage.getItem("todo_list") || '[]')

    if (previousData.length > 0) {

        dataList = JSON.parse(localStorage.getItem("todo_list"))

        // let sortedList = sortedDataList()

        // sortedList.forEach((todo) => {
        //     appendTaskHTML(todo)

        //     if (!todo.isCompleted) {
        //         updatePendingTask(pending_task + 1)
        //     }

        // })

        // Show Home Page
        showHomePage()

    }
}
getPreviousData()

// Update dataList variable and localstorage
function updateDataList(todo, action) {      // todo : {title, isCompleted} || action : append/update/remove/clear

    switch (action) {

        case "append":
            dataList.push(todo);
            break;

        case "updateCheckbox":
            let todo_index = dataList.findIndex((x) => {
                return x.title == todo.title
            })
            dataList.splice(todo_index, 1, todo)

            // Sort Checked and unchecked todo

            // let sortedList = sortedDataList()

            // task_wrapper.innerHTML = "";

            // sortedList.forEach((todo) => {
            //     appendTaskHTML(todo)

            // })
            break;

        case "updateTitle":

            let todo_index3 = dataList.findIndex((x) => {
                return x.id == todo.id
            })

            dataList.splice(todo_index3, 1, todo)

            // task_wrapper.innerHTML = "";

            // let sortedList2 = sortedDataList()

            // sortedList2.forEach((todo) => {
            //     appendTaskHTML(todo)

            // })

            // // Update Pending Task Desc
            // updatePendingTask()

            // // Update Filter UI
            // updateFilterUI()

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
    showHomePage()
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
    let hidden_field_val = hidden_data_field.value
    let prevDataId = hidden_field_val ? JSON.parse(hidden_field_val) : null;

    // Blank Input Validation
    if (inputVal.trim().length == 0) {
        // alert("Please enter a task")
        swal("Oops!", "Please add a valid task!", "error");
        input.value = ""
        return;
    }

    // Checks if todo already exists
    if (checkTodoAlreadyExist(inputVal) && prevDataId == null) {
        swal("Oops!", "Todo Already Present!", "error");
        input.value = ""
        return;
    }

    if (prevDataId != null) {

        let prevObj = dataList.find(x => x.id == prevDataId)

        prevObj["title"] = inputVal

        updateDataList(prevObj, "updateTitle")

    } else {
        let todo = { id: getPrevDataListObjId() + 1, title: inputVal.trim(), isCompleted: false }

        // Append Task in HTML
        // appendTaskHTML(todo);

        // Update Pending Task
        // updatePendingTask(pending_task + 1)

        // Add todo in DataList(to store in localstorage)

        updateDataList(todo, "append")
    }



    // Clears Input After submission
    e.target.reset()
    hidden_data_field.value = ""
}

// Append Task in HTML
function appendTaskHTML(todo) {
    let todoTemp = `<div class="task">
                <span class="checkbox-wrapper">
                    <input type="checkbox" ${(todo.isCompleted) ? "checked" : ""} name="" id="" onclick="onCheckboxChange(event)">
                </span>
                <p>${todo.title}</p>
                <button class="update_task" onclick="updateTodo(event)" data-id="${todo.id}" ><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete_task" onclick="deleteTodo(event)"><i class="fa-solid fa-trash"></i></button>
            </div>`

    task_wrapper.insertAdjacentHTML("afterBegin", todoTemp)
}


// Delete Todo
function deleteTodo(e) {

    let userConfirmation = confirm("Do you want to delete todo?")

    if (!userConfirmation) {
        return
    }

    let deleteBtn = e.currentTarget;
    let todo = deleteBtn.parentNode
    let title = todo.children[1].textContent
    let checkbox = todo.children[0].children[0]

    todo.remove()

    updateDataList({ title }, "remove")

    // if (!checkbox.checked) {
    //     updatePendingTask(pending_task - 1)
    // }

    input.value = ""
    hidden_data_field.value = ""

}

// Update Todo(Get Todo Values and set in input field)
function updateTodo(e) {
    let updateBtn = e.currentTarget;
    let todo = updateBtn.parentNode;
    let title = todo.children[1].textContent;
    let id = updateBtn.dataset.id

    input.value = title
    hidden_data_field.value = id
}

//  Clear All Task
clearAll_btn.addEventListener("click", (e) => {

    if (dataList.length == 0) {
        return
    }

    let userConfirmation = confirm("Do you want to delete all todos?")

    if (!userConfirmation) {
        return
    }

    task_wrapper.innerHTML = ""

    updateDataList(null, "clear")

    updatePendingTask(0)
})


// CheckBox Logic
function onCheckboxChange(e) {

    // Update UI
    // completed_todos_btn.style.display = "inline-block"
    // incompleted_todos_btn.style.display = "none"
    // home_btn.style.display = "none"

    let checkbox = e.target;
    let todo = e.target.parentNode.parentNode
    let title = todo.children[1].textContent
    let isCompleted = checkbox.checked

    let todoFromDataList = dataList.find(x => x.title == title)

    updateDataList({ id: todoFromDataList.id, title, isCompleted }, "updateCheckbox")

    // if (checkbox.checked) {
    //     updatePendingTask(pending_task - 1)
    // } else {
    //     updatePendingTask(pending_task + 1)
    // }

}

// Check if todo exist
function checkTodoAlreadyExist(title) {
    return dataList.some((x) => {

        return x.title.trim().toLowerCase() == title.trim().toLowerCase()
    })
}

function getPrevDataListObjId() {
    let prevObj = dataList[dataList.length - 1]
    let prevObjId = prevObj ? prevObj.id : 0
    return prevObjId
}

function sortedDataList() {
    let completedTodos = dataList.filter(x => x.isCompleted == true)
    let incompletedTodos = dataList.filter(x => x.isCompleted == false)
    return [...completedTodos, ...incompletedTodos]
}

// Show Completed Todos
function showCompletedTodos() {

    // Update Filter UI
    updateFilterUI("none", "inline-block", "inline-block")

    let completedTodosList = dataList.filter(x => x.isCompleted == true)

    // Refresh All Todos
    task_wrapper.innerHTML = "";

    let completed_todos_count = 0

    completedTodosList.forEach((todo) => {
        appendTaskHTML(todo)
        completed_todos_count += 1
    })

    // Set Completed Count Description
    pending_wrapper.querySelector("p").textContent = `You have ${completed_todos_count} completed tasks`

}

// Show Incompleted Todos
function showInCompletedTodos() {
    let incompletedTodosList = dataList.filter(x => x.isCompleted == false)

    // Refresh All Todos
    task_wrapper.innerHTML = "";

    let incompleted_todos_count = 0

    incompletedTodosList.forEach((todo) => {
        appendTaskHTML(todo)
        incompleted_todos_count += 1
    })

    // Set Incompleted Count Description
    pending_wrapper.querySelector("p").textContent = `You have ${incompleted_todos_count} incompleted tasks`
}

function showHomePage() {

    // Update Filter UI
    updateFilterUI()

    // Refresh Todos Desc
    pending_task = 0
    pending_wrapper.querySelector("p").textContent = `You have ${pending_task} pending tasks`

    task_wrapper.innerHTML = "";

    // getPreviousData()

    // Render Todos
    let sortedList = sortedDataList()

    sortedList.forEach((todo) => {
        appendTaskHTML(todo)

        if (!todo.isCompleted) {
            updatePendingTask(pending_task + 1)
        }

    })
}

function updateFilterUI(completedTodosDisplay = "inline-block", incompletedTodosDisplay = "none", homeDisplay = "none") {
    completed_todos_btn.style.display = completedTodosDisplay
    incompleted_todos_btn.style.display = incompletedTodosDisplay
    home_btn.style.display = homeDisplay
}