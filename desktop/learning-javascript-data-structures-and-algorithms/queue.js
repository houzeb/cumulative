/*
队列
*/

function Queue() {
    let items = [];
    this.enqueue = function(element) { // 增加元素
        items.push(element);
    }

    this.dequeue = function(elememt) { //删除元素
        return items.shift();
    }

    this.front = function() {
        return items[0];
    }

    this.isEmpty = function() {
        return items.length === 0;
    }

    this.size = function() {
        return items.length;
    }

    this.print = function() {
        console.log(items.toString());
    }
}

/*
优先队列
设置优先级，然后在正确的位置上添加元素
或 用入列操作添加元素，然后按照优先级移除
*/

function PriorityQueue() {
    let items = [];
    function QueueElement (element, priority) {
        this.element = element;
        this.priority = priority;
    }

    this.enqueue = function(element, priority) {
        let queueElement = new QueueElement(element, priority);

        let added = false;
        for (let i = 0; i < items.length; i++) {
            if (queueElement.priority < item[i].priority) {
                items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if (!added) {
            items.push(queueElement);
        }
    }

    this.print = function() {
        for (let i = 0; i < items.length; i++) {
            console.log(`${items[i].element} - ${items[i].priority}`);
        }
    }

    // 其他方法不变
}


/*
循环队列 -- 击鼓传花

孩子们围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈结束游戏。
重复这个过程，直到只剩一个孩子(胜者)
*/
function hotPotato(nameList, num) {
    let queue = new Queue();

    for (let i = 0; i < nameList.length; i++) {
        queue.enqueue(nameList[i]);
    }

    let eliminated = '';
    while(queue.size() > 1) {
        for(let i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }
        eliminated = queue.dequeue();
        queue.print();
        console.log(eliminated + '在击鼓传花游戏中被淘汰。');
    }
    return queue.dequeue();
}
let names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
let winner = hotPotato(names, 7);
