import React, { useState, lazy, Suspense } from 'react';
// import './App.css';
import './index.less';
// import TestClass from '@/components/Class';
import { TestClass, Demo1 } from '@/components';
// const LazyDemo = lazy(() => import('@/components/LazyDemo'));
// console.log('NODE_ENV', process.env.NODE_ENV);
// console.log('BASE_ENV', process.env.BASE_ENV);

// prefetch
const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /*webpackPrefetch: true*/
      '@/components/PreFetchDemo'
    )
);
// preload
const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /*webpackPreload: true*/
      '@/components/PreloadDemo'
    )
);

// const a =
//   'dssdddd12njfsdnfjnadsglasbdhgbahbsdhgf   bdshbghbadsbgasbdhgbhdasbhgbabghbhdsabdghbhbasbghdshb 散发i了你的老板娘说对方嘎嘎不回复都不会尬';
function App() {
  const [count, setCounts] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCounts(e.target.value);
  };

  const [show, setShow] = useState(false);
  // 点击事件中动态引入css, 设置show为true
  const onClick = () => {
    import('./app.css');
    setShow(true);
  };
  return (
    <div>
      <h2 onClick={onClick}>展示</h2>
      {/* show为true时加载LazyDemo组件 */}
      {show && (
        <>
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
          <Suspense fallback={null}>
            <PreFetchDemo />
          </Suspense>
        </>
      )}
      {/* {show && (
        <Suspense fallback={null}>
          <LazyDemo />
        </Suspense>
      )} */}
      <Demo1 />
      <h1>webpack5-react-ts h1</h1>
      {/* <h2>webpack5-react-ts h2</h2> */}
      <p>受控组件dd</p>
      <input type='text' value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type='text' />
      <TestClass />
      <div className='smallImage'> 色发夹三大纪律给你阿斯顿那首歌被老爸说过话</div>{' '}
      {/* 小图片背景容器 */}
    </div>
  );
}
export default App;
