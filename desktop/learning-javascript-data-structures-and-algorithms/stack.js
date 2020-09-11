/*
  堆栈
*/

// function Stack () {
//   let items = [];
//
//   this.push = function(element) { // 插入元素
//     items.push(element);
//   }
//
//   this.pop = function(element) { // 删除元素 并 返回所删除的元素
//       return items.pop();
//   }
//
//   this.peek = function(element) { // 栈顶元素
//       return items[items.length - 1];
//   }
//
//   this.isEmpty = function() { // 栈是否为空
//       return items.length == 0;
//   }
//
//   this.size = function() { // 栈的长度
//       return items.length;
//   }
//
//   this.clear = function() { //清空栈
//       items = [];
//   }
//
//   this.print = function() { // 打印栈
//       console.log(items.toString());
//   }
// }
//
// let stack = new Stack();
// console.log(stack.isEmpty());


class Stack {
    constructor () {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop(element) {
        return this.items.pop();
    }

    peek(element) {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }

    size() {
        return this.items.length;
    }
}

// 十进制转换任意进制

function baseConverter(decNumber, base) {
    var remStack = new Stack(),
        rem,
        baseString = '',
        digits = '0123456789ABCDEF';

    while (decNumber > 0) {
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }

    while (!remStack.isEmpty()) {
        baseString += digits[remStack.pop()];
    }

    return baseString;
}

console.log(baseConverter(12349486, 2),
baseConverter(12349486, 3),
baseConverter(12349486, 8),
baseConverter(12349486, 16))
