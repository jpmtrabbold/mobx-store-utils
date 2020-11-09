import React from 'react';
import useStore from '../src/useStore'
import { observer, Observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx';
import useFormHandler from '../src/form-handlers/useFormHandler'
import FormErrorHandler from '../src/form-handlers/FormErrorHandler';
class Todo {
  constructor(text: string, done: boolean = false) {
    this.text = text
    this.done = done
    makeAutoObservable(this)
  }
  done
  text
}

class UseStoreStore {
  constructor() { makeAutoObservable(this) }
  todos = [] as Todo[]
  todoText = ""
  completedTodoText = ""
  errorHandler = new FormErrorHandler<UseStoreStore>()

  onTextKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && this.addTodo()
  
  onCompletedTextKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && this.addCompletedTodo()

  addTodo = () => this.addAnyTodo()

  addCompletedTodo = () => this.addAnyTodo(true)

  addAnyTodo = (completed = false) => {
    const property = completed ? 'completedTodoText' : 'todoText'
    this.errorHandler.resetFieldError(property)

    if (!!this[property]) {
      this.todos.push(new Todo(this[property], completed))
      this[property] = ""
    } else {
      this.errorHandler.error(property, "Description is mandatory")
    }
  }

  get todoCountDescription() {
    return `There are ${this.todos.length} todos.`
  }
  get completedTodosCountDescription() {
    return `There are ${this.todos.filter(t => t.done).length} completed todos.`
  }

}
export const UseStore = () => {
  const store = useStore(() => new UseStoreStore())
  
  // example of useFormHandler with multiple properties
  const handler = useFormHandler(store, [
    { propertyName: 'todoText', errorHandler: store.errorHandler },
    { propertyName: 'completedTodoText', errorHandler: store.errorHandler }
  ])

  return <Observer>
    {() => <>

      <handler.todoText.InputWrapper>
        <InputWithErrorField onKeyUp={store.onTextKeyUp} />
      </handler.todoText.InputWrapper>
      <button onClick={store.addTodo} >Add Todo</button>

      <br />

      <handler.completedTodoText.InputWrapper>
        <InputWithErrorField onKeyUp={store.onCompletedTextKeyUp} />
      </handler.completedTodoText.InputWrapper>
      <button onClick={store.addCompletedTodo} >Add Completed Todo</button>

      <br />

      <ul>
        {store.todos.map(t => <TodoItem todo={t} />)}
      </ul>
      <h5>{store.todoCountDescription}</h5>
      <h5>{store.completedTodosCountDescription}</h5>

    </>}
  </Observer>
};

const TodoItem = observer(({ todo }: { todo: Todo }) => {

  // example of useFormHandler with one property
  const doneHandler = useFormHandler({ store: todo, propertyName: 'done' })

  return (
    <li>
      <doneHandler.CheckboxWrapper>
        <input type='checkbox' />
      </doneHandler.CheckboxWrapper>
      {todo.text}
    </li>
  )
})

interface InputWithErrorFieldProps extends React.HTMLProps<HTMLInputElement> {
  helperText?: string // this prop is necessary for FormErrorHandler to work - works with material-ui out of the box
  error?: boolean // this prop is necessary for FormErrorHandler to work - works with material-ui out of the box
}
const InputWithErrorField = (props: InputWithErrorFieldProps) => {

  const { helperText, error, ...inputProps } = props
  const style = error ? { backgroundColor: 'red' } : {}

  return (
    <>
      {!!helperText && <h6>Error: {helperText}</h6>}
      <input {...inputProps} style={style} />
    </>
  )
}

export default {
  title: 'useStore API',
  component: useStore,
};
