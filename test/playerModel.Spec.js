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
