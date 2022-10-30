const measureFontTextWH = (node, word) => {
  node.textContent = word;
  const w = node.offsetWidth;
  const h = node.offsetHeight;

  return { w, h };
};

const createMeasureNode = (textStyle) => {
  const fontFamily = textStyle.fontFamily ? textStyle.fontFamily : '';
  const fontSize = textStyle.fontSize ? textStyle.fontSize + 'px' : '';
  const fontWeight = textStyle.fontWeight ? textStyle.fontWeight : '';

  const tmpDiv = document.createElement('div');
  tmpDiv.style.fontFamily = fontFamily;
  tmpDiv.style.fontSize = fontSize;
  tmpDiv.style.fontWeight = fontWeight;
  tmpDiv.style.visibility = 'hidden';
  tmpDiv.style.display = 'inline-block';
  tmpDiv.style.whiteSpace = 'nowrap';

  return tmpDiv;
};

const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  if (text.length === 0) return [];

  const node = createMeasureNode(textStyle);
  document.body.appendChild(node);
  const textList = text.split('\n');
  // {w, h}
  const { h: firstLineHeight } = measureFontTextWH(node, text[0]);
  // console.log(firstWH);
  // let
  // textList.reduce((item, i) => {
  //   item

  // }, []);
  //
  /**
   * lineWidthLeft 本行剩余宽度
   * lineNum 行数
   * comHeight 产生各组件容器高度，默认为传入高度
   */
  let lineWidthLeft = containerWidth;
  let lineNum = 1;
  let lineHeight = firstLineHeight;
  const result = [];
  let comHeight = intlHeight;
  let splitPoint = 0;
  text.split('').forEach((v, i) => {
    const { w, h } = measureFontTextWH(node, v);
    console.log('文本', v, w, h);
    if (v === '\n') {
      console.log('换行', lineHeight * lineNum, comHeight);
      if (lineHeight * (lineNum + 1) < comHeight) {
        lineNum += 1;
      } else {
        result.push({ content: text.substr(splitPoint, i + 1), height: lineHeight * lineNum });
        comHeight = maxHeight;
        lineNum = 1;
        splitPoint = i + 1;
      }
      lineWidthLeft = containerWidth;
    }

    if (lineWidthLeft - w <= 0) {
      lineNum += 1;
      lineWidthLeft = containerWidth - w;
    } else {
      lineWidthLeft -= w;
    }

    if (i + 1 === text.split('').length) {
      console.log('结束了');
      result.push({ content: text.substr(splitPoint, i), height: lineHeight * lineNum });
    }

    // 超过容器高度，新增容器
    if (lineHeight * lineNum >= comHeight) {
      console.log('默认组件装不下了', lineHeight, lineNum);
      result.push({ content: text.substr(splitPoint, i + 1), height: lineHeight * lineNum });
      comHeight = maxHeight;
      lineNum = 1;
      splitPoint = i + 1;
    }
  });
  console.log('result', result);

  document.body.removeChild(node);
  return result;
};

export { partSplit };
