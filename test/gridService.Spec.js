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

		it('partial move along single axis - x', function(){
			expect(gridService.moveTowards(1, 1, 5, 1, 3)).toEqual([4,1]);
		});

		it('partial move along single axis - y', function(){
			expect(gridService.moveTowards(1, 1, 1, 5, 3)).toEqual([1,4]);
		});

		it('partial move along awkward point', function(){
			expect(gridService.moveTowards(1, 1, 4, 9, 3)).toEqual([3,4]);
		});

		it('partial move backwards along awkward point', function(){
			expect(gridService.moveTowards(4, 9, 1, 1, 3)).toEqual([3,6]);
		});

		it('partial move backwards single axis - x', function(){
			expect(gridService.moveTowards(5, 1, 1, 1, 3)).toEqual([2,1]);
		});

		it('partial move backwards single axis - y', function(){
			expect(gridService.moveTowards(1, 5, 1, 1, 3)).toEqual([1,2]);
		});

		it('partial move backwards along diagonal', function(){
			expect(gridService.moveTowards(5, 5, 1, 1, 3)).toEqual([2,2]);
		});

		it('partial move based upon originating coordinates', function(){
			expect(gridService.moveTowards(0, 0, 4, 4, 3)).toEqual([3,3]);
		});

		it('partial move based upon originating coordinates', function(){
			expect(gridService.moveTowards(4, 10, 9, 4, 3)).toEqual([7,7]);
		});

		it('moves required less than remaining moves', function(){
			expect(gridService.moveTowards(0, 0, 1, 1, 3).toEqual([1,1]));
		});
	});
});
