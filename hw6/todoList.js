$('.todo-input .fa-plus').click(
  e => addTodo(e)
);

$('.todo-input > input').keypress(
  e => {
    if (e.key !== 'Enter') return;
    addTodo(e);
  }
);

const addTodo = e => {
  const todo = $('.todo-input > input').val();
  if (todo.length === 0) return;
  e.preventDefault();
  todoList.add(new ToDoItem(todo));
  $('.todo-input > input').val('');
  reloadList();
};

const reloadList = () => {
  $('.todo-list').empty();
  todoList.list.map(
    todo => $('.todo-list').append(
      `
          <div class="todo-item">
            <div class="todo-text ${todo.done && 'done'}">
              ${todo.todo}
            </div>
            <i class="fas fa-check" key=${todo.key}></i>
            <i class="far fa-trash-alt" key=${todo.key}></i>
          </div>
        `
    )
  );
  $('.todo-item .fa-check').click(e => {
    const key = e.target.getAttribute('key');
    const todo = todoList.getTodo(key);
    if (todo.done) todoList.undo(key);
    else todoList.do(key);
    reloadList();
  });
  $('.todo-item .fa-trash-alt').click(e => {
    const key = e.target.getAttribute('key');
    todoList.remove(key);
    reloadList();
  });
};

class ToDoItem {
  static keyGenerator = 0;
  constructor(todo) {
    this._key = ToDoItem.keyGenerator++;
    this._todo = todo;
    this._done = false;
  }
  get key() {
    return this._key;
  }
  get todo() {
    return this._todo;
  }
  get done() {
    return this._done;
  }
  do() {
    this._done = true;
    return this;
  }
  undo() {
    this._done = false;
    return this;
  }
}

class ToDoList {
  constructor() {
    this._todoList = [];
  }
  get list() {
    return this._todoList;
  }
  getTodo(key) {
    return this._todoList.find(
      todo => todo.key == key
    );
  }
  add(todo) {
    this._todoList.push(todo);
  }
  remove(key) {
    this._todoList = this._todoList.filter(
      todo => todo.key != key
    );
  }
  do(key) {
    this._todoList = this._todoList.map(
      todo => todo.key == key ? todo.do() : todo
    );
  }
  undo(key) {
    this._todoList = this._todoList.map(
      todo => todo.key == key ? todo.undo() : todo
    );
  }
}

const todoList = new ToDoList();