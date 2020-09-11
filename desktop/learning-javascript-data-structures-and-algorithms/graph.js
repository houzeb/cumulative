/*
图
网络结构的抽象模型
图是一组由边连接的节点(或顶点)
一个顶点的度是其相邻顶点的数量
如果每两个顶点间都存在路径，则该图是连通的

图可以是无向的(边没有方向)或是有向的(有向图)
如果图中每两个顶点间在双向上都存在路径，则该图是强连通的
*/

/*
图的表示
邻接矩阵  邻接表  关联矩阵
*/

// 字典为辅助类
function Dictionary() {
    var items = {};

    // 如果某个键值存在于这个字典中，返回true ，反之返回false
    this.has = function(key) {
        return key in items;
    }

    // 向字典中添加新元素
    this.set = function(key, value) {
        items[key] = value;
    }

    // 通过使用键值来从字典中移除键值对应的数据值
    this.delete = function(key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    }

    // 通过键值查找特定的数值并返回
    this.get = function(key) {
        return this.has(key) ? items[key] : undefined;
    }

    // 将这个字典中的所有元素全部删除
    this.clear = function() {
        this.items = {};
    }

    // 返回字典所包含元素的数量
    this.size = function() {
        return Object.keys(items).length;
    }

    // 将字典所包含的所有键名以数组形式返回
    this.keys = function() {
        return Object.keys(items);
    }

    // 将字典所包含的所有数值以数组形式返回
    this.values = function() {
        var values = [];
        for (var k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    }

    this.getItems = function() {
        return items;
    }
}

// 队列
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

// 栈
function Stack() {
    let items = [];

    this.push = function(element) { // 插入元素
        items.push(element);
    }

    this.pop = function(element) { // 删除元素 并 返回所删除的元素
        return items.pop();
    }

    this.peek = function(element) { // 栈顶元素
        return items[items.length - 1];
    }

    this.isEmpty = function() { // 栈是否为空
        return items.length == 0;
    }

    this.size = function() { // 栈的长度
        return items.length;
    }

    this.clear = function() { //清空栈
        items = [];
    }

    this.print = function() { // 打印栈
        console.log(items.toString());
    }
}

function Graph() {
    var vertices = [];
    var adjList = new Dictionary();

    var INF = Number.MAX_SAFE_INTEGER;

    this.addVertex = function(v) { // 向途中添加一个新的顶点
        vertices.push(v);
        adjList.set(v, []);
    }

    this.addEdge = function(v, w) {
        adjList.get(v).push(w);
        adjList.get(w).push(v);
    }

    this.toString = function() {
        var s = '';
        for (var i = 0; i < vertices.length; i++) {
            s += vertices[i] + ' -> ';
            var neighbors = adjList.get(vertices[i]);
            for (var j = 0; j < neighbors.length; j++) {
                s += neighbors[j] + ' ';
            }
            s += '\n';
        }
        return s;
    }
    /*
    图的遍历
    1 广度优先搜索(Breadth-First Search, BFS)
    数据结构为队列，，通过将顶点存入队列中，最先入队列的顶点先被探索

    2 深度优先搜索(Depth-First Search, DFS)
    数据结构为栈，，通过将顶点存入栈中，顶点是沿着路径被探索的，存在新的相邻顶点就去访问

    图遍历可以用来寻找特定的顶点或寻找两个顶点之间的路径，检查图是否连通，检查图是否含有环等
    图遍历算法的思想是必须追踪每个第一次访问的节点，并且追踪有哪些节点还没有被访问过的顶点，将其标注为被发现的，并将其加进待访问顶点列表中
    */

    // 广度优先搜索算法会从指定的第一个顶点开始遍历图，先访问其所有的相邻点，就像一次访问图的一层。也就是先宽后深地访问顶点。
    var initializeColor = function() {
        var color = [];
        for (var i = 0; i < vertices.length; i++) {
            color[vertices[i]] = 'white';
        }
        return color;
    };

    this.bfs = function(v, callback) {
        var color = initializeColor(),
            queue = new Queue();
        queue.enqueue(v);

        while (!queue.isEmpty()) {
            var u = queue.dequeue(),
                neighbors = adjList.get(u);
            color[u] = 'grey';
            for (var i = 0; i < neighbors.length; i++) {
                var w = neighbors[i];
                if (color[w] === 'white') {
                    color[w] = 'grey';
                    queue.enqueue(w);
                }
            }
            color[u] = 'black';
            if (callback) {
                callback(u);
            }
        }
    };

    // 改进后的BFS  寻找最短路径
    //对于给定顶点v，广度优先算法会访问所有与其距离为1的顶点，接着是距离为2的顶点， 以此类推
    this.BFS =  function(v) {
        var color = initializeColor()
            ,queue = new Queue()
            ,d = []
            ,pred = [];
        queue.enqueue(v);
        for (var i = 0; i < vertices.length; i++) {
            d[vertices[i]] = 0;
            pred[vertices[i]] = null;
        }

        while(!queue.isEmpty()) {
            var u = queue.dequeue()
                ,neighbors = adjList.get(u);
            color[u] = 'grey';
            for (var i = 0; i < neighbors.length; i++) {
                var w = neighbors[i];
                if (color[w] === 'white') {
                    color[w] = 'grey';
                    d[w] = d[u] + 1;
                    pred[w] = u;
                    queue.enqueue(w);
                }
            }
            color[u] = 'black';
        }
        return {
            distances: d,
            predecessors: pred
        };
    };

    // 深度优先搜索算法将会从第一个指定的顶点开始遍历图，沿着路径知道这条路径最后一个顶点被访问了，接着原路回退并探索下一条路径。也就是说，它是先深度后广度地访问顶点。
    this.dfs = function(callback) {
        var color = initializeColor();
        for (var i = 0; i < vertices.length; i++) {
            if (color[vertices[i]] === 'white') {
                dfsVisit(vertices[i], color, callback);
            }
        }
    }

    var dfsVisit = function(u, color, callback) {
        color[u] = 'grey';
        if (callback) {
            callback(u);
        }
        var neighbors = adjList.get(u);
        for (var i = 0; i < neighbors.length; i++) {
            var w = neighbors[i];
            if (color[w] === 'white') {
                dfsVisit(w, color, callback);
            }
        }
        color[u] = 'black';
    }

    // 改进后的DFS算法
    var time = 0;
    this.DFS = function() {
        var color = initializeColor()
            ,d = []
            ,f = []
            ,p = []
            ,time = 0;

        for (var i = 0; i < vertices.length; i++) {
            f[vertices[i]] = 0;
            d[vertices[i]] = 0;
            p[vertices[i]] = null;
        }
        for (i = 0; i < vertices.length; i++) {
            if (color[vertices[i]] === 'white') {
                DFSVisit(vertices[i], color, d, f, p);
            }
        }
        return {
            discovery: d,
            finished: f,
            predecessors: p
        };
    };

    var DFSVisit = function(u, color, d, f, p) {
        console.log('discovered ' + u);
        color[u] = 'grey';
        d[u] = ++time;
        var neighbors = adjList.get(u);
        for (var i = 0; i < neighbors.length; i++) {
            var w = neighbors[i];
            if (color[w] === 'white') {
                p[w] = u;
                DFSVisit(w, color, d, f, p);
            }
        }
        color[u] = 'black';
        f[u] = ++time;
        console.log('explored ' + u);
    }

    // 最短路径算法 1 Dijkstra 算法 2 Floyd-Warshall算法
    this.graph = [
        [0, 2, 4, 0, 0, 0],
        [0, 0, 1, 4, 2, 0],
        [0, 0, 0, 0, 3, 0],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 3, 0, 2],
        [0, 0, 0, 0, 0, 0]
    ];
    // Dijkstra算法是一种计算从单个源到所有其他源的最短路径的贪心算法。
    // 可以用来计算从图的一个顶点到其余各顶点的最短路径
    this.dijkstra = function(src) {
        var dist = []
            ,visited = []
            ,length = this.graph.length;

        for (var i = 0; i < length; i++) {
            dist[i] = INF;
            visited[i] = false;
        }
        dist[src] = 0;
        for (var i = 0; i < length - 1; i++) {
            var u = minDistance(dist, visited);
            visited[u] = true;
            for (var v = 0; v < length; v++) {
                if (
                    !visited[v] &&
                    this.graph[u][v] != 0 &&
                    dist[u] != INF &&
                    dist[u] + this.graph[u][v] < dist[v]
                ) {
                    dist[v] = dist[u] + this.graph[u][v];
                }
            }
        }
        return dist;
    }

    var minDistance = function(dist, visited) {
        var min = INF, minIndex = -1;
        for (var v = 0; v < dist.length; v++) {
            if (visited[v] == false && dist[v] <= min) {
                min = dist[v];
                minIndex = v;
            }
        }
        return minIndex;
    }

    // Floyd-Warshall算法是一种计算途中所有最短路径的动态规划算法。通过该算法，可以找出从所有源到所有顶点的最短路径
    this.floydWarshall = function() {
        var dist = []
            ,length = this.graph.length
            ,i, j, k;

        for (i = 0; i < length; i++) {
            dist[i] = [];
            for (j = 0; j < length; j++) {
                dist[i][j] = this.graph[i][j];
            }
        }

        for (k = 0; k < length; k++) {
            for (i = 0; i < length; i++) {
                for (j = 0; j < length; j++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    }


    // 最小生成树(MST) 1 Prim算法  2 Kruskal算法
    // Prim算法是一种求解加权无向连通图的MST问题的贪心算法。
    // 它能找出一个边的子集，使得其构成的树包含图中所有顶点，且边的权值之和最小
    this.prim = function() {
        var parent = []
            ,key = []
            ,visited = []
            ,length = this.graph.length
            ,i;
        for (i = 0; i < length; i++) {
            key[i] = INF;
            visited[i] = false;
        }
        key[0] = 0;
        parent[0] = -1;
        for (i = 0; i < length - 1; i++) {
            var u = minDistance(key, visited);
            visited[u] = true;

            for (var v = 0; v < length; v++) {
                if (
                    this.graph[u][v] &&
                    visited[v] == false &&
                    this.graph[u][v] < key[v]
                ) {
                    parent[v] = u;
                    key[v] = this.graph[u][v];
                }
            }
        }
        return parent;
    };

    // Kruskal算法也是一种求加权无向连通图的MST的贪心算法
    this.kruskal = function() {
        var length = this.graph.length
            ,parent = []
            ,cost
            ,ne = 0, a, b, u, v, i, j, min;
        cost = initializeCost();

        while(ne < length - 1) {
            for (i = 0; min = INF; i < length; i++) {
                for (j = 0; j < length; j++) {
                    if (cost[i][j] < min) {
                        min = cost[i][j];
                        u = i;
                        v = j;
                    }
                }
            }
            u = find(u, parent);
            v = find(v, parent);

            if (union(u, v, parent)) {
                ne++;
            }

            cost[u][v] = cost[v][u] = INF;
        }
        return parent;
    }

    var find = function (i, parent) {
        while (parent[i]) {
            i = parent[i];
        }
        return i;
    }

    var union = function(i, j, parent) {
        if (i != j) {
            parent[j] = i;
            return true;
        }
        return false;
    }
}

var graph = new Graph();
var myVertices = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
for (var i = 0; i < myVertices.length; i++) {
    graph.addVertex(myVertices[i]);
}
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');

console.log(graph.toString());
var printNode = function(value) {console.log('Visited vertext: ' + value);}
graph.bfs(myVertices[0], printNode);

var shortestPathA = graph.BFS(myVertices[0]);
console.log(shortestPathA);

// 构建路径
var fromVertex = myVertices[0];
for (var i = 0; i < myVertices.length; i++) {
    var toVertex = myVertices[i]
        ,path = new Stack();
    for (var v = toVertex; v !== fromVertex; v = shortestPathA.predecessors[v]) {
        path.push(v);
    }
    path.push(fromVertex);
    var s = path.pop();
    while (!path.isEmpty()) {
        s += ' - ' + path.pop();
    }
    console.log(s);
}

graph.dfs(printNode);

// 当我们需要编排一些任务或步骤的执行顺序时，为拓扑排序(topological sorting)
var topoGraph = new Graph();
var topoVertices = ['A', 'B', 'C', 'D', 'E', 'F'];
for (var i = 0; i < topoVertices.length; i++) {
    topoGraph.addVertex(topoVertices[i]);
}
topoGraph.addEdge('A', 'C');
topoGraph.addEdge('A', 'D');
topoGraph.addEdge('B', 'D');
topoGraph.addEdge('B', 'E');
topoGraph.addEdge('C', 'F');
topoGraph.addEdge('F', 'E');
var result = topoGraph.DFS();

console.log('dijkstra',topoGraph.dijkstra(0));
console.log('prim', topoGraph.prim());
