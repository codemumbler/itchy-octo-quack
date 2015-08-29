//main.js
var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', function() {
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
		ship.appendTo('.planet.player1');
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
		$('#victoryModal').modal('show');
	};

	var defeat = function() {
		$('#defeatModal').modal('show');
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
				if (parent.random() >= 0.5) {
					$ship.remove();
					return false;
				} else {
					data.remove();
				}
			});
		}
		if ($coordinates.hasClass('planet player2')) {
			if (this.random() >= 0.8) {
				$ship.remove();
				return false;
			} else {
				$coordinates.removeClass('player2');
			}
		}
		return true;
	};

	this.random = function() {
		return Math.random();
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
			if (this.prevSelected.hasClass('ship player1') && this.selected.find('.ship.player1').length == 0) {
				if (moveShip(this.prevSelected, this.selected)) {
					attack.call(this, this.prevSelected, this.selected);
					return;
				}
			}
			this.prevSelected.parent().removeClass('selected');
		}
		if (this.prevSelected && this.prevSelected.hasClass('planet')) {
			if (this.prevSelected && this.selected.hasClass('planet') && this.selected.attr('class') == this.prevSelected.attr('class')) {
				queueShip.call(this);
			}
			this.selected = undefined;
		} else if (this.selected.find('.ship').length > 0 && !this.selected.find('.ship').hasClass('selected')) {
			$(this.selected.find('.ship')[0]).addClass('selected');
			this.selected = $(this.selected.find('.ship')[0]);
		} else {
			this.selected.find('.ship').removeClass('selected');
			this.selected.parent().addClass('selected');
		}
		this.prevSelected = this.selected;
	};
});
