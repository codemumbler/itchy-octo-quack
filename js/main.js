var mainApp = angular.module('mainApp', []);
mainApp.factory('playerModel', function(){
	return {
		resources: 0
	};
});
mainApp.controller('MainAppController', [ 'playerModel', function(playerModel) {
	var uniqueId = 0;
	var selected = undefined;
	var prevSelected = undefined;

	this.turn = 1;
	this.workQueue = 0;

	this.getResources = function() {
		return playerModel.resources;
	};

	this.endTurn = function() {
		playerModel.resources += 7;
		this.turn++;
		if (this.workQueue > 0)
			buildShip.call(this);
		clearPreviousSelection();
		prevSelected = undefined;
		$('.ship.player1').data('moves', 3);
		endTurnModal();
	};

	var queueShip = function() {
		if (playerModel.resources >= 10) {
			playerModel.resources -= 10;
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

	var shipVictory = function() {
		$('#shipVictoryModal').modal('show');
	};

	var shipDefeat = function() {
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
		if (prevSelected && prevSelected.hasClass('ship') && prevSelected.data('id') == $ship.data('id'))
			prevSelected = undefined;
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
		selected = $('.x-' + x + '.y-' + y);
		if (prevSelected) {
			if (prevSelected.hasClass('ship player1') && !(selected.data('x') == prevSelected.parent().data('x')
					&& selected.data('y') == prevSelected.parent().data('y'))
					&& selected.find('.ship.player1').data('id') != prevSelected.data('id')) {
				if (moveShip(prevSelected, selected)) {
					attack.call(this, prevSelected, selected);
					return;
				}
			}
			if (prevSelected.hasClass('planet player1 selected') && selected.attr('class') == prevSelected.attr('class')) {
				queueShip.call(this);
				clearPreviousSelection();
				prevSelected = undefined;
				return;
			}
		}
		if (selected.find('.ship').length > 0 && selected.find('.ship.selected').length == 0) {
			selected.find('.ship:last').addClass('selected');
			var parent = this;
			$(selected.find('.ship').get().reverse()).each(function(index, data){
				if ($(data).data('moves') > 0) {
					selected = $(data);
					return false;
				}
				selected = $(data);
			});
		}
		clearPreviousSelection();
		selected.addClass('selected');
		prevSelected = selected;
	};

	var clearPreviousSelection = function() {
		$('.selected').removeClass('selected');
	};
}]);
