let todos = [];
console.log(todos);
const todosEl = document.getElementById('todos');
getTodos();

const addFormEl = document.getElementById('addForm');

todosEl.addEventListener('change', (e) => {
  const todoId = Number(e.target.name);
  const todoCompleted = e.target.checked;
  const todo = todos.find((todo) => todo.id === todoId);
  todo.completed = todoCompleted;
  todo.updatedAt = Date.now();
  updateTodo(todo, todoId);
});

todosEl.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn');
  if (deleteBtn) {
    const todoId = Number(deleteBtn.dataset.id);
    deleteTodo(todoId);
  }
});

addFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const newTodo = new Todo(title);
  createTodo(newTodo);
  e.target.reset();
});

function createTodosElements(todos) {
  return todos.map((todo) => createTodoElement(todo)).join('') || '<h2 class="text-muted text-center">No items</h2>';
}

function createTodoElement(todo) {
  return `
    <label class="list-group-item todo">
        <input class="form-check-input me-1 todo-input" type="checkbox" value="" name="${todo.id}" ${
    todo.completed ? 'checked' : ''
  }/>
        <span>${todo.title}</span>
        <ul class="d-block text-muted small">
            <li>Created: ${new Date(todo.createdAt).toLocaleString()}</li>
            <li>Updated: ${todo.updatedAt ? new Date(todo.updatedAt).toLocaleString() : '-'}</li>
        </ul>
        <button class="btn badge bg-danger"" data-id="${todo.id}" >Delete</button>
    </label>
    `;
}

function Todo(title) {
  this.title = title;
  this.completed = false;
  this.createdAt = Date.now();
  this.updatedAt = null;
}

function render(htmlStr, htmlNode) {
  htmlNode.innerHTML = htmlStr;
}

async function getTodos() {
  try {
    const response = await fetch('//localhost:4040/todos');
    if (response.ok) {
      const data = await response.json();
      todos = data;
      render(createTodosElements(todos), todosEl);
    } else {
      throw new Error(`Request fail! ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    // alert('Sorry :( Error, try again later!')
  }
}
async function createTodo(newTodo) {
  try {
    const response = await fetch('//localhost:4040/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: {
        'content-type': 'application/json;charset=utf-8',
      },
    });
    if (response.ok) {
      const data = await response.json();
      todos.push(data);
      render(createTodosElements(todos), todosEl);
    } else {
      throw new Error(`Request fail! ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    // alert('Sorry :( Error, try again later!')
  }
}
async function deleteTodo(todoId) {
  try {
    const response = await fetch(`//localhost:4040/todos/${todoId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      todos = todos.filter((todo) => todo.id !== todoId);
      render(createTodosElements(todos), todosEl);
    } else {
      throw new Error(`Request fail! ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    // alert('Sorry :( Error, try again later!')
  }
}
async function updateTodo(updateTodoData, todoId) {
  try {
    const response = await fetch(`//localhost:4040/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateTodoData),
      headers: {
        'content-type': 'application/json;charset=utf-8',
      },
    });
    if (response.ok) {
      const data = await response.json();
      let oldTodo = todos.find((todo) => todo.id === todoId);
      oldTodo = { ...oldTodo, ...data };
      render(createTodosElements(todos), todosEl);
    } else {
      throw new Error(`Request fail! ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    // alert('Sorry :( Error, try again later!')
  }
}
