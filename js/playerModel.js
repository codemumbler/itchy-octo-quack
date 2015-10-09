mainApp.factory('playerModel', function(){
	var uniqueId = 0;
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
		addPlayer: function(name) {
			this.players.push({
				resources: 0,
				workQueue: 0,
				'name': name
			});
		}
	};
});
