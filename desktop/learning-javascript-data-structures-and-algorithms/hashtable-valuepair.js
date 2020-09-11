/*
散列表 解决冲突方法1 分离链接
*/

// 引入链表
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


function HashTable () {
    var table = [];

    // 散列函数
    var loseloseHashCode = function (key) {
        var hash = 0;
        for (var i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        }
        return hash % 37;
    }

    var ValuePair = function(key, value) {
        this.key = key;
        this.value = value;

        this.toString = function() {
            return '[' + this.key + ' - ' + this.value + ']';
        }
    }

    // 向散列表增加一个新的项
    this.put = function() {
        var position = loseloseHashCode(key);
        if (table[position] == undefined) {
            table[position] = new LinkedList();
        }
        table[position].append(new ValuePair(key, value));
    }

    // 返回根据键值检索到的特定的值
    this.get = function(key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined) {
            // 遍历链表来寻找键/值
            var current = table[position].getHead();

            while(current.next) {
                if (current.element.key === key) {
                    return current.element.value;
                }
                current = current.next;
            }

            // 检查元素在链表第一个或最后一个节点的情况
            if (current.element.key === key) {
                return current.element.value;
            }
        }
        return undefined;
    }

    // 根据键值从散列表中移除值
    this.remove = function(key) {
        var position = loseloseHashCode(key);

        if (table[position] !== undefined) {
            var current = table[position].getHead();
            while (current.next) {
                if (current.element.key === key) {
                    table[position].remove(current.element);
                    if (table[position].isEmpty()) {
                        table[position] = undefined;
                    }
                    return true;
                }
                current = current.next;
            }
            // 检查是否为第一个或最后一个元素
            if (current.element.key === key) {
                table[position].remove(current.element);
                if (table[position].isEmpty()) {
                    table[position] = undefined;
                }
                return true;
            }
        }
        return false;
    }

    // 打印
    this.print = function() {
        for (var i = 0; i < table.length; ++i) {
            if (table[i] !== undefined) {
                console.log(i + ': ' + table[i]);
            }
        }
    }
}

var hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');

console.log(hash.get('Gandalf'));
console.log(hash.get('Loiane'));
hash.print();
