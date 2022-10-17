import React, { useState } from 'react';
import './App.css';
import TestClass from '@/components/Class';
import smallImage from '@/assets/images/7kb.jpeg';
import bigImage from '@/assets/images/16kb.jpeg';
// console.log('NODE_ENV', process.env.NODE_ENV);
// console.log('BASE_ENV', process.env.BASE_ENV);
function App() {
  const [count, setCounts] = useState('');
  const onChange = (e: any) => {
    setCounts(e.target.value);
  };
  return (
    <div>
      <h1>webpack5-react-ts h1</h1>
      <h2>webpack5-react-ts h2</h2>
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" />
      <TestClass />
      <img src={smallImage} alt="小于10kb的图片" />
      <img src={bigImage} alt="大于于10kb的图片" />
      <div className="smallImage"></div> {/* 小图片背景容器 */}
      <div className="bigImage"></div> {/* 大图片背景容器 */}
    </div>
  );
}
export default App;
