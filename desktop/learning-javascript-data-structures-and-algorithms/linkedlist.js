/*
单链表
*/

function LinkedList() {
    let Node = function(element) {
        this.element = element;
        this.next = null;
    }

    let length = 0;
    let head = null;

    // 向列表尾部添加一个新的项
    this.append = function(element) {
        let node = new Node(element),
        current;
        if (head === null) {
            head = node;
        } else {
            current = head;

            while(current.next) {
                current = current.next;
            }

            current.next = node;
        }
        length++;
    };

    // 向列表的特定位插入一个新的项
    this.insert = function(position, element) {
        // 检查越界值
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                current = head,
                previous,
                index = 0;
            if (position === 0) { // 在第一个位置添加
                node.next = current;
                head = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            length++;
            return true;
        } else {
            return false;
        }
    };

    // 从列表中的特定位置移除一项
    this.removeAt = function(position) {
        // 检查越界值
        if (position > -1 && position < length) {
            let current = head,
            previous,
            index = 0;

            //移除第一项
            if (position == 0) {
                head = current.next;
            } else {
                while(index++ < position) { // 找到当前元素的位置
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            length--;
            return current.element;
        } else {
            return null;
        }
    };

    // 从列表中移除一项
    this.remove = function(element) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    };

    // 返回元素在列表中的索引。如果列表中没有该元素则返回-1
    this.indexOf = function(element) {
        let current = head,
        index = -1;

        while (current) {
            index++;
            if (element === current.element) {
                return index;
            }
            current = current.next;
        }
        return -1;
    };

    // 如果链表中不包含任何元素 返回true 如果链表长度大于0 返回false
    this.isEmpty = function() {
        return length === 0;
    };

    // 返回链表中包含的元素个数
    this.size = function() {
        return length;
    };

    // 得到头部元素
    this.getHead = function() {
        return head;
    };

    // 由于列表项使用了Node类，需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值
    this.toString = function() {
        let current = head,
            string = '';

            while (current) {
                string += current.element + (current.next ? ',' : '');
                current = current.next;
            }
            return string;
    };

    // 打印链表
    this.print = function() {};
}

let linkedlist = new LinkedList();
linkedlist.append(1);
linkedlist.append(2);
linkedlist.append(3);
linkedlist.append(4);
linkedlist.append(5);

console.log(linkedlist.indexOf(1));


/*
双向链表
*/
function DoublyLinkedList () {
    let Node = function (element) {
        this.element = element;
        this.next = null;
        this.prev = null;
    }

    let length = 0;
    let head = null; //头
    let tail = null; //尾

    this.insert = function (position, element) {
        // 检查越界值
        if (position >= 0 && position <= length) {
            let node = new Node(element)
                ,current = head
                ,previous
                ,index = 0;

            if (position === 0) {
                if (!head) {
                    head = node;
                    tail = node;
                } else {
                    node.next = current;
                    current.prev = node;
                    head = node;
                }
            } eles if (position === length) {
                current = tail;
                current.next = node;
                node.prev = current;
                tail = node;
            } else {
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;

                current.prev = node;
                node.prev = previous;
            }
            length++;
            return true;
        } else {
            return false;
        }
    }

    this.removeAt = function (position) {
        // 检查越界值
        if (position > -1 && position < length) {
            let current = head
                ,previous
                ,index = 0;

            // 移除第一项
            if (position === 0) {
                head = current.next;

                // 如果只有一项，更新tail
                if (length === 1) {
                    tail = null;
                } else {
                    head.prev = null;
                }
            } else if (position === length - 1) {
                current = tail;
                tail = current.prev;
                tail.next = null;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }

                previous.next = current.next;
                current.next.prev = previous;
            }
            length--;

            return current.element;
        } else {
            return null;
        }
    }
}

/*
循环链表
*/

function CircularLinkedList () {

}


// 是否为回文
function numberReverse(num) {
    if (num == undefined) return false;
    if (num < 0) return false;
    if (num == 0) return true;
    if (num % 10 === 0) return false;
    var current = num;
    var count = 0;
    while(current != 0) {
        count = count * 10 + current % 10;
        current = Math.floor(current / 10);
    }
    if (num !== count)  return false;
    return true;
}
