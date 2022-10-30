import React, { useState, lazy, Suspense } from 'react';
import './index.less';
import { partSplit } from './tool';
// '阿妇女\n123';
// '网上看你付款人僧那个生日色过敏反馈；仍是；鞥谁跟谁跟健康呢个；是哪家哪家公司拟将纳入吉尼斯国内可贵\n但是v的\n121223\nsdafsf\n\n撒放难解难分';

const testStr = '尼斯国内可贵\n但是v的\n尼斯国内可贵\n但是v的\n撒放难解难分';
const containerWidth = 100;
const intlHeight = 100;
const maxHeight = 200;
const textStyle = {
  fontSize: 14,
  fontWeight: 400,
  fontFamily: 'monospace',
};
const ret = partSplit(testStr, intlHeight, maxHeight, containerWidth, textStyle);

function App() {
  const [result] = useState(ret);
  console.log('res 22', result);
  return (
    <div>
      <textarea id="222" className="text-div">
        {testStr}
      </textarea>
      {result.map(({ content, height }) => {
        return (
          <p>
            <textarea
              className="div"
              style={{
                width: `${containerWidth}px`,
                height,
                fontWeight: textStyle.fontWeight,
                fontSize: textStyle.fontSize,
                fontFamily: textStyle.fontFamily,
              }}
            >
              {content}
            </textarea>
          </p>
        );
      })}
    </div>
  );
}
export default App;
