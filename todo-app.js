(function () {

  //===============================     Создаем ЗАГОЛОВОК   ===================

  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //===============================     Создаем ФОРМУ    =======================

  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form: form,
      input: input,
      button: button,
    };
  }

  //====================================     Создаем СПИСОК    =========================================

  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  //====================================     Создаем ЭЛЕМЕНТ списка    =================================

  function createTodoItem(name, done = false, index) {
    const item = document.createElement('li');

    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    item.textContent = name;
    // добавляем класс, если дело готово
    if (done === true) {
      item.classList.toggle('list-group-item-success');
    }

    // добавляем дата-атрибут с индексом элемента, под которым он в массиве
    item.setAttribute('data-index', index);

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item: item,
      doneButton: doneButton,
      deleteButton: deleteButton,
    }
  }

  //====================================     Кнопка ГОТОВО    =================================

  function done(element, arrayOfItems, key) {
    element.doneButton.addEventListener('click', function () {
      element.item.classList.toggle('list-group-item-success');

      // получаем значение атрибута с преобразованием в число, чтобы корректно сравнивать с индексом
      // элемента массива
      const index = parseInt(element.item.getAttribute('data-index'));
      console.log(index);

      for (let item of arrayOfItems) {
        // получаем индекс элемента массива
        const itemIndex = arrayOfItems.indexOf(item);

        console.log(itemIndex);
        console.log(item);
        console.log(item.done);

        // проверяем равенство индекса элемента массива и значения дата-атрибута дела, по кнопке
        // которого кликнули, если совпадает действуем, в зависимости от исходного значения свойства done
        // меняем его на противоположное, чтобы отмечать готовность или отменять отметку о готовности
        // и записываем измененный вариант в хранилище
        if (itemIndex === index) {

          if (item.done !== true) {
            console.log('отметили как ГОТОВО');
            item.done = true;
            arrayOfItems.splice(itemIndex, 1, item);
            localStorage.setItem(key, JSON.stringify(arrayOfItems));
          } else {
            console.log('убрали отметку готово');
            item.done = false;
            arrayOfItems.splice(itemIndex, 1, item);
            localStorage.setItem(key, JSON.stringify(arrayOfItems));
          }
        }
        console.log(item.done);
      }
    });
  }

  //====================================      Кнопка УДАЛИТЬ     ===============================

  function remove(element, arrayOfItems, key) {
    element.deleteButton.addEventListener('click', function () {
      const index = parseInt(element.item.getAttribute('data-index'));

      if (confirm('Вы уверены?')) {
        element.item.remove();

        for (let item of arrayOfItems) {
          const itemIndex = arrayOfItems.indexOf(item);

          if (itemIndex === index) {
            arrayOfItems.splice(itemIndex, 1);
            localStorage.setItem(key, JSON.stringify(arrayOfItems));
          }
        }
      }
    });
  }

  //====================================    Добавляем в ХРАНИЛИЩЕ    ============================

  function addToStorage(name, done, arrayOfItems, key) {

    arrayOfItems.push({
      name,
      done,
    });

    localStorage.setItem(key, JSON.stringify(arrayOfItems));
  }

  //====================================     Создаем ПРИЛОЖЕНИЕ   ===============================

  // В аргументе key передаем название страницы, чьи дела - мои, папы или мамы, также передаем
  // этот ключ и в функции кнопок и добавления в хранилище, чтобы все работало
  function createTodoApp(container, title = 'Список дел', key, arrayOfItems = []) {

    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.button.setAttribute('disabled', true);

    // todoItemForm.input.addEventListener('input', function () {
    //   todoItemForm.button.removeAttribute('disabled');
    //   if (!todoItemForm.input.value) {
    //     todoItemForm.button.setAttribute('disabled', true);
    //   }
    // });

    //   более лаконичная версия кода выше

    todoItemForm.input.addEventListener('input', function () {
      todoItemForm.button.toggleAttribute('disabled', !todoItemForm.input.value.trim());
    });

    const history = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : arrayOfItems;
    const obj = {};

    console.log(history);

    for (const obj of history) {

      // берем индекс объекта в массиве и передаем его в createTodoItem, чтобы задать его в
      // data-index аттрибуте у дела(элемента списка)
      const index = history.indexOf(obj);
      const itemFromStorage = createTodoItem(obj.name, obj.done, index);
      console.log(itemFromStorage);
      todoList.append(itemFromStorage.item);

      done(itemFromStorage, history, key);
      remove(itemFromStorage, history, key);
    }

    todoItemForm.form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      obj.name = todoItemForm.input.value;
      obj.done = false;

      const todoItem = createTodoItem(obj.name, obj.done);

      done(todoItem, history, key);
      remove(todoItem, history, key);

      todoList.append(todoItem.item);

      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', true);

      addToStorage(obj.name, obj.done, history, key);
    });
  }

  //===================================   Добавляем в глобальный объект, чтобы загружать с других страниц

  window.createTodoApp = createTodoApp;

})();
