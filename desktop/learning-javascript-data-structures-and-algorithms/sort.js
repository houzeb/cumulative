// 排序算法

// 随机生成一个范围内的整数
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 得到当前的时间戳

function getNowTime() {
    return Math.floor(new Date().getTime());
}

// 创建一个数组(列表)来表示待排序和搜索的数据结构
function ArrayList() {
    var array = [];
    this.insert = function(item) {
        array.push(item);
    }

    this.toString = function(item) {
        return array.join();
    }

    // 冒泡排序比较任何两个相邻的项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的位置，就好像气泡升至表面一样
    this.bubbleSort = function() {
        var length = array.length;
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length - 1 - i; j++) {
                if (array[j] > array[j + 1]) {
                    swap(array, j, j+1);
                }
            }
        }
    }
    var swap = function(array, index1, index2) {
        var aux = array[index1];
        array[index1] = array[index2];
        array[index2] = aux;
        // [array[index1], array[index2]] = [array[index2], array[index1]];
    }

    // 选择排序算法是一种原址比较排序算法。选择排序大致的思路是找到数据结构中最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推
    this.selectionSort = function() {
        var length = array.length, indexMin;
        for (var i = 0; i < length - 1; i++) {
            indexMin = i;
            for (var j = i; j < length; j++) {
                if (array[indexMin] > array[j]) {
                    indexMin = j;
                }
            }
            if (i !== indexMin) {
                swap(array, i, indexMin);
            }
        }
    }

    // 插入排序每次排一个数组项，一次方式构建最后的排序数组。
    // 假定第一项已经排序了，接着， 它和第二项进行比较，第二项是应该待在原位还是插到第一项之前呢?
    // 这样，头两项就已正确排序，接着和第三项比较(它是该插入到第一、第二还是第三的位置呢?)，以此类推。
    // 排序小型数组时，此算法比选择排序和冒泡排序性能要好。
    this.insertionSort = function() {
        var length = array.length, j, temp;
        for (var i = 1; i < length; i++) {
            j = i;
            temp = array[i];
            while(j > 0 && array[j - 1] > temp) {
                array[j] = array[j - 1];
                j--;
            }
            array[j] = temp;
        }
    }

    // 归并排序是第一个可以被实际使用的排序算法，复杂度为O(nlogn)
    // 归并排序是一种分支算法。其思想是原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组。
    // 由于是分治法，归并排序也是递归的
    this.mergeSort = function() {
        array = mergeSortRec(array);
    }
    var mergeSortRec = function(array) {
        var length = array.length;
        console.log('length', length, array.toString());
        if (length === 1) {
            return array;
        }
        var mid = Math.floor(length / 2)
            ,left = array.slice(0, mid)
            ,right = array.slice(mid, length);
        return merge(mergeSortRec(left), mergeSortRec(right));
    }
    var merge = function(left, right) {
        console.log(left.toString(), right.toString())
        var result = []
            ,il = 0
            ,ir = 0;
        while(il < left.length && ir < right.length) {
            if (left[il] < right[ir]) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }

        while (il < left.length) {
            result.push(left[il++]);
        }

        while (ir < right.length) {
            result.push(right[ir++]);
        }

        return result;
    }

    //
}

// 生成一个长度为size的数组
function createArray(size = 10) {
    var array = new ArrayList();
    for (var i = 0; i < size; i++) {
        array.insert(randomNumber(10, 30));
    }
    return array;
}
var num = 10;
var array = createArray(num);
console.log('bubble', array.toString(), getNowTime());
array.bubbleSort();
console.log('bubble', array.toString(), getNowTime());

var array1 = createArray(num);
console.log('selection', array1.toString(), getNowTime());
array1.selectionSort();
console.log('selection', array1.toString(), getNowTime());

var array2 = createArray(num);
console.log('insertion', array.toString(), getNowTime());
array2.insertionSort();
console.log('insertion', array.toString(), getNowTime());

var array3 = createArray(num);
console.log('merge', array.toString(), getNowTime());
array3.mergeSort();
console.log('merge', array.toString(), getNowTime());
