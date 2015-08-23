describe('MainAppController', function() {
	beforeEach(module('mainApp'));

	var $controller, controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		controller = $controller('MainAppController', {});
	}));

	describe('$controller.endTurn', function() {
		it('ending turn adds resources', function() {
			controller.endTurn();
			expect(controller.resources).toEqual(7);
		});

		it('ending turn increments turn counter', function() {
			controller.endTurn();
			expect(controller.turn).toEqual(2);
		});

		it('end turn does not change work queue if empty', function() {
			controller.workQueue = 0;
			controller.endTurn();
			expect(controller.workQueue).toEqual(0);
		});
	});

	describe('$controller.queueShip', function() {
		it('requesting ship queues one ship to be built', function() {
			controller.resources = 10;
			controller.queueShip();
			expect(controller.workQueue).toEqual(1);
		});

		it('requesting ship built costs 10 resources', function() {
			controller.resources = 10;
			controller.queueShip();
			expect(controller.resources).toEqual(0);
		});

		it('requested ship build after turn', function() {
			controller.resources = 10;
			controller.queueShip();
			controller.endTurn();
			expect(controller.workQueue).toEqual(0);
		});
	});
});
