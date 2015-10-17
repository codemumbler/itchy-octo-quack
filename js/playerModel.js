mainApp.factory('playerModel', [ 'gridService', function(gridService){
	var uniqueId = 0;
	var currentPlayerIndex = -1;
	return {
		players: [],
		currentPlayer: null,
		endTurn: function() {
			this.currentPlayer.resources += 7;
			if (this.currentPlayer.workQueue > 0)
				this.buildShip();
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
			var toTravel = gridService.distance($ship.parent().data('x'), $ship.parent().data('y'), $coordinates.data('x'), $coordinates.data('y'));
			var moveTo = gridService.moveTowards($ship.parent().data('x'), $ship.parent().data('y'), $coordinates.data('x'), $coordinates.data('y'), $ship.data('moves'));
			$ship.appendTo($('.x-'+moveTo[0]+'.y-'+moveTo[1]));
			if (toTravel > $ship.data('moves')) {
				$ship.data('moves', 0);
				return false;
			}
			$ship.data('moves', $ship.data('moves') - toTravel);
			$ship.appendTo($coordinates);
			return true;
		}
	};
}]);
