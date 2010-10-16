Engine.initObject("SPAS", "Weapon", function() {
	var SPAS = Weapon.extend({
				
		constructor: function(owner) {
			this.clipCapacity = 6;
			this.base(owner, owner.field, SPAS.getClassName());
			this.automatic = Weapon.SEMI_AUTOMATIC;
			this.roundsPerMinute = 999999;
			this.projectilesPerShot = 5;
			this.timeToReload = 2000;
			this.projectileVelocityVariability = 0.5;
			this.dischargeDelay = 0;
			this.timeRequiredForDeadAim = 1000;
			this.projectileBaseSpeed = 15;
			this.projectileClazz = Bullet;
		},
		
		ordinancePhysics: function() {
			return this.recoil(SPAS.BASE_SPREAD, SPAS.TIME_REQUIRED_FOR_DEAD_AIM, SPAS.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "SPAS"; },
		
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 30,
		BASE_SPREAD: 30,
	});

	return SPAS;
});