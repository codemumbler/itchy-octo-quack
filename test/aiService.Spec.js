describe('Ai Service tests', function() {
	beforeEach(module('mainApp'));

	var aiService, playerModel;
	var aiPlayer;

	beforeEach(inject(function($injector) {
		aiService = $injector.get('aiService');
		playerModel = $injector.get('playerModel');
		playerModel.addPlayer('player2', true);
		playerModel.nextPlayer();
		aiPlayer = playerModel.players[0];
	}));

	describe('computer player', function(){
		it('player 2 queues ship', function(){
			aiPlayer.resources = 10;
			aiService.executeTurn(aiPlayer);
			expect(aiPlayer.workQueue).toBe(1);
		});
	});
});
