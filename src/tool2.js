
const measurNodeWH = (node, word) => {
  node.textContent = word;
  const { width: w, height: h } = node.getBoundingClientRect()
  return { w, h };
};


const createMeasureNode = (textStyle) => {
  const { fontFamily = '', fontSize = '', fontWeight = '', containerWidth } = textStyle;

  const tmpDiv = document.createElement('div');
  tmpDiv.style.fontFamily = fontFamily;
  tmpDiv.style.fontSize = fontSize ? fontSize + 'px' : '';
  tmpDiv.style.fontWeight = fontWeight;
  tmpDiv.style.visibility = 'visible';
  tmpDiv.style.display = 'inline-block';
  tmpDiv.style.width = containerWidth;
  tmpDiv.style.wordBreak = 'break-all'
  tmpDiv.style.whiteSpace = 'pre-line'
  tmpDiv.contentEditable = true
  // tmpDiv.id = 'text-div';
  // tmpDiv.style.background = 'orange'
  // tmpDiv.style.position = 'fixed';
  // tmpDiv.style.top = '200px'
  return tmpDiv;
};

function setCursorPosition(element, position) {
  // 确保元素是可编辑的
  if (!element.isContentEditable) {
    console.error('Element is not contenteditable');
    return;
  }

  // 创建一个范围对象
  const range = document.createRange();
  const sel = window.getSelection();

  // 尝试设置光标位置
  try {
    if (element.childNodes.length > 0) {
      // 如果元素有子节点,我们需要找到正确的文本节点和位置
      let currentPos = 0;
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          const nodeLength = node.textContent.length;
          if (currentPos + nodeLength >= position) {
            range.setStart(node, position - currentPos);
            range.setEnd(node, position - currentPos);
            break;
          }
          currentPos += nodeLength;
        } else {
          // 如果不是文本节点,我们简单地跳过它
          // 注意:这可能不适用于所有情况,特别是对于复杂的HTML结构
          currentPos += node.textContent.length;
        }
      }
    } else {
      // 如果元素没有子节点,我们可以直接设置范围
      range.setStart(element, 0);
      range.setEnd(element, 0);
    }

    // 清除所有现有的选择
    sel.removeAllRanges();
    // 将新的范围添加到选择中
    sel.addRange(range);
  } catch (e) {
    console.error('Error setting cursor position:', e);
  }
}

function getSelectionTopPosition() {
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    console.warn("No selection range available.");
    return null;
  }

  const range = selection.getRangeAt(0);
  const { top } = range.getBoundingClientRect();


  return { top };
}
const partSplit = (text, intlHeight, maxHeight, containerWidth, textStyle) => {
  // 如果是空的话，就返回
  if (text.length === 0) return [];
  const node = createMeasureNode(textStyle);
  const textAdapt = text.replaceAll(" ", "&nbsp")
  node.innerHTML = textAdapt;
  document.body.appendChild(node);
  // 分行
  let lineTextList = []
  node.focus()
  setCursorPosition(node, 0)
  let { top: preTop } = getSelectionTopPosition();
  let preIndex = 0
  for (let i = 1; i < text.length; i++) {
    setCursorPosition(node, i)
    const { top } = getSelectionTopPosition();
    if (top !== preTop) {
      lineTextList.push(text.substring(preIndex, i - 1))
      preIndex = i - 1;
      preTop = top
    }
    if (i === text.length - 1) {
      lineTextList.push(text.substring(preIndex, i - 1))
      // console.log('xxxxx', text.substring(preIndex, i), top, bottom, i, text[i])
    }
  }
  node.blur()
  // 测量每行高度
  const lineList = lineTextList.reduce((acc, cur) => {
    const { h } = measurNodeWH(node, cur)
    acc.push({ content: cur, height: h })
    return acc
  }, [])
  // 分组件
  const result = [];
  let com = { content: '', height: 0 };
  let height = intlHeight;
  for (let i = 0; i < lineList.length; i++) {
    if (height - lineList[i].height >= 0) {
      height -= lineList[i].height;
      com.content += lineList[i].content
      com.height += lineList[i].height
    } else {
      result.push(com)
      com = { content: lineList[i].content, height: lineList[i].height };
      height = maxHeight - lineList[i].height
    }
    if (i === lineList.length - 1) {
      result.push(com)
    }
  }
  document.body.removeChild(node);
  return result;
};

export { partSplit, setCursorPosition, getSelectionTopPosition };

