describe('Notification Service tests', function () {
  beforeEach(module('mainApp'));

  var notificationService;

  beforeEach(inject(function ($injector) {
    notificationService = $injector.get('notificationService');
    $('.notification').css('display', 'block');
  }));

  afterEach(function () {
    $('.notification').css('display', 'none');
  });

  describe('notifications', function () {
    it('defeat modal', function () {
      notificationService.defeat();
      expect($('#defeatModal').is(':visible')).toBe(true);
    });

    it('victory modal', function () {
      notificationService.victory();
      expect($('#victoryModal').is(':visible')).toBe(true);
    });

    it('ship victory modal', function () {
      notificationService.shipVictory();
      expect($('#shipVictoryModal').is(':visible')).toBe(true);
    });

    it('ship defeat modal', function () {
      notificationService.shipDefeat();
      expect($('#shipDefeatModal').is(':visible')).toBe(true);
    });

    it('end turn modal', function () {
      notificationService.endTurn();
      expect($('#endTurnModal').is(':visible')).toBe(true);
    });
  });

  describe('async nofitications', function () {
    var originalTimeout, originalAjax;
    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
    });

    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('end turn modal goes away', function (done) {
      notificationService.endTurn();
      setTimeout(function () {
        expect($('#endTurnModal').is(':visible')).toBe(false);
        done();
      }, 500);
    });
  });
});
