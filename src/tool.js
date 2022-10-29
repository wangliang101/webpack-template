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
  const node = createMeasureNode(textStyle);
  document.body.appendChild(node);
};

export { partSplit };
