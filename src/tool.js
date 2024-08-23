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
  // tmpDiv.style.position = 'fixed';
  // tmpDiv.style.top = '200px'

  return tmpDiv;
};

const calcEmptyWidth = (style) => {
  const empty = createMeasureNode(style)
  document.body.appendChild(empty);
  const { w } = measureFontTextWH(empty, '1 2');
  const { w: w1 } = measureFontTextWH(empty, '1');
  const { w: w2 } = measureFontTextWH(empty, '2');
  document.body.removeChild(empty);
  return w - w1 - w2
}

const wordMap = new Map()

const handleSingleLine = (node, textArray, startIndex, containerWidth, emptyW) => {
  let lineInfo = {
    widthRemaining: containerWidth,
    height: 0,
    content: ''
  }

  for (let i = startIndex; i < textArray.length; i++) {
    const v = textArray[i]
    // 获取文字宽高
    let w, h
    const wordSize = wordMap.get(v)
    if (wordSize === undefined) {
      ({ w, h } = measureFontTextWH(node, v));
      wordMap.set(v, { w, h })
    } else {
      ({ w, h } = wordSize);
    }

    if (v === ' ' && textArray[i + 1] !== ' ') {
      w = emptyW
    }
    if (v === '\n') {
      console.log('1111', lineInfo.widthRemaining, w)
      lineInfo.content += v;
      lineInfo.height = Math.max(lineInfo.height, h)
      lineInfo.containerWidth = 0
      return {
        lineInfo,
        remianWordIndex: i + 1
      }
      // lineInfo = {
      //   widthRemaining: containerWidth,
      //   height: 0,
      //   content: ''
      // }
    } else if (lineInfo.widthRemaining - w >= 0) {
      console.log('222', lineInfo.widthRemaining, v, typeof v, h, w)
      lineInfo.widthRemaining -= w;
      lineInfo.content += v;
      lineInfo.height = Math.max(lineInfo.height, h)
    } else {
      console.log('33333', lineInfo.widthRemaining, v, h, w)
      // lineInfo = {
      //   widthRemaining: containerWidth - w,
      //   height: h,
      //   content: v
      // }
      return {
        lineInfo,
        remianWordIndex: i
      }
    }

    if (i === textArray.length - 1) {
      return {
        lineInfo,
        remianWordIndex: i + 1,
      }
    }
  }
}

let x = 0

const adaptLineContent = (node, textArray, startIndex, containerWidth, emptyW, result) => {
  // x += 1
  // if (x > 130) {
  //   console.log(`---------------------------${x}---------------------------`)
  //   return
  // }
  let adaptIndex = startIndex;
  console.log('adaptLineContent', node, textArray, startIndex, containerWidth, emptyW, result)
  let { lineInfo, remianWordIndex } = handleSingleLine(node, textArray, adaptIndex, containerWidth, emptyW)
  const { w: actulW, } = measureFontTextWH(node, lineInfo.content)
  console.log('actulW', lineInfo, remianWordIndex, textArray.length, actulW, containerWidth)
  if (remianWordIndex === textArray.length) {
    result.push({ content: lineInfo.content, height: lineInfo.height })
    return
  }
  let adaptContent = lineInfo.content;
  if (actulW > containerWidth) {

    for (let i = remianWordIndex; i > 0; i--) {
      adaptContent = adaptContent.substring(0, i - 1)
      const { w: adaptaW, } = measureFontTextWH(node, adaptContent)
      if (adaptaW <= containerWidth) {
        adaptIndex = i - 1
        break;
      }
    }
  } else if (actulW < containerWidth && textArray[remianWordIndex - 1] !== '\n') {
    // console.log('补充',textArray[remianWordIndex - 1] textArray, remianWordIndex)
    for (let i = remianWordIndex; i < textArray.length; i++) {
      adaptContent += textArray[i]
      const { w: adaptaW, } = measureFontTextWH(node, adaptContent)
      if (adaptaW > containerWidth) {
        adaptContent = adaptContent.substring(0, adaptContent.length - 1)
        adaptIndex = i
        break;
      }
    }
  } else {
    adaptIndex = remianWordIndex
  }
  result.push({ content: adaptContent, height: lineInfo.height })
  console.log('result', adaptIndex, textArray.length)
  if (adaptIndex < textArray.length) {
    adaptLineContent(node, textArray, adaptIndex, containerWidth, emptyW, result)
  }
  return result
}

const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  // 如果是空的话，就返回
  if (text.length === 0) return [];
  // 测量下“ ”的宽度
  const emptyW = calcEmptyWidth(textStyle)
  console.log('emptyW', emptyW)
  const node = createMeasureNode(textStyle);
  document.body.appendChild(node);
  /**
   * lineWidthLeft 本行剩余宽度
   * lineNum 行数
   * comHeight 产生各组件容器高度，默认为传入高度
   */
  const result = [];
  let com = [];
  // let splitPoint = 0;
  const textArray = text.split('');
  window.textArray = textArray

  let height = intlHeight

  const lineList = adaptLineContent(node, textArray, 0, containerWidth, emptyW, result)
  // lineList.reduce((prev, cur) => {
  //   if ()

  // }, [])

  console.log('adaptContent', lineList)

  document.body.removeChild(node);
  return [];
};

export { partSplit };

