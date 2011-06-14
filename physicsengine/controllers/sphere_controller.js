/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Physicsengine.Controllers.Sphere',
/* @Static */
{

},
/* @Prototype */
{

	positionX: 100,
	positionY: 100,
	speedX: 0,
	speedY: 0,
	dragging: false,
	radius: 20,
	color: '#0073EA',
	

	/**
	 * Render object
	 * 
	 * Creates the object to place in the world canvas
	 * 
	 * @param	{Object} context	canvas 2d context object
	 * @return	void
	 */
	
	renderObject: function(context) {
	
		context.beginPath();
		context.arc(this.positionX, this.positionY, this.radius, 0, Math.PI*2, true);
		context.fillStyle = this.color;
		context.closePath();
		context.fill();
		
	},
	
	
	/**
	 * Is Coordinate In Object
	 * 
	 * Checks whether a coordinate is inside the sphere or not
	 * 
	 * @param	{Number} x
	 * @param	{Number} y
	 * @return	{Boolean}
	 */
	
	isCoordinateInObject: function(x, y) {
		
		var diffX = Math.abs(this.positionX - x);
		var diffY = Math.abs(this.positionY - y);

		return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) <= this.radius;
		
	},
	
	
	/**
	 * Check Collision With Sphere
	 * 
	 * Checks if a sphere collides with this one
	 * 
	 * @param	{Object} object
	 * @return	{Boolean}
	 */
	
	checkCollisionWith: function(object) {

		var objectType = object.Class._shortName;

		var result = {
			collision: false,
			distance: null
		};
		
		switch(objectType) {
		
			case 'sphere':
				
				var diffX = Math.abs(this.positionX - object.positionX);
				var diffY = Math.abs(this.positionY - object.positionY);

				result.distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
				result.collision = result.distance <= (this.radius + object.radius);				
				break;
				
			case 'world':
				
				//hitting the left border
				if(this.positionX - this.radius <= 0) {
					result.collision = true;
					
				//hitting the right border
				} else if(this.positionX + this.radius >= object.canvasWidth) {
					result.collision = true;
					
				//hitting the top border
				} else if(this.positionY - this.radius <= 0) {
					result.collision = true;
					
				//hitting the top border
				} else if(this.positionY + this.radius >= object.canvasHeight) {
					result.collision = true;
				}
				break;
				
			default:
				throw 'Unsupported object type';
		}
		
		return result;		
	},
	
	
	/**
	 * Place Next To
	 * 
	 * This function changes the coordinates of an object to locate it exactle near the colliding object
	 * 
	 * @param	{Object} object
	 * @return	{Boolean}
	 */
	
	placeNextTo: function(object) {

		var objectType = object.Class._shortName;

		switch(objectType) {
		
			case 'sphere':
				
				var diffX = this.positionX - object.positionX;
				var diffY = this.positionY - object.positionY;
				var angle = Math.atan(Math.abs(diffY) / Math.abs(diffX));
				var newAbsDiffX = Math.cos(angle) * (this.radius + object.radius);
				var newAbsDiffY = Math.sin(angle) * (this.radius + object.radius);
				var newDiffX = diffX < 0 ? newAbsDiffX * (-1) : newAbsDiffX;
				var newDiffY = diffY < 0 ? newAbsDiffY * (-1) : newAbsDiffY;

				this.positionX = newDiffX + object.positionX;
				this.positionY = newDiffY + object.positionY;
				
				break;
				
			case 'world':
				
				//for the world border we don't care. should work anyway..
				return;
				
		}
		
	},
	
	
	/**
	 * Collide With
	 * 
	 * Collide with another object
	 * 
	 * @param	{object} object
	 */
	
	collideWith: function(object) {
	
		var objectType = object.Class._shortName;
		
		switch(objectType) {
		
			case 'sphere':
				
				//calc distance between centers
				var dx = object.positionX - this.positionX;
				var dy = object.positionY - this.positionY;
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				//Unit vector in direction of the collision 
				var ax = dx / distance;
				var ay = dy / distance;
				
				//projection of the velocities in these axes
				var va1 = this.speedX * ax + this.speedY * ay;
				var vb1 = -this.speedX * ay + this.speedY * ax;
				var va2 = object.speedX * ax + object.speedY * ay;
				var vb2 = -object.speedX * ay + object.speedY * ax;
				
				//new velocities after the collision
				var vaP1 = va1 + (1 + 1) * (va2 - va1)/(1 + 1 / 1);
				var vaP2 = va2 + (1 + 1) * (va1 - va2)/(1 + 1 / 1);
				
				//undo the projection
				this.speedX = vaP1 * ax - vb1 * ay;
				this.speedY = vaP1 * ay + vb1 * ax;
				
				object.speedX = vaP2 * ax - vb2 * ay;
				object.speedY = vaP2 * ay + vb2 * ax;
				
				break;
				
			case 'world':

				//hitting the left border
				if(this.positionX - this.radius <= 0) {

					//flip X direction
					this.positionX = this.radius + 1;
					this.speedX = -1 * this.speedX * object.borderSpeedReduction;
					
				//hitting the right border
				} if(this.positionX + this.radius >= object.canvasWidth) {

					//flip X direction
					this.positionX = object.canvasWidth - this.radius - 1;
					this.speedX = -1 * this.speedX * object.borderSpeedReduction;
					
				//hitting the top border
				} if(this.positionY - this.radius <= 0) {

					//flip Y direction
					this.positionY = this.radius + 1;
					this.speedY = -1 * this.speedY * object.borderSpeedReduction;
					
				//hitting the bottom border
				} if(this.positionY + this.radius >= object.canvasHeight) {

					//flip Y direction
					this.positionY = object.canvasHeight - this.radius - 1;
					this.speedY = -1 * this.speedY * object.borderSpeedReduction;
					
				}
				
				break;
				
			default:
				throw 'Unsupported object type';
		}
		
	}
	
});