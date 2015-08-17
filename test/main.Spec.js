describe('MainAppController', function() {
	beforeEach(module('mainApp'));

	var $controller;

	beforeEach(inject(function(_$controller_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$controller.endTurn', function() {
		it('ending turn adds resources', function() {
			var controller = $controller('MainAppController', { });
			controller.endTurn();
			expect(controller.resources).toEqual(7);
		});

		it('ending turn increments turn counter', function() {
			var controller = $controller('MainAppController', { });
			controller.endTurn();
			expect(controller.turn).toEqual(2);
		});
	});
});
