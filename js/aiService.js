mainApp.factory('aiService', [ 'playerModel', 'gridService', function(playerModel, gridService){
	return {
		executeTurn: function(aiPlayer) {
			if (aiPlayer.resources >= 10)
				playerModel.queueShip();
			var service = this;
			$('.ship.player2').each(function(index, ship){
				var enemyShipCoordinates = service.selectClosestEnemyObject($(ship).parent().data('x'), $(ship).parent().data('y'));
				playerModel.moveShip($(ship), $('.x-'+enemyShipCoordinates[0]+'.y-'+enemyShipCoordinates[1]));
			});
		},
		getEnemyObjects: function() {
			var objects = [];
			$('.ship.player1').each(function(index, element){
				var coordinates = [];
				coordinates.push($(element).parent().data('x'));
				coordinates.push($(element).parent().data('y'));
				objects.push(coordinates);
			});
			return objects;
		},
		selectClosestEnemyObject: function(x, y) {
			return gridService.nearestObject(this.getEnemyObjects(), x, y);
		}
	};
}]);
