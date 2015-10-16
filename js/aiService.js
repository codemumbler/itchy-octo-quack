mainApp.factory('aiService', [ 'playerModel', function(playerModel){
	return {
		executeTurn: function(aiPlayer) {
			if (aiPlayer.resources >= 10)
				playerModel.queueShip();
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
		}
	};
}]);
