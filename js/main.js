var mainApp = angular.module('mainApp', []);
mainApp.controller('MainAppController', ['playerModel', 'aiService', 'gridService', 'notificationService', function(playerModel, aiService, gridService, notificationService) {
	var selected = undefined;
	var prevSelected = undefined;

	this.turn = 1;

	playerModel.addPlayer('player1');
	playerModel.addPlayer('player2', true);
	playerModel.nextPlayer();

	var currentPlayer = playerModel.currentPlayer;

	this.getResources = function() {
		return currentPlayer.resources;
	};

	this.getWorkQueue = function() {
		return currentPlayer.workQueue;
	};

	this.endTurn = function() {
		playerModel.endTurn();
		clearPreviousSelection();
		prevSelected = undefined;
		notificationService.endTurnModal();
		playerModel.nextPlayer();
		while (playerModel.currentPlayer.isAI) {
			aiService.executeTurn(playerModel.currentPlayer);
			playerModel.endTurn();
			playerModel.nextPlayer();
		}
		this.turn++;
	};

	var destroyShip = function($ship) {
		$ship.remove();
		if (prevSelected && prevSelected.hasClass('ship') && prevSelected.data('id') == $ship.data('id'))
			prevSelected = undefined;
	};

	this.getGridSize = function() {
		return gridService.getGridSize();
	};

	this.hasObject = function(x, y) {
		return gridService.hasObject(x, y);
	};

	this.select = function(x, y) {
		selected = $('.x-' + x + '.y-' + y);
		if (prevSelected) {
			if (prevSelected.hasClass('ship ' + currentPlayer.name) && !(selected.data('x') == prevSelected.parent().data('x') && selected.data('y') == prevSelected.parent().data('y')) && selected.find('.ship.' + currentPlayer.name).data('id') != prevSelected.data('id')) {
				if (playerModel.moveShip(prevSelected, selected))
					return;
			}
			if (prevSelected.hasClass('planet ' + currentPlayer.name + ' selected') && selected.attr('class') == prevSelected.attr('class')) {
				playerModel.queueShip();
				clearPreviousSelection();
				prevSelected = undefined;
				return;
			}
		}
		if (selected.find('.ship.' + currentPlayer.name).length > 0 && selected.find('.ship.' + currentPlayer.name + '.selected').length == 0) {
			selected.find('.ship.' + currentPlayer.name + ':last').addClass('selected');
			var parent = this;
			$(selected.find('.ship.' + currentPlayer.name).get().reverse()).each(function(index, data) {
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
