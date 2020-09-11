// 在编写一个飞机大战的网页游戏时。某种飞机拥有分身技能，当它使用分身技能的时候，要在页面中创建一些跟它一模一样的飞机。
// 如果使用原型模式，我们只需要调用负责克隆的方法，便能完成同样的功能

;(function() {
	var Plane = function () {
		this.blood = 100;
		this.attackLevel = 1;
		this.defenseLevel = 1;
	}

	var plane = new Plane();
	plane.blood = 500;
	plane.attackLevel = 10;
	plane.defenseLevel = 7;

	var clonePlane = Object.create(plane);
	console.log(clonePlane);

	// 在不支持Object.create方法的浏览器中，则可以使用以下代码
	Object.create = Object.create || function (obj) {
		var F = new Function();
		F.prototype = obj;

		return new F();
	}

})();