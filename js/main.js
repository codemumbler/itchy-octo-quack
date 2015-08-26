//main.js
var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', function() {
	this.resources = 0;
	this.turn = 1;
	this.workQueue = 0;

	this.endTurn = function() {
		this.resources += 7
		this.turn++;
		if (this.workQueue > 0)
			buildShip.call(this);
		endTurnModal();
	};

	this.queueShip = function() {
		if (this.resources >= 10) {
			this.resources -= 10;
			this.workQueue++;
		}
	};

	var buildShip = function() {
		this.workQueue--;
		$('<div class="ship"/>').appendTo(".planet.player1");
	}

	var endTurnModal = function() {
		if ($("#endTurnModal").length == 0)
			return;
		$("#endTurnModal").modal('show');
		setTimeout(function(){
			$("#endTurnModal").modal('hide');
		}, 100);
	}

	var victory = function() {
		$("#victoryModal").modal('show');
	};

	var defeat = function() {
		$("#defeatModal").modal('show');
	}

	this.getGridSize = function() {
		var array = [];
		for (var i = 0; i < 13; i++)
			array.push(i);
		return array;
	};

	this.hasObject = function(x,y) {
		if (x==6 && y==6)
			return "sun";
		if ((x==9 && y==3) || (x==4 && y==10))
			return "planet";
	};
});
