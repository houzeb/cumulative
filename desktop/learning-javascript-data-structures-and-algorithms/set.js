/*
集合
*/

function Set() {
    let items = {};

    // 如果值在集合中，返回true， 否则返回false
    this.has = function(value) {
        // return value in items;
        return items.hasOwnProperty(value);
    }

    // 向集合添加一个新的项
    this.add = function(value) {
        if (!this.has(value)) {
            items[value] = value;
            return true;
        }
        return false;
    }

    // 从集合移除一个值
    this.remove = function(value) {
        if (this.has(value)) {
            delete items[value];
            return true;
        }
        return false;
    }

    this.delete = function(value) {
        if (this.has(value)) {
            delete items[value];
            return true;
        }
        return false;
    }

    // 移除集合中的所有项
    this.clear = function() {
        items = {};
    }

    // 返回集合所包含元素的数量(现代浏览器)
    this.size = function() {
        return Object.keys(items).length;
    }

    // 所有浏览器都支持
    this.sizeLegacy = function() {
        let count = 0;
        for(let key in items) {
            if (items.hasOwnProperty(key)) {
                ++count;
            }
        }
        return count;
    }

    // 返回一个包含集合中所有值的数组
    this.values = function() {
        // return Object.values(items);
        let values = [];
        for (let i = 0, keys = Object.keys(items); i < keys.length; i++) {
            values.push(items[keys[i]]);
        }
        return values;
    }

    this.valuesLegacy = function () {
        let value = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                values.push(items[key]);
            }
        }
        return values;
    }

    // 集合 的 并集
    this.union = function(otherSet) {
        let unionSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }

        values = otherSet.values();

        for (let i = 0; i < values.length; i++) {
            unionSet.add(values[i]);
        }

        return unionSet;
    }

    // 集合 的 交集
    this.intersection = function(otherSet) {
        let intersectionSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (otherSet.has(values[i])) {
                intersectionSet.add(values[i]);
            }
        }

        return intersectionSet;
    }

    // 集合 的 差集
    this.difference = function(otherSet) {
        let differenceSet = new Set();

        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                differenceSet.add(values[i]);
            }
        }

        return differenceSet;
    }

    // 集合 的 子集
    this.subset = function(otherSet) {
        if (this.size() > otherSet.size()) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                if (!otherSet.has(vlaues[i])) {
                    return false;
                }
            }
            return true;
        }
    }
}
