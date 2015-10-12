describe('Player Model tests', function() {
	beforeEach(module('mainApp'));

	var playerModel;
	var player1;

	beforeEach(inject(function($injector) {
		playerModel = $injector.get('playerModel');
		playerModel.addPlayer('player1');
		player1 = playerModel.players[0];
		playerModel.currentPlayer = player1;
	}));

	describe('playerModel.endTurn', function() {
		it('ending turn adds resources', function() {
			playerModel.endTurn();
			expect(player1.resources).toEqual(7);
		});

		it('end turn does not change work queue if empty', function() {
			player1.workQueue = 0;
			playerModel.endTurn();
			expect(player1.workQueue).toEqual(0);
		});
	});

	describe('Multi-player', function(){
		var player2;
		beforeEach(function(){
			playerModel.nextPlayer();
			playerModel.addPlayer('player2', true);
			player2 = playerModel.players[1];
		});

		it('Add a second player', function(){
			expect(playerModel.players.length).toBe(2);
		});

		it('Add a second computer-based player', function(){
			expect(player2.isAI).toBe(true);
		});

		it('nextPlayer moves ahead', function(){
			playerModel.nextPlayer();
			expect(playerModel.currentPlayer).toBe(player2);
		});

		it('nextPlayer loops back to the first', function(){
			playerModel.nextPlayer();
			playerModel.nextPlayer();
			expect(playerModel.currentPlayer).toBe(player1);
		});
	});

	describe('$controller.queueShip', function() {
		beforeEach(function() {
			player1.resources = 10;
		});

		it('requesting ship queues with < 10 resources does not build', function() {
			player1.resources = 9;
			playerModel.queueShip();
			expect(player1.workQueue).toEqual(0);
		});

		it('requesting ship queues one ship to be built', function() {
			playerModel.queueShip();
			expect(player1.workQueue).toEqual(1);
		});

		it('requesting ship built costs 10 resources', function() {
			playerModel.queueShip();
			expect(player1.resources).toEqual(0);
		});

		it('requested ship build after turn', function() {
			playerModel.queueShip();
			playerModel.endTurn();
			expect(player1.workQueue).toEqual(0);
		});
	});
});
