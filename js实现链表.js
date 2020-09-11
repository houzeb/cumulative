// Node 类
/*
element 保存节点上的数据
next保存指向下一个节点的链接
*/
function Node(element) {
	this.element = element;
	this.next = null;
}

/*
LinkedList 类
提供对链表进行操作的方法，插入，删除，查找给定值
head节点的next属性初始化为null, 当有新元素插入式，next指向新的元素
*/
function LinkedList() {
	this.head = new Node("head"); // 该链表的头对象
	this.find = find; // 查找节点
	this.insert = insert; // 插入节点
	this.remove = remove; // 删除节点
	this.display = display; // 展示链表节点
}

/*
find方法  遍历链表，查找给定数据，如果找到，返回保存该数据的节点
*/

function find(item) {
	var currentNode = this.head;
	while(currentNode.element != item) {
		currentNode = currentNode.next;
	}
	return currentNode;
}

/*
insert方法
*/
function insert(newElement, item) {
	var newNode = new Node(newElement);
	var current = this.find(item);
	newNode.next = current.next;
	current.next = newNode;
}

/*
display
*/
function display(newElement, item) {
	var currentNode = this.head;
	while(!(currentNode.next) == null) {
		print(currentNode.next.element);
		currentNode = currentNode.next;
	}

}

/*
findPrev
*/
function findPrev(item) {
	var currentNode = this.head;
	while(!(currentNode.next == null) && (currentNode.next.element != item)) {
		currentNode = currentNode.next;
	}
	return currentNode;
}

/*
remove
*/

function remove(item) {
	var prevNode = this.findPrev(item);
	if (!(prevNode.next == null)) {
		prevNode.next = prevNode.next.next;
	}
}






/*










*/