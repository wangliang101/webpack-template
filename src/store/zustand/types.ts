// 定义待办事项的接口
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// 定义待办事项store的接口
export interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => Promise<void>;
  // deleteTodo: (id: number) => void;
  // editTodo: (id: number, text: string) => Promise<void>;
  // toggleTodo: (id: number) => void;
}

// 定义用户信息的接口
interface User {
  name: string;
  age: number;
  email: string;
}

// 定义用户store的接口
export interface UserStore {
  user: User;
  updateUser: (data: Partial<User>) => void;
}
