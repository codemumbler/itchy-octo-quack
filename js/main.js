//main.js
var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', function() {
	this.resources = 0;
	this.turn = 1;

	this.endTurn = function() {
		this.resources += 7
		this.turn++;
		$("#endTurnModal").modal('show');
		setTimeout(function(){
			$("#endTurnModal").modal('hide');
		}, 100);
	};

	var victory = function() {
		$("#victoryModal").modal('show');
	};

	var defeat = function() {
		$("#defeatModal").modal('show');
	}
});
