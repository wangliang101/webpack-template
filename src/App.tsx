import React, { useState, lazy, Suspense } from 'react';
// import './App.css';
import './index.less';
// import TestClass from '@/components/Class';
import { TestClass, Demo1 } from '@/components';
// const LazyDemo = lazy(() => import('@/components/LazyDemo'));
// console.log('NODE_ENV', process.env.NODE_ENV);
// console.log('BASE_ENV', process.env.BASE_ENV);

// prefetch
// const PreFetchDemo = lazy(
//   () =>
//     import(
//       /* webpackChunkName: "PreFetchDemo" */
//       /*webpackPrefetch: true*/
//       '@/components/PreFetchDemo'
//     )
// );
// // preload
// const PreloadDemo = lazy(
//   () =>
//     import(
//       /* webpackChunkName: "PreloadDemo" */
//       /*webpackPreload: true*/
//       '@/components/PreloadDemo'
//     )
// );

const TODO = lazy(() => import('./page/todo'));

// const a =
//   'dssdddd12njfsdnfjnadsglasbdhgbahbsdhgf   bdshbghbadsbgasbdhgbhdasbhgbabghbhdsabdghbhbasbghdshb 散发i了你的老板娘说对方嘎嘎不回复都不会尬';
function App() {
  const [count, setCounts] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounts(e.target.value);
  };
  console.log('232323');
  // console.log('ssdsd', sdk);
  const [show, setShow] = useState(false);
  // 点击事件中动态引入css, 设置show为true
  const onClick = () => {
    import('./app.css');
    setShow(true);
  };
  return (
    <div>
      <TODO />
      <h2 onClick={onClick}>展示</h2>
      {/* show为true时加载LazyDemo组件 */}
    </div>
  );
}
export default App;
