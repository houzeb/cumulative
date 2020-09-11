/*
树
一个数结构包含一系列存在父子关系的节点。每个节点都有一个父节点(除了顶部的第一个节点)以及零个或多个子节点
位于树顶部的节点叫做根节点
节点的一个属性是深度，节点的深度取决于它的祖先节点的数量

树的高度取决于所有节点深度的最大值
*/

/*
二叉树
二叉树节点最多只能有两个字节点：一个是左侧子节点，另一个右侧子节点
二叉搜索树(BST)Binary-Search-Tree是二叉树的一种，它只允许左侧节点存储比父节点小的值，在右侧节点存储比父节点大(或等于)的值
*/

function BinarySearchTree() {
    var Node = function(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    };
    var root = null;

    //  插入新的节点
    var insertNode = function(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                insertNode(node.right, newNode);
            }
        }
    };
    // 搜索节点
    var searchNode = function(node, key) {
        if (node == null) return false;
        if (node.key === key) {
            return true;
        } else if (node.key > key) {
            return searchNode(node.left, key);
        } else {
            return searchNode(node.right, key);
        }
    }

    // 中序遍历
    var inOrderTraverse = function(node, callback) {
        if (node !== null) {
            inOrderTraverse(node.left, callback);
            callback(node.key);
            inOrderTraverse(node.right, callback);
        }
    }

    // 先序遍历
    var preOrderTraverse = function(node, callback) {
        if (node !== null) {
            callback(node.key);
            preOrderTraverse(node.left, callback);
            preOrderTraverse(node.right, callback);
        }
    }

    // 后序遍历
    var postOrderTraverse = function(node, callback) {
        if (node !== null) {
            preOrderTraverse(node.left, callback);
            preOrderTraverse(node.right, callback);
            callback(node.key);
        }
    }

    // 最小数
    var minNode = function(node) {
        if (node) {
            while(node && node.left ! == null) {
                node = node.left;
            }
            return node.key;
        }
        return null;
    }

    // 最大数
    var maxNode = function(node) {
        if (node) {
            while(node && node.right !== null) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    }

    var findMinNode = function(node) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node;
    }

    // 删除一个节点
    var removeNode = function(node, key) {
        if (node === null) {
            return null;
        }
        if (key < node.key) {
            node.left = removeNode(node.left, key);
            return node;
        } else if (key > node.key) {
            node.right = removeNode(node.right, key);
            return ndoe;
        } else {
            // 第一种情况---一个叶节点
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            // 第二种情况---一个只有一个子节点的节点
            if (node.left === null) {
                node = node.right;
                return node;
            } else if (node.right === null) {
                node = node.left;
                return node;
            }
            // 第三种情况---一个有两个子节点的节点
            var aux = findMinNode(node.right);
            node.key = aux.key;
            node.right = removeNode(node.right, aux.key);
            return node;
        }
    }

    // 向树中插入一个新的键
    this.insert = function(key) {
        let newNode = new Node(key);
        if (root == null) {
            root = newNode;
        } else {
            insertNode(root, newNode);
        }
    }

    // 在树中查找一个键，如果节点存在， 返回true， 反之， 返回false
    this.search = function(key) {
        return searchNode(root, key);
    }

    // 通过中序遍历方式遍历所有节点
    this.inOrderTraverse = function(callback) {
        inOrderTraverse(root, callback);
    }

    // 通过先序遍历方式遍历所有节点
    this.preOrderTraverse = function(callback) {
        preOrderTraverse(root, callback);
    }

    // 通过后序遍历方式遍历所有节点
    this.postOrderTraverse = function(callback) {
        postOrderTraverse(root, callback);
    }

    // 返回树中最小的值/键
    this.min = function() {
        return minNode(root);
    }

    // 返回树中最大的值/键
    this.max = function() {
        return maxNode(root);
    }

    // 从树中移除某个键
    this.remove = function(key) {
        root = removeNode(root, key);
    }
}

/*
自平衡树
BST存在一个问题:取决于你添加的节点数，树的一条边可能会非常深;
树的一条分支会有很多层，而其他的分支却只有几层
为解决此问题
出现  自平衡二叉搜索树(AVL)Adelson-Velskii-Landi
*/

// 计算平衡因子
// 计算节点的高度
var heightNode = function (node) {
    if (node === null) {
        return -1;
    } else {
        return Math.max(heightNode(node.left), heightNode(node.right)) + 1;
    }
}

/*
AVL旋转
向AVL树插入节点时，可以执行单旋转或双旋转两种平衡操作，分别对应四种场景
右-右(RR): 向左的单旋转
左-左(LL): 向右的单旋转
左-右(LR): 向右的双旋转
右-左(RL): 向左的双旋转
*/

// 右-右(RR): 向左的单旋转
var rotationRR = function(node) {
    var tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
}

// 左-左(LL): 向右的单旋转
var rotationLL = function(node) {
    var tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
}

// 左-右(LR): 向右的双旋转
var rotationLR = function(node) {
    node.left = rotationRR(node.left);
    return rotationLL(node);
}

// 右-左(RL): 向左的双旋转
var rotationRL = function(node) {
    node.right = rotationLL(node.right);
    return rotationRR(node);
}


// AVL树插入或移除节点和BST完全相同。然而，AVL的不同之处在于需要校验它的平衡因子
var insertNode = function(node, element) {
    if (node === null) {
        node = new Node(element);
    } else if (element < node.key) {
        node.left = insertNode(node.left, element);
        if (node.left !== null) {
            // 确认是否需要平衡
            if ((heightNode(node.left) - heightNode(node.right)) > 1) {
                // 旋转
                if (element < node.left.key) {
                    node = rotationLL(node);
                } else {
                    node = rotationLR(node);
                }
            }
        }
    } else if (element > node.key) {
        node.right = insertNode(node.right, element);
        if (node.right !== null) {
            // 确认是否需要平衡
            if ((heightNode(node.right) - heightNode(node.left)) > 1) {
                // 旋转
                if (element > node.right.key) {
                    node = rotationRR(node);
                } else {
                    node = rotationRL(node);
                }
            }
        }
    }
    return node;
}
