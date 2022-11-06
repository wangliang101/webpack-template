import React, { PureComponent } from 'react';

// 装饰器为,组件添加age属性
// eslint-disable-next-line @typescript-eslint/ban-types
function addName(Target: Function) {
  Target.prototype.name = 'wliang';
}
// 使用装饰圈
@addName
class TestClass extends PureComponent {
  name?: string;

  render() {
    return <h3>类组建测试---{this.name}</h3>;
  }
}

export default TestClass;
