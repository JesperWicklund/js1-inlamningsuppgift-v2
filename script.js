const urlApi =
  "https://js1-todo-api.vercel.app/api/todos?apikey=3e02be1e-2b63-4ba8-bc9f-ca4418edf609";

const fetchData = async () => {
  try {
    const response = await fetch(urlApi);
    if (response.status !== 200) {
      throw new Error("Something went wrong: " + response.status);
    }
    const data = await response.json();
    displayData(data);

    console.log(data);
  } catch (error) {
    console.error("problem " + error);
  }
};




// Post request

document.getElementById("new-task").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputErr = document.getElementById('input-err')
  const taskInput = document.getElementById("new-task-input");
  const taskValue = taskInput.value;
  // if taskValue is not empty make a post request
  if (taskValue.trim() !== "") {
    fetch(urlApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: taskValue }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("success adding task", data);
        inputErr.style.display = 'none'
        
        const newTodo = createTodoElement(data)

        const todoContainer = document.getElementById('task-container')
        todoContainer.appendChild(newTodo)
      })
      .catch((error) => {
        console.error("Error", error);
      });
  } 
  else {
    inputErr.style.display = 'block'
  }

  taskInput.value = "";
});






// creating the elements to display data
const createTodoElement = (todo) => {
  const todoDiv = document.createElement("div");
  todoDiv.className = "task";

  const taskP = document.createElement("p");
  taskP.textContent = todo.title;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "actions";

  const checkBox = document.createElement("input");
  checkBox.name = "cb";
  checkBox.checked = todo.completed;
  checkBox.type = "checkbox";
  checkBox.className = "checkBox";

  const delBtn = document.createElement("button");
  delBtn.className = "material-symbols-outlined";
  delBtn.textContent = "Delete";

  if (todo.completed) {
    taskP.style.textDecoration = "line-through";
    taskP.style.color = "#777c81";
    delBtn.style.color = "firebrick";
  } else {
    taskP.style.textDecoration = "none";
    taskP.style.color = "";
    delBtn.style.color = "";
  }

  actionsDiv.appendChild(checkBox);
  actionsDiv.appendChild(delBtn);

  todoDiv.appendChild(taskP);
  todoDiv.appendChild(actionsDiv);



  // put request to be able to change completed status on todo to true/false
  checkBox.addEventListener("change", async () => {
    const checked = checkBox.checked;
    try {
      const res = await fetch(
        `https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=3e02be1e-2b63-4ba8-bc9f-ca4418edf609`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: checked }),
        }
      );
      const resData = await res.json();
      console.log(checked);
      if (checkBox.checked) {
        taskP.style.textDecoration = "line-through";
        taskP.style.color = "#777c81";
        delBtn.style.color = "firebrick";
      } else {
        taskP.style.textDecoration = "none";
        taskP.style.color = "";
        delBtn.style.color = "";
      }
      return resData;
    } catch (error) {}
  });



// if pressing delBtn when checkbox is unchecked display modal
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("myModal");
  const delApi = `https://js1-todo-api.vercel.app/api/todos/${todo._id}?apikey=3e02be1e-2b63-4ba8-bc9f-ca4418edf609`;
  delBtn.addEventListener("click", async () => {
    if (checkBox.checked) {
      try {
        const delRes = await fetch(delApi, {
          method: "DELETE",
        });
        if (delRes.status !== 200) {
          throw new Error("failed to delete");
        }
        todoDiv.remove();
      } catch (error) {
        console.error("Error deleting todo ", error);
      }
    } else {
      modal.style.display = "block";
    }
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  return todoDiv;
};




const displayData = (data) => {
  const todoContainer = document.querySelector("#task-container");
  data.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoContainer.appendChild(todoElement);
  });
};



fetchData();
