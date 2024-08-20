import React, { useState, lazy, Suspense } from 'react';
import './index.less';
import { partSplit } from './tool1';
// '阿妇女\n123';
// '网上看你付款人僧那个生日色过敏反馈；仍是；鞥谁跟谁跟健康呢个；是哪家哪家公司拟将纳入吉尼斯国内可贵\n但是v的\n121223\nsdafsf\n\n撒放难解难分';

const testStr =
  '双侧胸廓对称，右侧第4、6肋，其他骨折，第10-12胸椎，第1腰椎，左侧第3、9肋，锁骨见多处骨皮质异常。左肺上叶、右肺上叶可见多个（疑似肿块、实性结节）2.7-65.4mm，最大为一疑似肿块位于右肺上叶尖段（Img43/18）,大小约65.4mm ×55.8mm，有分叶、毛刺、胸膜凹陷，平均CT值为61HU，体积：98829.5mm³。左肺下叶可见片状磨玻璃影，体积为0.87cm³，占全肺的0.03%。左肺上叶（65/135）可见多个囊状影。右肺上叶、右肺中叶（16、49、64、70/135）可见多个条索影。各级支气管及主要分支未见明显狭窄。纵隔无偏移。冠状动脉轻度钙化，整体钙化积分：12.2；\n其中：\n左主干钙化积分：1.98\n前降支钙化积分：10.22\n回旋支钙化积分：0.0\n右冠状动脉钙化积分：0.0。右上气管旁、左下气管旁、肺门、隆突下（分组为4L、10、7、2R）可见多个肿大淋巴结，最大者（55/135）短径约为16.0mm。无胸腔积液及胸膜肥厚。';
// const testStr = `1. 左肺上叶尖后段见一实性结节（Img64/13），大小约3.9mm×2.8mm，表征：无，CT值：-382~769HU，体积：27.6mm³，恶性概率：0%, 实性占比：无。
// 2. 左肺上叶尖后段见一实性结节（Img79/16），大小约2.7mm×2.3mm，表征：无，CT值：-788~255HU，体积：6.9mm³，恶性概率：0%, 实性占比：无。
// 3. 左肺上叶尖后段见一混合磨玻璃结节（Img102/21），大小约23.9mm×21.1mm，表征：分叶、毛刺，CT值：-824~649HU，体积：3668.9mm³，恶性概率：74%, 实性占比：2.1%。
// `;
// const testStr = `1`;
const containerWidth = 800;
const intlHeight = 300;
const maxHeight = 400;
const textStyle = {
  fontSize: 14,
  fontWeight: 400,
  fontFamily: 'monospace',
  padding: 10,
};
const ret = partSplit(testStr, intlHeight, maxHeight, containerWidth, textStyle);

// const a = getActualWidthOfChars('1', textStyle);
// console.log('aaaa', a);

function App() {
  const [result] = useState(ret);
  console.log('res 22', result);
  return (
    <div>
      <div
        id="222"
        className="text-div"
        style={{
          whiteSpace: 'pre-line',
          width: '775px',
          // height: '220px',
          fontWeight: textStyle.fontWeight,
          fontSize: textStyle.fontSize,
          fontFamily: textStyle.fontFamily,
          padding: '10px',
          background: 'green',
        }}
      >
        {testStr}
      </div>
      {result.map(({ content, height }) => {
        return (
          <p>
            <div
              className="div"
              style={{
                width: `${containerWidth}px`,
                height,
                fontWeight: textStyle.fontWeight,
                fontSize: textStyle.fontSize,
                fontFamily: textStyle.fontFamily,
                whiteSpace: 'pre-line',
              }}
            >
              {content}
            </div>
          </p>
        );
      })}
      <div
        style={{
          fontWeight: textStyle.fontWeight,
          fontSize: textStyle.fontSize,
          fontFamily: textStyle.fontFamily,
          display: 'inline-block',
        }}
      >
        1
      </div>
    </div>
  );
}
export default App;
