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
  tmpDiv.style.top = '200px'

  return tmpDiv;
};

const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  if (text.length === 0) return [];

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
  let curLine = {
    widthRemaining: containerWidth,
    height: 0,
    content: ''
  }
  let height = intlHeight
  textArray.forEach((v, i) => {
    let { w, h } = measureFontTextWH(node, v);
    if(w===0) w=8.4296875;
    if(v === '\n'){
      console.log('1111',curLine.widthRemaining ,w)

      curLine.content += v;
      curLine.height = Math.max(curLine.height, h)
      result.push(curLine)
      curLine = {
        widthRemaining: containerWidth,
        height: 0,
        content: ''
      }
      return
    }else if(curLine.widthRemaining - w >= 0){
      console.log('222',curLine.widthRemaining ,v,typeof v,h,w)
      curLine.widthRemaining -= w;
      curLine.content += v;
      curLine.height = Math.max(curLine.height, h)
    }else{
      console.log('33333',curLine.widthRemaining ,v,h,w)
      result.push(curLine)
      curLine = {
        widthRemaining: containerWidth - w,
        height: h,
        content: v
      }
      // https://chatgpt.com/share/e632537c-e9af-4894-8a36-674f6aca9c34
    }
  });
  let comIndex = 0
  result.forEach(line => {
    if(height - line.height < 0){
      comIndex++;
      height = maxHeight - line.height;
      com[comIndex] = [line]
    }else{
      height -= line.height
      if(com[comIndex] === undefined){
        com[comIndex] = [line]
      }else{
        com[comIndex].push(line)
      }
    }
  })
  console.log('result', result,com)
  // document.body.removeChild(node);
  return result;
};

export { partSplit };

