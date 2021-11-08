const todos = [];//localStorage read
todos.value=localStorage.getItem('todos');
console.log(todos);
const todosEl = document.getElementById('todos');
render(createTodosElements(todos), todosEl);

const addFormEl = document.getElementById('addForm');

todosEl.addEventListener('change', (e) => {
  const todoId = Number(e.target.name);
  const todoCompleted = e.target.checked;
  const todo = todos.find((todo) => todo.id === todoId);
  todo.completed = todoCompleted;
  todo.updatedAt = Date.now();

  render(createTodosElements(todos), todosEl);
});

todosEl.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn');
  if (deleteBtn) {
    const todoId = Number(deleteBtn.dataset.id);
    const todoIdx = todos.findIndex((todo) => todo.id === todoId);
    todos.splice(todoIdx, 1);
    render(createTodosElements(todos), todosEl);
  }
});

addFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const newTodo = new Todo(title);
  todos.push(newTodo);
  console.log(todos);
  render(createTodosElements(todos), todosEl);
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
  this.id = Date.now();
  this.title = title;
  this.completed = false;
  this.createdAt = Date.now();
  this.updatedAt = null;
}

function render(htmlStr, htmlNode) {
  htmlNode.innerHTML = htmlStr;
}
