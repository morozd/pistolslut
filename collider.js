Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Collider", "Base", function() {

var Collider = Base.extend({
	
	field: null,
	
	constructor: function(field) {
		this.field = field;
	},
	
	aFallingThroughB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return a.velocity.y > 0 && aRect.b > bRect.y && aRect.b < bRect.y + 14;
	},
	
	aOnB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return aRect.b == bRect.y;
	},
	
	aOnLeftAndBumpingB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return aRect.r >= bRect.x && aRect.x < bRect.x && !this.aOnB(a, b);
	},
	
	aOnRightAndBumpingB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return aRect.x <= bRect.r && aRect.r > bRect.r && !this.aOnB(a, b);
	},
	
	getPCL: function(subject) {
		return this.field.collisionModel.getPCL(subject.getPosition());
	},
	
	// returns true if subject colliding with any of the objects
	// if clazz supplied, only checks objects of that type
	colliding: function(subject, objects, clazz) {
		for(var i in objects)
			if(clazz == null || objects[i] instanceof clazz)
				if(this.getRect(subject).isIntersecting(this.getRect(objects[i])))
					return true;
		return false;
	},
	
	// returns point that moving obj hit staticObj
	pointOfImpact: function(movingObj, staticObj) {
		var mOCurPos = movingObj.getPosition();
		var mOPrevPos = movingObj.getLastPosition();
		var mODims = movingObj.getBoundingBox().dims;
		var sOPos = staticObj.getPosition();
		var sODims = staticObj.getBoundingBox().dims;
				
		// staticobj on left
		var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y);
		var p2 = Point2D.create(mOCurPos.x,mOCurPos.y);
		var p3 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
		var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), "right"];
				
		// staticobj on right
		var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y);
		var p2 = Point2D.create(mOCurPos.x + mODims.x,mOCurPos.y + mODims.y);
		var p3 = Point2D.create(sOPos.x,sOPos.y);
		var p4 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), "left"];
				
		// staticobj on bottom
		var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y + mODims.y);
		var p2 = Point2D.create(mOCurPos.x,mOCurPos.y + mODims.y);
		var p3 = Point2D.create(sOPos.x,sOPos.y);
		var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), "top"];
		
		// staticobj on top
		var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y);
		var p2 = Point2D.create(mOCurPos.x,mOCurPos.y);
		var p3 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
		var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), "bottom"];
		
		return null; // no intersection
	},
	
	angleOfImpact: function(movingObj) {
		var vector = movingObj.getVelocity();
		return Math2D.radToDeg(Math.atan2(vector.x, vector.y) + Math.PI);
	},

	bounce: function(vector, bounciness, sideHit) {
		if(sideHit == "top" || sideHit == "bottom") return Vector2D.create(vector.x * bounciness, -vector.y * bounciness);
		if(sideHit == "left" || sideHit == "right") return Vector2D.create(-vector.x * bounciness, vector.y * bounciness);
	},
	
	getRect: function(obj) {
		var pos = obj.getPosition();
		var bBoxDims = obj.getBoundingBox().dims;
		return Rectangle2D.create(pos.x, pos.y, bBoxDims.x, bBoxDims.y);
	}
	
	}, {

		getClassName: function() {
			return "Collider";
		},
	});

	return Collider;
});