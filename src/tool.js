const measureFontTextWH = (node, word) => {
  node.textContent = word;
  const { width: w, height: h } = node.getBoundingClientRect()
  // const w = node.offsetWidth;
  // const h = node.offsetHeight;
  return { w, h };
};

const createMeasureNode = (textStyle) => {
  const { fontFamily = '', fontSize = '', fontWeight = '' } = textStyle;

  const tmpDiv = document.createElement('div');
  tmpDiv.style.fontFamily = fontFamily;
  tmpDiv.style.fontSize = fontSize ? fontSize + 'px' : '';
  tmpDiv.style.fontWeight = fontWeight;
  tmpDiv.style.visibility = 'visible';
  tmpDiv.style.display = 'inline-block';
  tmpDiv.style.whiteSpace = 'nowrap';
  tmpDiv.style.position = 'fixed';

  return tmpDiv;
};

const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  if (text.length === 0) return [];

  const node = createMeasureNode(textStyle);
  console.log('node', node)
  document.body.appendChild(node);
  const { h: firstLineHeight } = measureFontTextWH(node, text[0]);
  /**
   * lineWidthLeft 本行剩余宽度
   * lineNum 行数
   * comHeight 产生各组件容器高度，默认为传入高度
   */
  let lineWidthLeft = containerWidth;
  let lineNum = 1;
  let lineHeight = 20;
  const result = [];
  let comHeight = intlHeight;
  let splitPoint = 0;
  const textArray = text.split('');
  // console.log('textArray', textArray)
  textArray.forEach((v, i) => {
    let { w, h } = measureFontTextWH(node, v);
    // if (w === 8) {
    //   w = 8.44
    // }
    // lineHeight = Math.max(lineHeight, h);
    // console.log('文本', v, w, h);

    if (v === '\n') {
      if (lineHeight * (lineNum + 1) <= comHeight) {
        lineNum += 1;
      } else {
        console.log('3333', v, lineHeight, lineNum, comHeight)
        result.push({ content: text.substr(splitPoint, i + 1), height: comHeight });
        comHeight = maxHeight;
        lineNum = 1;
        splitPoint = i + 1;
      }
      lineWidthLeft = containerWidth;
    } else if (lineWidthLeft - w < 0) {
      console.log('2222', v,)

      lineNum += 1;
      lineWidthLeft = containerWidth - w;
    } else {
      // console.log('1111', v,)
      lineWidthLeft -= w;
    }

    if (lineHeight * lineNum >= comHeight || i + 1 === textArray.length) {
      console.log('1111', i, textArray.length, v)
      result.push({ content: text.substr(splitPoint, i + 1), height: lineHeight * lineNum });
      comHeight = maxHeight;
      lineNum = 1;
      splitPoint = i + 1;
      lineWidthLeft = containerWidth;
    }
  });

  // document.body.removeChild(node);
  return result;
};

export { partSplit };

