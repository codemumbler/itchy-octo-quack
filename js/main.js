//main.js
var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', function() {
	this.resources = 0;
	this.turn = 1;

	this.endTurn = function() {
		this.resources += 7
		this.turn++;
	};
});
