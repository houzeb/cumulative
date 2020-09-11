function Person ( name ) {
	this.name = name;
}

Person.prototype.getName = function () {
	return this.name;
}

var objectFactory = function () {
	var obj = new Object(), // 从Object.prototype上克隆一个空的对象
		Constructor = [].shift.call( arguments ); // 取得外部传入的构造器，该例子为Person

	obj.__proto__ = Constructor.prototype; // 指向正确的原型
	var ret = Constructor.apply( obj, arguments ); // 借用外部传入的构造器给obj设置属性

	return typeof ret === 'object' ? ret : obj; // 确保构造器总是会返回一个对象
};

var a = objectFactory( Person, 'sven' );

console.log( a.name ); //输出 sven
console.log( a.getName() ); // 输出 sven
console.log( Object.getPrototypeOf( a ) === Person.prototype ); // 输出 true

var c = new Object();
console.log( c.__proto__ === Object.prototype );

console.log( [ 1, 2, 3, 4 ].map( ( yinhong ) => ( yinhong + 1 ) ) ); // [ 2, 3, 4, 5 ]
