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

		it('list enemy objects', function(){
			$(document.body).append('<div class="test-element"><div class="x-0 y-0" data-x="0" data-y="0"><div class="ship player1"/></div></div>');
			expect(aiService.getEnemyObjects()).toEqual([[0,0]]);
		});

		it('choose nearest enemy object', function(){
			$(document.body).append('<div class="test-element"><div class="x-0 y-0" data-x="0" data-y="0"><div class="ship player1"/></div></div>');
			expect(aiService.selectClosestEnemyObject(1, 1)).toEqual([0,0]);
		});

		it('move ship towards enemy object', function(){
			$(document.body).append('<div class="test-element"><div class="x-0 y-0" data-x="0" data-y="0"><div class="ship player1"/></div></div>');
			$(document.body).append('<div class="test-element"><div class="x-1 y-1" data-x="1" data-y="1"/></div>');
			$(document.body).append('<div class="test-element"><div class="x-4 y-4" data-x="4" data-y="4"><div class="ship player2" data-moves="3"/></div></div>');
			aiService.executeTurn(aiPlayer);
			expect($('.x-1.y-1').find('.ship.player2').length).toBe(1);
		});
	});
});
