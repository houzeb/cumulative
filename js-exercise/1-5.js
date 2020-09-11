/*
	函数柯里化
*/

var Tv = {
	open: function () {
		console.log( '打开' );
	},
	close: function () {
		console.log( '关闭' );
	}
};

var createCommand = function ( receiver ) {
	var execute = function () {
		return receiver.open();
	}

	var undo = function () {
		return receiver.close();
	}

	return {
		execute,
		undo,
	}
};

var setCommand = function ( command ) {
	document.getElementById( 'execute' ).onClick = function () {
		command.execute();
	}

	document.getElementById( 'undo' ).onClick = function () {
		command.undo();
	}
};

setCommand( createCommand( Tv ) );




// 以 Array.prototype.push.uncurrying() 为例

Function.prototype.uncurrying = function () {
	var self = this; // self 此时是 Array.prototype.push
	return function () {
		var obj = Array.prototype.shift.call( arguments );
		return self.apply( obj, arguments );
	};
};

var push = Array.prototype.push.uncurrying();

(function () {
	push( arguments, 4 );
	console.log( arguments );
})( 1, 2, 3 ); // 输出: [1, 2, 3, 4


// 还可以一次性地把 Array.prototype 上的方法“复制”到 array 对象上

for ( var i = 0, fn, ary = [ 'push', 'shift', 'forEach' ]; fn = ary[ i + 1 ]; ) {
	Array[ fn ] = Array.prototype[ fn ].uncurrying();
}


// 另一种实现方式
Function.prototype.uncurrying = function () {
	var self = this;
	return function () {
		return Function.prototype.call.apply( self, arguments );
	}
}





















