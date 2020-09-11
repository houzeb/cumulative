/*
	单例模式

	保证一个类仅有一个实例，并提供一个访问它的全局访问点
*/

//引入代理类的方式

var CreateDiv = function ( html ) {
	this.html = html;
	this.init();
};

CreateDiv.prototype.init = function () {
	var div = document.createElement( 'div' );
	div.innerHTML = this.html;
	document.body.appendChild( div );
}

//代理类
var ProxySingletonCreateDiv = (function () {
	var instance;
	return function ( html ) {
		if ( !instance ) {
			instance = new CreateDiv( html );
		}

		return instance;
	}
})();

var a = new ProxySingletonCreateDiv( 'sven1' );
var b = new ProxySingletonCreateDiv( 'sven2' );

console.log( a === b );