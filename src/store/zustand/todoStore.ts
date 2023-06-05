import { StateCreator } from 'zustand';
// import { StateCreator } from 'zustand/types';
import { produce } from 'immer';
import { useBoundStore } from './index';
import { TodoStore, Todo, UserStore } from './types';

export const creatTodoSlice: StateCreator<TodoStore & UserStore, [], [], TodoStore> = (
  set,
  get
) => ({
  // 待办事项列表
  todos: [
    { id: 1, text: '学习React', done: false },
    { id: 2, text: '学习Zustand', done: false },
    { id: 3, text: '学习Immer', done: false }
  ],
  // 添加待办事项的异步操作
  addTodo: async (text: string) => {
    // 模拟异步验证
    const valid = await validate(text, get().todos);
    if (valid) {
      // 使用immer的produce函数来修改状态
      set(
        produce(draft => {
          draft.todos.push({ id: Date.now(), text, done: false });
        })
      );
      // 引用userStore的updateUser方法，修改用户年龄
      // creatUserSlice.getState().updateUser({ age: Math.floor(Math.random() * 100) });
      useBoundStore.getState().updateUser({ age: Math.floor(Math.random() * 100) });
    } else {
      // 抛出错误信息
      throw new Error('输入无效或重复');
    }
  },
  // 删除待办事项的操作
  deleteTodo: (id: number) => {
    set(
      produce(draft => {
        // 使用数组的filter方法来删除指定id的待办事项
        draft.todos = draft.todos.filter((todo: Todo) => todo.id !== id);
      })
    );
  },
  // 编辑待办事项的异步操作
  editTodo: async (id: number, text: string) => {
    // 模拟异步验证
    const valid = await validate(text, get().todos);
    if (valid) {
      set(
        produce(draft => {
          // 使用数组的find方法来找到指定id的待办事项，并修改其text属性
          const todo = draft.todos.find((todo: Todo) => todo.id === id);
          if (todo) {
            todo.text = text;
          }
        })
      );
      // 引用userStore的updateUser方法，修改用户邮箱
      // creatUserSlice.getState().updateUser({ email: `${text}@example.com` });
      useBoundStore.getState().updateUser({ email: `${text}@example.com` });
    } else {
      // 抛出错误信息
      throw new Error('输入无效或重复');
    }
  },
  // 完成待办事项的操作
  toggleTodo: (id: number) => {
    set(
      produce(draft => {
        // 使用数组的find方法来找到指定id的待办事项，并修改其done属性
        const todo = draft.todos.find((todo: Todo) => todo.id === id);
        if (todo) {
          todo.done = !todo.done;
        }
      })
    );
  }
});

// 模拟异步验证函数，检查输入的文本是否为空或重复
const validate = (text: string, todos: Todo[]) =>
  new Promise<boolean>(resolve => {
    setTimeout(() => {
      if (!text || todos.some(todo => todo.text === text)) {
        resolve(false);
      } else {
        resolve(true);
      }
    }, 1000);
  });
