const measureNodeWH = (node) => {
  const { width: w, height: h } = node.getBoundingClientRect()
  return { w, h };
};

const createMeasureNode = (textStyle, width) => {
  const { fontFamily = '', fontSize = '', fontWeight = '', padding } = textStyle;
  console.log('width', width)

  const tmpDiv = document.createElement('div');
  tmpDiv.style.fontFamily = fontFamily;
  tmpDiv.style.fontSize = fontSize ? fontSize + 'px' : '';
  tmpDiv.style.fontWeight = fontWeight;
  tmpDiv.style.width = `${width}px`; // 添加默认宽度
  tmpDiv.style.overflow = 'hidden';
  tmpDiv.style.whiteSpace = 'pre-wrap';
  tmpDiv.style.padding = padding ? `${padding}px` : '';
  tmpDiv.style.position = 'fixed';
  tmpDiv.style.top = '10px';
  tmpDiv.style.zIndex = 200

  return tmpDiv;
};

const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  if (text.length === 0) return [];

  const node = createMeasureNode(textStyle, containerWidth);
  document.body.appendChild(node);

  let height = intlHeight;
  let splitPoint = 0;
  let textArray = text.split('');
  const result = []

  textArray.forEach((v, i) => {
    node.textContent += v;
    let { h } = measureNodeWH(node);
    if (h > height) {
      result.push({ content: text.substr(splitPoint, i), height: height })
      height = maxHeight;
      splitPoint = i;
      node.textContent = v;
    }
    if (i + 1 === textArray.length) {
      let { h } = measureNodeWH(node);
      result.push({ content: text.substr(splitPoint, i + 1), height: h })
    }
  });

  // document.body.removeChild(node);
  return result;
};

export { partSplit };

