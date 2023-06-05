import React, { ChangeEvent } from 'react';
import { useBoundStore } from '../../store/zustand';
import sdk from 'SDK/Entry';
console.log(sdk);
const TODO = () => {
  // 可以从单独的store中选择状态切片，也可以从合并后的store中选择状态切片，TS会自动推断类型和提示错误
  const [user, todos, updateUser] = useBoundStore(state => [
    state.user,
    state.todos,
    state.updateUser
  ]);

  const changeUserInfo = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    updateUser({ key: e.target.name, value: e.target.value });
  };

  return (
    <div>
      <h1>用户信息</h1>
      <p>
        <label>姓名：</label>
        <input name={'username'} value={user.name} onChange={changeUserInfo} />
      </p>
      <p>年龄：{user.age}</p>
      <p>邮箱：{user.email}</p>
      <h1>待办事项列表</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text} - {todo.done ? '已完成' : '未完成'}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TODO;
