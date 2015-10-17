describe('Grid Service tests', function() {
	beforeEach(module('mainApp'));

	var gridService;

	beforeEach(inject(function($injector) {
		gridService = $injector.get('gridService');
	}));

	describe('grid', function() {
		it('get grid size', function() {
			expect(gridService.getGridSize().length).toEqual(13);
		});

		it('has object - sun', function() {
			expect(gridService.hasObject(6,6)).toEqual('sun');
		});

		it('has object - planet', function() {
			expect(gridService.hasObject(4,10)).toEqual('planet player1');
		});

		it('has object - planet', function() {
			expect(gridService.hasObject(9,3)).toEqual('planet player2');
		});

		it('has object - nothing there', function() {
			expect(gridService.hasObject(0,0)).toEqual(undefined);
		});

		it('nearest object', function() {
			var objects = [ [0,0] ];
			expect(gridService.nearestObject(objects, 1, 1)).toEqual([0,0]);
		});

		it('nearest objects', function() {
			var objects = [ [0,0], [3,3] ];
			expect(gridService.nearestObject(objects, 2, 2)).toEqual([3,3]);
		});

		it('nearest object - equal distance', function() {
			var objects = [ [0,0], [2,2] ];
			expect(gridService.nearestObject(objects, 1, 1)).toEqual([0,0]);
		});

		it('partial distance along diagonal', function(){
			expect(gridService.moveTowards(1, 1, 5, 5, 3)).toEqual([4,4]);
		});
	});
});
