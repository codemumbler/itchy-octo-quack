describe('MainAppController', function() {
  beforeEach(module('mainApp'));

  var $controller, controller, playerModel;
  var player1;

  beforeEach(inject(function(_$controller_, $injector) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    playerModel = $injector.get('playerModel');
    var aiService = $injector.get('aiService');
    var gridService = $injector.get('gridService');
    controller = $controller('MainAppController', playerModel, aiService, gridService);
    player1 = playerModel.players[0];
    addCell(0, 0);
  }));

  afterEach(function() {
    $('.test-element').remove();
  });

  describe('$controller.endTurn', function() {
    it('ending turn increments turn counter', function() {
      controller.endTurn();
      expect(controller.turn).toEqual(2);
    });

    it('two players', function() {
      expect(playerModel.players.length).toBe(2);
    });
  });

  describe('$controller.queueShip', function() {
    beforeEach(function() {
      addObjectToCell(0, 0, 'planet', 1);
      controller.select(0, 0);
      player1.resources = 10;
    });

    it('planet grid must be selected before queueing ship', function() {
      controller.select(1, 1);
      controller.select(0, 0);
      expect(player1.workQueue).toEqual(0);
    });
  });

  describe('$controller.grid', function() {
    it('selecting saves selected grid', function() {
      controller.select(0, 0);
      expect($('.selected').attr('class')).toEqual('x-0 y-0 selected');
    });

    it('selecting another removes highlighting', function() {
      controller.select(0, 0);
      var savedSelected = $('.selected');
      controller.select(1, 1);
      expect(savedSelected.parent().attr('class')).toEqual('test-element');
    });
  });

  describe('ship movement', function() {
    var buildShip = function() {
      player1.resources = 10;
      addObjectToCell(0, 0, 'planet', 1);
      controller.select(0, 0);
      controller.select(0, 0);
      controller.endTurn();
    };

    it('select ship to move', function() {
      buildShip();
      controller.select(0, 0);
      expect($('.selected').hasClass('ship player1 selected')).toBe(true);
    });

    it('selects a ship with moves remaining', function() {
      buildShip();
      controller.select(0, 0);
      buildShip();
      $('.ship:first').data('moves', 0);
      controller.select(0, 0);
      expect($('.ship.selected').data('moves')).toEqual(3);
    });

    it('selects a ship when no ships have moves', function() {
      buildShip();
      controller.select(0, 0);
      buildShip();
      $('.ship').data('moves', 0);
      controller.select(0, 0);
      expect($('.ship.selected').data('moves')).toEqual(0);
    });

    it('select grid to move ship', function() {
      addCell(1, 0);
      buildShip();
      controller.select(1, 0);
      controller.select(0, 0);
      expect($('.x-0.y-0').find('.ship').length).toEqual(1);
    });

    it('selects planet under ship', function() {
      buildShip();
      controller.select(0, 0);
      controller.select(0, 0);
      expect($('.selected').hasClass('planet')).toBe(true);
    });

    it('can queue ship when ship on planet', function() {
      buildShip();
      player1.resources = 10;
      controller.select(0, 0);
      controller.select(0, 0);
      controller.select(0, 0);
      expect(player1.workQueue).toBe(1);
    });

    it('can move 3 spaces per turn', function() {
      buildShip();
      expect($('.ship').data('moves')).toEqual(3);
    });

    it('moves 3 spaces has 0 left', function() {
      addCell(3, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(3, 0);
      expect($('.ship').data('moves')).toEqual(0);
    });

    it('moves 4 spaces has 0 left', function() {
      addCell(3, 0);
      addCell(4, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(4, 0);
      expect($('.ship').data('moves')).toEqual(0);
    });

    it('moves 4 spaces has 0 left moved to 3,0', function() {
      addCell(3, 0);
      addCell(4, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(4, 0);
      expect($('.ship').parent().data('x') + '-' + $('.ship').parent().data('y')).toEqual('3-0');
    });

    it('ending turn refreshes moves remaining', function() {
      addCell(3, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(3, 0);
      playerModel.endTurn();
      expect($('.ship').data('moves')).toEqual(3);
    });
  });

  describe('ship attack', function() {
    var buildShip = function() {
      player1.resources = 10;
      addObjectToCell(0, 0, 'planet', 1);
      controller.select(0, 0);
      controller.select(0, 0);
      playerModel.endTurn();
    };

    it('player1 ship attacks player2 planet - gets destroyed', function() {
      Math.random = function() {
        return 0.9;
      };
      addObjectToCell(1, 1, 'planet', 2);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship').length).toEqual(0);
    });

    it('when selected ship gets destroyed it is cleared', function() {
      Math.random = function() {
        return 0.9;
      };
      addObjectToCell(1, 1, 'planet', 2);
      buildShip();
      controller.select(0, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      controller.select(0, 0);
      expect($('.ship').length).toEqual(1);
    });

    it('player1 ship attacks player2 planet - planet dies', function() {
      Math.random = function() {
        return 0;
      };
      addObjectToCell(1, 1, 'planet', 2);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.x-1.y-1.planet').hasClass('player2')).toEqual(false);
    });

    it('player1 ship attacks player2 ship - player1 dies', function() {
      Math.random = function() {
        return 0.9;
      };
      addObjectToCell(1, 1, 'ship', 2);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship.player1').length).toEqual(0);
    });

    it('player1 ship attacks player2 ship - player2 dies', function() {
      Math.random = function() {
        return 0;
      };
      addObjectToCell(1, 1, 'ship', 2);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship.player2').length).toEqual(0);
    });

    it('player1 ship attacks 2 player2 ships - 1 player2 dies and player1 dies', function() {
      var count = 0;
      Math.random = function() {
        return count++;
      };
      addObjectToCell(1, 1, 'ship', 2);
      addObjectToCell(1, 1, 'ship', 2);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship.player2').length).toEqual(1);
      expect($('.ship.player1').length).toEqual(0);
    });

    it('player1 ship attacks player2 ship and planet - 1 player2 ship dies and player1 ship dies', function() {
      var count = 0;
      Math.random = function() {
        return count++;
      };
      addObjectToCell(1, 1, 'planet', 2);
      addObjectToCell(1, 1, 'ship', 2, 0);
      buildShip();
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.x-1.y-1').find('.planet').hasClass('player2')).toEqual(true);
      expect($('.ship.player2').length).toEqual(0);
      expect($('.ship.player1').length).toEqual(0);
    });

    it('two player2 ships, player1 dies after first, does not attack next ship', function() {
      var count = 1.0;
      Math.random = function() {
        return count -= 0.5;
      };
      buildShip();
      addObjectToCell(1, 1, 'ship', 2);
      addObjectToCell(1, 1, 'ship', 2);
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship.player2').length).toEqual(2);
    });

    it('player2 ship and planet, player1 dies after first, does not attack next planet', function() {
      var count = 1.0;
      Math.random = function() {
        return count -= 0.5;
      };
      buildShip();
      addObjectToCell(1, 1, 'planet', 2);
      addObjectToCell(1, 1, 'ship', 2);
      controller.select(0, 0);
      controller.select(1, 1);
      expect($('.ship.player2,.planet.player2').length).toEqual(2);
    });
  });
});
