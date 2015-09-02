//main.js
var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', function() {
	var uniqueId = 0;

	this.resources = 0;
	this.turn = 1;
	this.workQueue = 0;
	this.selected = undefined;
	this.prevSelected = undefined;

	this.endTurn = function() {
		this.resources += 7
		this.turn++;
		if (this.workQueue > 0)
			buildShip.call(this);
		clearPreviousSelection();
		this.prevSelected = undefined;
		$('.ship.player1').data('moves', 3);
		endTurnModal();
	};

	var queueShip = function() {
		if (this.resources >= 10) {
			this.resources -= 10;
			this.workQueue++;
		}
	};

	var buildShip = function() {
		this.workQueue--;
		var ship = $('<div class="ship player1"/>');
		ship.data('moves', 3);
		ship.data('id', uniqueId++);
		$('.planet.player1').append(ship);
	};

	var endTurnModal = function() {
		if ($('#endTurnModal').length == 0)
			return;
		$('#endTurnModal').modal('show');
		setTimeout(function(){
			$('#endTurnModal').modal('hide');
		}, 100);
	};

	var victory = function() {
		if ($('#victoryModal').length != 0)
			$('#victoryModal').modal('show');
	};

	var defeat = function() {
		if ($('#defeatModal').length != 0)
			$('#defeatModal').modal('show');
	};

	var shipVictory = function() {
		if ($('#shipVictoryModal').length != 0)
			$('#shipVictoryModal').modal('show');
	};

	var shipDefeat = function() {
		if ($('#shipDefeatModal').length != 0)
			$('#shipDefeatModal').modal('show');
	};

	var moveShip = function($ship, $coordinates) {
		var toTravel = distance($ship.parent().data('x'), $ship.parent().data('y'), $coordinates.data('x'), $coordinates.data('y'));
		if (toTravel > $ship.data('moves'))
			return false;
		$ship.data('moves', $ship.data('moves') - toTravel);
		$ship.appendTo($coordinates);
		return true;
	};

	var distance = function(x1, y1, x2, y2) {
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);

		var min = Math.min(dx, dy);
		var max = Math.max(dx, dy);

		var diagonalSteps = min;
		var straightSteps = max - min;

		return diagonalSteps + straightSteps;
	};

	var attack = function($ship, $coordinates) {
		if ($coordinates.find('.ship.player2').length > 0){
			var parent = this;
			$coordinates.find('.ship.player2').each(function(index, data){
				if (Math.random() >= 0.5) {
					destroyShip.call(parent, $ship);
					shipDefeat();
				} else {
					destroyShip.call(parent, $(data));
					shipVictory();
				}
			});
		}
		if ($coordinates.hasClass('planet player2')) {
			if (Math.random() >= 0.2) {
				destroyShip.call(this, $ship);
				shipDefeat();
			} else {
				$coordinates.removeClass('player2');
				victory();
			}
		}
	};

	var destroyShip = function($ship) {
		$ship.remove();
		if (this.prevSelected && this.prevSelected.hasClass('ship') && this.prevSelected.data('id') == $ship.data('id'))
			this.prevSelected = undefined;
	};

	this.getGridSize = function() {
		var array = [];
		for (var i = 0; i < 13; i++)
			array.push(i);
		return array;
	};

	this.hasObject = function(x,y) {
		if (x==6 && y==6)
			return 'sun';
		if (x==9 && y==3)
			return 'planet player2';
		if (x==4 && y==10)
			return 'planet player1';
	};

	this.select = function(x,y) {
		this.selected = $('.x-' + x + '.y-' + y);
		if (this.prevSelected) {
			if (this.prevSelected.hasClass('ship player1') && !(this.selected.data('x') == this.prevSelected.parent().data('x')
					&& this.selected.data('y') == this.prevSelected.parent().data('y'))
					&& this.selected.find('.ship.player1').data('id') != this.prevSelected.data('id')) {
				if (moveShip(this.prevSelected, this.selected)) {
					attack.call(this, this.prevSelected, this.selected);
					return;
				}
			}
			if (this.prevSelected.hasClass('planet player1 selected') && this.selected.attr('class') == this.prevSelected.attr('class')) {
				queueShip.call(this);
				clearPreviousSelection();
				this.prevSelected = undefined;
				return;
			}
		}
		if (this.selected.find('.ship').length > 0 && this.selected.find('.ship.selected').length == 0) {
			this.selected.find('.ship:last').addClass('selected');
			var parent = this;
			$(this.selected.find('.ship').get().reverse()).each(function(index, data){
				if ($(data).data('moves') > 0) {
					parent.selected = $(data);
					return false;
				}
				parent.selected = $(data);
			});
		}
		clearPreviousSelection();
		this.selected.addClass('selected');
		this.prevSelected = this.selected;
	};

	var clearPreviousSelection = function() {
		$('.selected').removeClass('selected');
	};
});
