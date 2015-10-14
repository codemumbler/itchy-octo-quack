mainApp.factory('aiService', [ 'playerModel', function(playerModel){
	return {
		executeTurn: function(aiPlayer) {
			if (aiPlayer.resources >= 10)
				playerModel.queueShip();
		}
	};
}]);
