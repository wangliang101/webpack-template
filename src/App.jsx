import React, { useState, lazy, Suspense } from 'react';
import './index.less';
import { partSplit, setCursorPosition, getSelectionTopPosition } from './tool2';

const measureNodeWH = (node) => {
  const { width: w, height: h } = node.getBoundingClientRect();
  // const w = node.offsetWidth;
  // const h = node.offsetHeight;
  return { w, h };
};

function measureTextWidth(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = '14px monospace';
  return context.measureText(text).width;
}

const getActualWidthOfChars = (text, options = {}) => {
  const { size = 14, family = 'monospace' } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${size}px ${family}`;
  const metrics = ctx.measureText(text);
  const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
  return Math.max(metrics.width, actual);
};

// '阿妇女\n123';
// '网上看你付款人僧那个生日色过敏反馈；仍是；鞥谁跟谁跟健康呢个；是哪家哪家公司拟将纳入吉尼斯国内可贵\n但是v的\n121223\nsdafsf\n\n撒放难解难分';

const testStr = `1. 左肺上叶尖后段见一实性结节（Img16/7），大小约3.3mm×3.2mm，表征：无，CT值：-775~148HU，体积：31.1mm³，恶性概率：0%, 实性占比：无。
2. 左肺上叶尖后段见一混合磨玻璃结节（Img30/12），大小约8.2mm×5.0mm，表征：无，CT值：-489~222HU，体积：118.2mm³，恶性概率：61%, 实性占比：53.3%。
3. 左肺上叶尖后段见一实性结节（Img38/16），大小约4.4mm×3.6mm，表征：无，CT值：-507~308HU，体积：40.5mm³，恶性概率：0%, 实性占比：无。
4. 左肺上叶前段见一实性结节（Img41/17），大小约3.3mm×2.3mm，表征：无，CT值：-627~133HU，体积：16.8mm³，恶性概率：0%, 实性占比：无。
5. 左肺上叶尖后段见一实性结节（Img49/20），大小约3.1mm×2.6mm，表征：无，CT值：-630~189HU，体积：20.8mm³，恶性概率：0%, 实性占比：无。
6. 左肺上叶前段见一混合磨玻璃结节（Img54/22），大小约6.2mm×5.5mm，表征：无，CT值：-680~260HU，体积：144.9mm³，恶性概率：0%, 实性占比：22.7%。
7. 左肺上叶前段见一实性结节（Img54/22），大小约3.9mm×2.6mm，表征：无，CT值：-573~178HU，体积：33.1mm³，恶性概率：0%, 实性占比：无。
8. 左肺上叶尖后段见一纯磨玻璃结节（Img58/24），大小约4.8mm×3.2mm，表征：无，CT值：-798~-427HU，体积：51.4mm³，恶性概率：4%, 实性占比：无。
9. 左肺上叶尖后段见一实性结节（Img61/25），大小约2.4mm×2.0mm，表征：无，CT值：-474~49HU，体积：10.9mm³，恶性概率：0%, 实性占比：无。
10. 左肺上叶上舌段见一纯磨玻璃结节（Img65/26），大小约5.5mm×3.9mm，表征：无，CT值：-823~-253HU，体积：63.3mm³，恶性概率：10%, 实性占比：0.0%。
11. 左肺上叶上舌段见一纯磨玻璃结节（Img67/27），大小约4.3mm×2.8mm，表征：无，CT值：-752~-396HU，体积：32.6mm³，恶性概率：16%, 实性占比：无。
12. 左肺上叶上舌段见一混合磨玻璃结节（Img68/28），大小约6.2mm×5.6mm，表征：无，CT值：-589~210HU，体积：138.9mm³，恶性概率：61%, 实性占比：40.8%。
13. 左肺上叶上舌段见一实性结节（Img71/29），大小约8.8mm×7.3mm，表征：无，CT值：-445~253HU，体积：272.4mm³，恶性概率：58%, 实性占比：60.7%。
14. 左肺上叶下舌段见一实性结节（Img79/32），大小约2.5mm×1.6mm，表征：无，CT值：-717~-58HU，体积：4.9mm³，恶性概率：0%, 实性占比：无。
15. 左肺上叶下舌段见一实性结节（Img82/33），大小约3.3mm×2.5mm，表征：无，CT值：-737~184HU，体积：18.8mm³，恶性概率：0%, 实性占比：无。
16. 左肺上叶下舌段见一实性结节（Img100/40），大小约4.0mm×3.7mm，表征：无，CT值：-412~377HU，体积：48.4mm³，恶性概率：0%, 实性占比：无。
17. 左肺下叶背段见一实性结节（Img62/25），大小约4.9mm×2.6mm，表征：无，CT值：-734~200HU，体积：49.9mm³，恶性概率：0%, 实性占比：无。
18. 左肺下叶背段见一混合磨玻璃结节（Img62/25），大小约6.3mm×4.6mm，表征：无，CT值：-604~90HU，体积：73.7mm³，恶性概率：44%, 实性占比：16.9%。
19. 左肺下叶外基底段见一实性结节（Img65/26），大小约4.0mm×1.7mm，表征：无，CT值：-731~-109HU，体积：9.9mm³，恶性概率：0%, 实性占比：无。
20. 左肺下叶后基底段见一实性结节（Img73/30），大小约3.6mm×2.9mm，表征：无，CT值：-823~-41HU，体积：30.2mm³，恶性概率：0%, 实性占比：无。
21. 左肺下叶后基底段见一实性结节（Img74/30），大小约4.2mm×2.8mm，表征：无，CT值：-774~140HU，体积：30.2mm³，恶性概率：0%, 实性占比：无。
22. 左肺下叶后基底段见一混合磨玻璃结节（Img79/32），大小约6.9mm×6.3mm，表征：无，CT值：-568~254HU，体积：268.5mm³，恶性概率：0%, 实性占比：37.6%。
23. 左肺下叶外基底段见一实性结节（Img82/33），大小约3.7mm×2.5mm，表征：无，CT值：-736~-82HU，体积：34.1mm³，恶性概率：10%, 实性占比：无。
24. 左肺下叶外基底段见一实性结节（Img85/34），大小约6.0mm×3.8mm，表征：无，CT值：-447~256HU，体积：110.2mm³，恶性概率：3%, 实性占比：53.3%。
25. 左肺下叶外基底段见一实性结节（Img84/34），大小约2.6mm×2.1mm，表征：无，CT值：-579~-113HU，体积：7.4mm³，恶性概率：0%, 实性占比：无。
26. 左肺下叶后基底段见一纯磨玻璃结节（Img85/34），大小约5.8mm×4.6mm，表征：无，CT值：-746~-200HU，体积：116.7mm³，恶性概率：52%, 实性占比：0.0%。
27. 左肺下叶外基底段见一混合磨玻璃结节（Img90/36），大小约6.1mm×5.0mm，表征：无，CT值：-499~281HU，体积：127.6mm³，恶性概率：64%, 实性占比：42.1%。
28. 左肺下叶后基底段见一实性结节（Img90/36），大小约4.5mm×3.6mm，表征：无，CT值：-581~136HU，体积：51.9mm³，恶性概率：0%, 实性占比：无。
29. 左肺下叶外基底段见一混合磨玻璃结节（Img90/36），大小约7.2mm×4.8mm，表征：无，CT值：-530~163HU，体积：104.8mm³，恶性概率：52%, 实性占比：30.1%。
30. 左肺下叶后基底段见一混合磨玻璃结节（Img96/39），大小约5.6mm×4.0mm，表征：无，CT值：-731~168HU，体积：72.7mm³，恶性概率：0%, 实性占比：11.0%。
31. 左肺下叶后基底段见一混合磨玻璃结节（Img96/39），大小约5.6mm×4.5mm，表征：无，CT值：-653~147HU，体积：87.0mm³，恶性概率：4%, 实性占比：10.8%。
32. 左肺下叶后基底段见一实性结节（Img96/39），大小约4.9mm×3.9mm，表征：无，CT值：-575~69HU，体积：39.6mm³，恶性概率：0%, 实性占比：无。
33. 左肺下叶外基底段见一实性结节（Img97/39），大小约3.9mm×3.6mm，表征：无，CT值：-345~235HU，体积：43.5mm³，恶性概率：0%, 实性占比：无。
34. 左肺下叶后基底段见一实性结节（Img105/42），大小约22.2mm×12.3mm，表征：无，CT值：-176~441HU，体积：2520.9mm³，恶性概率：70%, 实性占比：95.4%。
35. 左肺下叶后基底段见一实性结节（Img106/43），大小约6.3mm×4.3mm，表征：无，CT值：-495~268HU，体积：98.9mm³，恶性概率：0%, 实性占比：42.2%。
36. 右肺上叶尖段见一实性结节（Img23/10），大小约2.7mm×2.2mm，表征：无，CT值：-730~112HU，体积：8.9mm³，恶性概率：0%, 实性占比：无。
37. 右肺上叶尖段见一疑似肿块（Img43/18），大小约65.4mm×55.8mm，表征：分叶、毛刺、胸膜凹陷，CT值：-55~1327HU，体积：98829.5mm³，恶性概率：52%, 实性占比：100.0%。
38. 右肺上叶尖段见一实性结节（Img34/14），大小约4.3mm×2.7mm，表征：无，CT值：-654~269HU，体积：36.1mm³，恶性概率：0%, 实性占比：无。
39. 右肺上叶尖段见一实性结节（Img43/18），大小约8.4mm×7.4mm，表征：分叶，CT值：-327~316HU，体积：321.4mm³，恶性概率：56%, 实性占比：76.1%。
40. 右肺上叶前段见一实性结节（Img50/20），大小约29.6mm×18.0mm，表征：分叶、毛刺，CT值：-57~427HU，体积：3418.2mm³，恶性概率：79%, 实性占比：100.0%。
41. 右肺上叶后段见一实性结节（Img54/22），大小约7.2mm×6.4mm，表征：无，CT值：-420~291HU，体积：193.8mm³，恶性概率：0%, 实性占比：74.0%。
42. 右肺上叶前段见一实性结节（Img57/23），大小约2.6mm×2.1mm，表征：无，CT值：-753~-87HU，体积：16.8mm³，恶性概率：0%, 实性占比：无。
43. 右肺中叶外段见一实性结节（Img60/24），大小约2.1mm×1.6mm，表征：无，CT值：-718~-46HU，体积：7.9mm³，恶性概率：0%, 实性占比：无。
44. 右肺中叶外段见一实性结节（Img63/26），大小约3.5mm×2.8mm，表征：无，CT值：-640~122HU，体积：27.7mm³，恶性概率：0%, 实性占比：无。
45. 右肺中叶外段见一实性结节（Img64/26），大小约3.9mm×3.7mm，表征：无，CT值：-596~150HU，体积：40.5mm³，恶性概率：0%, 实性占比：无。
46. 右肺中叶内段见一实性结节（Img65/26），大小约4.5mm×3.0mm，表征：无，CT值：-740~107HU，体积：43.5mm³，恶性概率：10%, 实性占比：无。
47. 右肺下叶背段见一实性结节（Img41/17），大小约4.8mm×4.6mm，表征：无，CT值：-570~224HU，体积：70.2mm³，恶性概率：1%, 实性占比：无。
48. 右肺下叶背段见一实性结节（Img45/18），大小约4.5mm×3.7mm，表征：无，CT值：-707~328HU，体积：90.5mm³，恶性概率：0%, 实性占比：无。
49. 右肺下叶背段见一混合磨玻璃结节（Img59/24），大小约4.6mm×4.2mm，表征：无，CT值：-556~139HU，体积：88.0mm³，恶性概率：1%, 实性占比：无。
50. 右肺下叶背段见一实性结节（Img59/24），大小约4.0mm×3.3mm，表征：无，CT值：-352~383HU，体积：36.6mm³，恶性概率：0%, 实性占比：无。
51. 右肺下叶背段见一实性结节（Img59/24），大小约2.7mm×1.8mm，表征：无，CT值：-485~544HU，体积：6.9mm³，恶性概率：30%, 实性占比：无。
52. 右肺下叶背段见一实性结节（Img59/24），大小约2.6mm×2.5mm，表征：无，CT值：-784~-98HU，体积：15.3mm³，恶性概率：0%, 实性占比：无。
53. 右肺下叶背段见一实性结节（Img61/25），大小约4.1mm×3.7mm，表征：无，CT值：-464~374HU，体积：55.4mm³，恶性概率：0%, 实性占比：无。
54. 右肺下叶背段见一实性结节（Img63/26），大小约3.0mm×2.7mm，表征：无，CT值：-594~29HU，体积：20.3mm³，恶性概率：0%, 实性占比：无。
55. 右肺下叶前基底段见一混合磨玻璃结节（Img70/28），大小约10.4mm×7.8mm，表征：分叶、毛刺，CT值：-600~116HU，体积：372.3mm³，恶性概率：64%, 实性占比：10.3%。
56. 右肺下叶后基底段见一实性结节（Img72/29），大小约5.1mm×3.9mm，表征：无，CT值：-502~96HU，体积：112.2mm³，恶性概率：0%, 实性占比：20.6%。
57. 右肺下叶前基底段见一实性结节（Img79/32），大小约2.6mm×2.4mm，表征：无，CT值：-565~323HU，体积：24.2mm³，恶性概率：0%, 实性占比：无。
58. 右肺下叶后基底段见一实性结节（Img84/34），大小约2.5mm×1.9mm，表征：无，CT值：-517~23HU，体积：11.9mm³，恶性概率：0%, 实性占比：无。
59. 右肺下叶外基底段见一实性结节（Img85/34），大小约3.9mm×3.1mm，表征：无，CT值：-648~-39HU，体积：59.3mm³，恶性概率：0%, 实性占比：无。
60. 右肺下叶后基底段见一实性结节（Img86/35），大小约3.8mm×2.7mm，表征：无，CT值：-651~202HU，体积：48.4mm³，恶性概率：0%, 实性占比：无。
61. 右肺下叶后基底段见一纯磨玻璃结节（Img87/35），大小约4.1mm×3.3mm，表征：无，CT值：-650~-125HU，体积：48.0mm³，恶性概率：25%, 实性占比：无。
62. 右肺下叶后基底段见一实性结节（Img87/35），大小约3.2mm×2.4mm，表征：无，CT值：-561~-4HU，体积：31.6mm³，恶性概率：0%, 实性占比：无。
63. 右肺下叶外基底段见一混合磨玻璃结节（Img92/37），大小约8.3mm×5.8mm，表征：无，CT值：-451~254HU，体积：277.3mm³，恶性概率：50%, 实性占比：59.5%。
64. 右肺下叶前基底段见一实性结节（Img94/38），大小约8.6mm×7.7mm，表征：无，CT值：-270~375HU，体积：548.8mm³，恶性概率：31%, 实性占比：89.4%。
65. 右肺下叶前基底段见一实性结节（Img96/39），大小约4.1mm×3.6mm，表征：无，CT值：-588~109HU，体积：55.4mm³，恶性概率：0%, 实性占比：无。
66. 右肺斜裂见一叶间裂结节（Img39/16），大小约4.2mm×3.4mm，表征：无，CT值：-674~166HU，体积：46.0mm³，恶性概率：0%, 实性占比：无。
67. 右肺斜裂见一叶间裂结节（Img68/28），大小约5.3mm×3.1mm，表征：无，CT值：-737~196HU，体积：57.3mm³，恶性概率：0%, 实性占比：9.1%。
`;
// const testStr =
//   '双侧胸廓对称，右侧第4、6肋，其他骨折，第10-12胸椎，第1腰椎，左侧第3、9肋，锁骨见多处骨皮质异常。左肺上叶、右肺上叶可见多个（疑似肿块、实性结节）2.7-65.4mm，最大为一疑似肿块位于右肺上叶尖段（Img43/18）,大小约65.4mm ×55.8mm，有分叶、毛刺、胸膜凹陷，平均CT值为61HU，体积：98829.5mm³。左肺下叶可见片状磨玻璃影，体积为0.87cm³，占全肺的0.03%。左肺上叶（65/135）可见多个囊状影。右肺上叶、右肺中叶（16、49、64、70/135）可见多个条索影。各级支气管及主要分支未见明显狭窄。纵隔无偏移。冠状动脉轻度钙化，整体钙化积分：12.2；\n其中：\n左主干钙化积分：1.98\n前降支钙化积分：10.22\n回旋支钙化积分：0.0\n右冠状动脉钙化积分：0.0。右上气管旁、左下气管旁、肺门、隆突下（分组为4L、10、7、2R）可见多个肿大淋巴结，最大者（55/135）短径约为16.0mm。无胸腔积液及胸膜肥厚。';
// const testStr = `1. 左肺上叶尖后段见一实性结节（Img64/13），大小约3.9mm×2.8mm，表征：无，CT值：-382~769HU，体积：27.6mm³，恶性概率：0%, 实性占比：无。
// 2. 左肺上叶尖后段见一实性结节（Img79/16），大小约2.7mm×2.3mm，表征：无，CT值：-788~255HU，体积：6.9mm³，恶性概率：0%, 实性占比：无。
// 3. 左肺上叶尖后段见一混合磨玻璃结节（Img102/21），大小约23.9mm×21.1mm，表征：分叶、毛刺，CT值：-824~649HU，体积：3668.9mm³，恶性概率：74%, 实性占比：2.1%。
// `;
// const testStr = `1. 左肺上叶尖后段见一实性结节（Img64/13），大小约3.9mm×2.8mm，表征：无，CT值：-382~769HU，体积：27.6mm³，恶性概率：0%, 实性占比：无。
// 2. 左肺上叶尖后段见一`;
// const testStr = `1`;
const containerWidth = 775;
const intlHeight = 300;
const maxHeight = 400;
const textStyle = {
  fontSize: 14,
  // fontWeight: 400,
  fontFamily: 'monospace',
  containerWidth: `775px`,
  // padding: 10,
};
console.time('xxx');
const ret = partSplit(testStr, intlHeight, maxHeight, containerWidth, textStyle);
console.timeEnd('xxx');
// const a = getActualWidthOfChars('1', textStyle);
// console.log('aaaa', a);
let i = 0;
function App() {
  const [result] = useState(ret);
  console.log('res 22', result);
  return (
    <div>
      <button
        onClick={() => {
          const { w, h } = measureNodeWH(document.getElementById('222'));
          console.log('w', w, 'h', h);
        }}
        style={{ position: 'fixed', top: '10px', right: '10px' }}
      >
        测量node宽高
      </button>
      <button
        onClick={() => {
          const node = document.getElementById('text-div');
          node.focus;
          setCursorPosition(node, i);
          const top = getSelectionTopPosition();
          console.log('uuu', top, i);
          i++;
        }}
        style={{ position: 'fixed', top: '50px', right: '10px' }}
      >
        测量node宽高x
      </button>
      <button
        onClick={() => {
          const emptyStringWidth = getActualWidthOfChars('3. 左');
          console.log(emptyStringWidth);
        }}
        style={{ position: 'fixed', top: '80px', right: '10px' }}
      >
        测量node宽高2
      </button>
      <div
        id="222"
        className="text-div"
        style={{
          whiteSpace: 'pre-line',
          width: `${containerWidth}px`,
          height: '300px',
          fontWeight: textStyle.fontWeight,
          fontSize: textStyle.fontSize,
          fontFamily: textStyle.fontFamily,
          // padding: '10px',
          background: 'green',
          wordBreak: 'break-all',
          overflow: 'hidden',
          // lineBreak: 'anywhere',
        }}
        dangerouslySetInnerHTML={{ __html: testStr }}
      />
      {result.map(({ content, height }) => {
        return (
          <p>
            <div
              className="div"
              style={{
                width: `${containerWidth}px`,
                height,
                // fontWeight: textStyle.fontWeight,
                fontSize: textStyle.fontSize,
                fontFamily: textStyle.fontFamily,
                whiteSpace: 'pre-line',
                // padding: '10px',
              }}
            >
              {content}
            </div>
          </p>
        );
      })}
    </div>
  );
}
export default App;
