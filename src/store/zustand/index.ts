import { create } from 'zustand';
import { creatUserSlice } from './userStore';
import { creatTodoSlice } from './todoStore';
import { TodoStore, UserStore } from './types';

// 合并两个store，并指定类型参数为两个store接口的交叉类型（可以添加更多的类型）

const useBoundStore = create<UserStore & TodoStore>()((...a) => ({
  ...creatUserSlice(...a),
  ...creatTodoSlice(...a)
}));

export { useBoundStore };

// export { useUserStore, useTodoStore, useBoundStore };
