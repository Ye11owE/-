// 获取按钮元素
const myButton1 = document.getElementById('btn_select');
const myButton2 = document.getElementById('btn_start');

// 按钮点击事件处理函数
function buttonClickHandler() {
  alert('按钮被点击了！');
  // 在这里可以执行其他操作
}

// 为按钮添加点击事件处理函数
myButton1.addEventListener('click', buttonClickHandler);
myButton2.addEventListener('click', buttonClickHandler);
