import { StateCreator } from 'zustand';
import { produce } from 'immer';
import { TodoStore, Todo, UserStore } from './types';

// 创建用户store
export const creatUserSlice: StateCreator<TodoStore & UserStore, [], [], UserStore> = set => ({
  user: {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  },
  // 修改用户信息的操作
  updateUser: data => {
    set(
      produce(draft => {
        // 使用对象的assign方法来合并新的数据
        const { key, value } = data;
        draft.user[key] = value;
        // Object.assign(draft.user, data);
      })
    );
  }
});
