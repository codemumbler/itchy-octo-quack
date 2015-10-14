mainApp.factory('gridService', function(){

	return {
		distance: function(x1, y1, x2, y2) {
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);

			var min = Math.min(dx, dy);
			var max = Math.max(dx, dy);

			var diagonalSteps = min;
			var straightSteps = max - min;

			return diagonalSteps + straightSteps;
		},
		getGridSize: function() {
			var array = [];
			for (var i = 0; i < 13; i++)
				array.push(i);
			return array;
		},
		hasObject: function(x,y) {
			if (x==6 && y==6)
				return 'sun';
			if (x==9 && y==3)
				return 'planet player2';
			if (x==4 && y==10)
				return 'planet player1';
		}
	};
});