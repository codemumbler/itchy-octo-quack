describe('Ai Service tests', function () {
  beforeEach(module('mainApp'));

  var aiService, playerModel, notificationService;
  var aiPlayer;

  beforeEach(inject(function ($injector) {
    aiService = $injector.get('aiService');
    notificationService = $injector.get('notificationService');
    playerModel = $injector.get('playerModel');
    playerModel.addPlayer('player2', true);
    playerModel.nextPlayer();
    aiPlayer = playerModel.players[0];
  }));

  afterEach(function () {
    $('.test-element').remove();
  });

  describe('computer player', function () {
    it('player 2 queues ship', function () {
      aiPlayer.resources = 10;
      aiService.executeTurn(aiPlayer);
      expect(aiPlayer.workQueue).toBe(1);
    });

    it('list enemy objects', function () {
      addObjectToCell(0, 0, 'ship', 1);
      expect(aiService.getEnemyObjects()).toEqual([
        [0, 0]
      ]);
    });

    it('choose nearest enemy object', function () {
      addObjectToCell(0, 0, 'ship', 1);
      expect(aiService.selectClosestEnemyObject([1, 1])).toEqual([0, 0]);
    });

    it('choose nearest enemy object when it is a planet', function () {
      addObjectToCell(0, 0, 'planet', 1);
      expect(aiService.selectClosestEnemyObject([1, 1])).toEqual([0, 0]);
    });

    it('move ship towards enemy object', function () {
      addObjectToCell(0, 0, 'ship', 1);
      addCell(1, 1);
      addObjectToCell(4, 4, 'ship', 2);
      aiService.executeTurn(aiPlayer);
      expect($('.x-1.y-1').find('.ship.player2').length).toBe(1);
    });
  });

  describe('ai attack notifications', function () {
    beforeEach(function () {
      addObjectToCell(0, 0, 'ship', 1, 0);
      addObjectToCell(3, 3, 'ship', 2);
    });

    it('defeat modal should not display to user', function () {
      Math.random = function () {
        return 0.9;
      };
      notificationService.shipDefeat = function () {
        fail('notification was called');
      };
      aiService.executeTurn(aiPlayer);
      expect(1).toBe(1);
    });

    it('victory modal should not display to user', function () {
      Math.random = function () {
        return 0;
      };
      notificationService.shipVictory = function () {
        fail('notification was called');
      };
      aiService.executeTurn(aiPlayer);
      expect(1).toBe(1);
    });

    it('vs planet players loses displays notification', function () {
      $('.x-0.y-0').find('.ship').remove();
      addObjectToCell(0, 0, 'planet', 1);
      Math.random = function () {
        return 0;
      };
      notificationService.victory = function () {
        fail('notification was called');
      };
      aiService.executeTurn(aiPlayer);
      expect($('#defeatModal').is(':visible')).toBe(true);
    });
  });
});
