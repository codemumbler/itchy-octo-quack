mainApp.factory('playerModel', [ 'gridService', 'notificationService', function(gridService, notificationService){
	var uniqueId = 0;
	var currentPlayerIndex = -1;

	var attack = function($ship, $coordinates, currentPlayer) {

		var shipCoordinates = gridService.getCoordinates($ship);
		var gridCoordinates = gridService.getCoordinates($coordinates);
		var enemyShipClass = 'player2';
		if ($ship.hasClass(enemyShipClass))
			enemyShipClass = 'player1';
		if (shipCoordinates[0] != gridCoordinates[0] || shipCoordinates[1] != gridCoordinates[1])
			return;

		if ($coordinates.find('.ship.' + enemyShipClass).length > 0) {
			$coordinates.find('.ship.' + enemyShipClass).each(function(index, data) {
				if (Math.random() >= 0.5) {
					$ship.remove();
					if (!currentPlayer.isAI)
						notificationService.shipDefeat();
				} else {
					$(data).remove();
					if (!currentPlayer.isAI)
						notificationService.shipVictory();
				}
			});
		}
		if ($coordinates.hasClass('planet ' + enemyShipClass)) {
			if (Math.random() >= 0.2) {
				$ship.remove();
				if (!currentPlayer.isAI)
					notificationService.shipDefeat();
			} else {
				$coordinates.removeClass(enemyShipClass);
				if (!currentPlayer.isAI)
					notificationService.victory();
				else {
					notificationService.defeat();
				}
			}
		}
	};

	return {
		players: [],
		currentPlayer: null,
		endTurn: function() {
			this.currentPlayer.resources += 7;
			if (this.currentPlayer.workQueue > 0)
				this.buildShip();
			$('.ship.' + this.currentPlayer.name).data('moves', 3);
		},
		queueShip: function() {
			if (this.currentPlayer.resources >= 10) {
				this.currentPlayer.resources -= 10;
				this.currentPlayer.workQueue++;
			}
		},
		buildShip: function() {
			this.currentPlayer.workQueue--;
			var ship = $('<div class="ship"/>');
			ship.addClass(this.currentPlayer.name);
			ship.data('moves', 3);
			ship.data('id', uniqueId++);
			$('.planet.' + this.currentPlayer.name).append(ship);
		},
		addPlayer: function(name, isAI) {
			this.players.push({
				resources: 0,
				workQueue: 0,
				'isAI': (isAI ? true : false),
				'name': name
			});
		},
		nextPlayer: function() {
			currentPlayerIndex = ((++currentPlayerIndex) % this.players.length);
			this.currentPlayer = this.players[currentPlayerIndex];
		},
		moveShip: function($ship, $coordinates) {
			if ($ship.data('moves') == 0)
				return false;
			var toTravel = gridService.distance($ship, $coordinates);
			var moveTo = gridService.moveTowards($ship, $coordinates);
			var finalCoordinates = gridService.getGrid(moveTo);
			$ship.appendTo(finalCoordinates);
			$ship.data('moves', Math.max(0, $ship.data('moves') - toTravel));
			attack($ship, finalCoordinates, this.currentPlayer);
			return true;
		}
	};
}]);
