/*
散列表
*/

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

    // 更好的散列函数
    /*
    初始化一个hash变量并赋值为一个质数(大多数实现都使用5381)，
    然后 迭代参数key，将hash与33相乘(用来当作一个魔力数)，并和当前迭代到的字符的ASCII 码值相加
    最后，将相加的和与另一个随机质数(比我们认为的散列表的大小要大)相除的余数。
    */
    var djb2HashCode = function (key) {
        var hash = 5381;
        for (var i = 0; i < key.length; i++) {
            hash = hash * 33 + key.charCodeAt(i);
        }
        return hash % 1013;
    }

    // 向散列表增加一个新的项
    this.put = function(key, value) {
        var position = loseloseHashCode(key);
        console.log(position + ' - ' + key);
        table[position] = value;
    }

    // 返回根据键值检索到的特定的值
    this.get = function(key) {
        return table[loseloseHashCode(key)];
    }

    // 根据键值从散列表中移除值
    this.remove = function(key) {
        table[loseloseHashCode(key)] = undefined;
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


/*
存储值时很容易出现相同坐标 值冲突 的情况
处理冲突有几种方法 分离链接、线性探查、双散列法
*/

/*
分离链接 valuePair
为散列表的每一个位置创建一个链表并将元素存储在里面
需要额外的存储空间
*/
