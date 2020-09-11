/*
	this
*/

// 一、this的指向

// 作为对象的方法调用

var obj = {
	a: 1,
	getA: function () {
		console.log( this === obj ); // true
		console.log( this.a ); // 1
	}
}

obj.getA();


// 作为普通函数调用

window.name1 = 'globalName';

var getName = function () {
	return this.name1;
}

console.log( getName() ); // globalName


window.name = 'globalName1';

var myObject = {
	name: 'sven',
	getName: function () {
		return this.name;
	}
};

var getName = myObject.getName;
console.log( getNeme() );


// 构造器调用
var MyClass = function () {
	this.name = 'sven';
}
var obj = new MyClass();
console.log( obj.name );

// 如果构造器显式地返回了一个 object 类型的对象，那么此次运算结果最终会返回这个对象，而不是我们之前期待的 this
var MyClass1 = function () {
	this.name = 'sven';
	return {
		name: 'anne'
	}
};

var obj = new MyClass1();
console.log( obj.name ); // anne

// 如果构造器不显式地返回任何数据，或者是返回一个非对象类型的数据，就不会造成上述 问题
var MyClass2 = function () {
	this.name = 'sven';
	return 'anne';
}

var obj = new MyClass2();
console.log( obj.name ); // sven


// Function.prototype.call 或 Function.prototype.apply调用
var obj1 = {
	name: 'sven',
	getName: function () {
		return this.name;
	}
};

var obj2 = {
	name: 'anne'
};

console.log( obj1.getName() ); // sven
console.log( obj1.getName.call( obj2 ) ); // anne


// 二、丢失的this

// call和apply的用途

//1 改变this指向
var obj1 = {
	name: 'sven'
};

var obj2 = {
	name: 'anne'
};

window.name = 'window';

var getName = function () {
	console.log( this.name );
};


getName(); // window
getName.call( obj1 ); // sven
getName.call( obj2 ); // anne




Function.prototype.bind = function ( context ) {
	var self = this; // 保存原函数
	return function () {
		return self.applay( context, arguments ); // 执行新的函数时，会把之前传入的context当作新函数体内的this
	}
};

var obj = {
	name: 'sven'
};

var func = function () {
	console.log( this.name );
}.bind( obj );

func();
































