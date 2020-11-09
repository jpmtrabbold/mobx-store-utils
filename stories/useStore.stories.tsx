import React from 'react';
import useStore from '../src/useStore'
import { Observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx';
import FormInputHandler from '../src/form-handlers/FormInputHandler'

class Todo {
  constructor(text: string, done: boolean = false) {
    this.text = text
    this.done = done
    makeAutoObservable(this)
  }
  done
  text
}

export const UseStore = (props: { sentence: string }) => {

  // this store could be an external class instead, as the Todo class is
  const store = useStore((sp) => ({
    todos: [] as Todo[],
    todoText: "",
    todoTextHandler: new FormInputHandler(() => ({ store, propertyName: 'todoText' })),
    onTextKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && store.addTodo(),
    addTodo: () => {
      if (!!store.todoText) {
        store.todos.push(new Todo(store.todoText))
        store.todoText = ""
      }
    },
    get todoCountDescription() {
      return `There are ${store.todos.length} todos.`
    },
    get completedTodosCountDescription() {
      return `There are ${store.todos.filter(t => t.done).length} completed todos.`
    },
  }), props)

  
  return <Observer>
    {() => <>
      <input {...store.todoTextHandler.inputProps} onKeyUp={store.onTextKeyUp}></input>
      (hit ENTER to add todo)
      <ul>
        {store.todos.map(t => (
          <li>
            <input type='checkbox' checked={t.done} onChange={e => t.done = e.target.checked} />
            {t.text}
          </li>
        ))}
      </ul>
      <h5>{store.todoCountDescription}</h5>
      <h5>{store.completedTodosCountDescription}</h5>
    </>}
  </Observer>
};

export default {
  title: 'useStore API',
  component: useStore,
};
