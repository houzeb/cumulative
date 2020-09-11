// 分时函数


/*
	例子：
		创建 WebQQ 的 QQ 好友列表。列表中通常会有成百上千个好友，
		如果一个好友 用一个节点来表示，当我们在页面中渲染这个列表的时候，可能要一次性往页面中创建成百上千 个节点。
		在短时间内往页面中大量添加 DOM 节点显然也会让浏览器吃不消，我们看到的结果往往就 是浏览器的卡顿甚至假死。
*/

(function () {
	var ary = [];

	for ( var i = 0; i <= 100; i++ ) {
		ary.push( i ); // 假设ary装载了1000个好友的数据
	};

	var renderFriendList = function ( data ) {
		for ( var i = 0, l = data.length; i < l; i++ ) {
			var div = document.createElement( 'div' );
			div.innerHTML = i;
			document.body.appendChild( div );
		}
	};

	renderFriendList( ary );
})();

/*
	解决方案之一是下面的 timeChunk 函数，
	timeChunk 函数让创建节点的工作分批进行，
	比如把 1 秒钟创建 1000 个节点，改为每隔 200 毫秒创建 8 个节点。
	timeChunk 函数接受 3 个参数，
		第 1 个参数是创建节点时需要用到的数据，
		第 2 个参数是封装了创建节点逻辑的函数，
		第 3 个参数表示每一批创建的节点数量
*/

var timeChunk = function ( ary, fn, count ) {
	var obj,
		t;

	var len = ary.length;

	var start = function () {
		for ( var i = 0; i < Math.min( count || 1, ary.length ); i++ ) {
			var obj = ary.shift();
			fn ( obj );
		}
	};

	return function () {
		t = setInterval( function () {
			if ( ary.length === 0 ) { // 如果全部节点都已经被创建好
				return clearInterval( t );
			}
			start();
		}, 200 ); // 分批执行的时间间隔，也可以用参数的形式传入
	}
}





















