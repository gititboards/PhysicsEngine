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

		switch(objectType) {
		
			case 'sphere':
				
				var diffX = Math.abs(this.positionX - object.positionX);
				var diffY = Math.abs(this.positionY - object.positionY);
		
				return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) <= (this.radius + object.radius);
				
			case 'world':
				
				//hitting the left border
				if(this.positionX - this.radius <= 0) {
					return true;
					
				//hitting the right border
				} else if(this.positionX + this.radius >= object.canvasWidth) {
					return true;
					
				//hitting the top border
				} else if(this.positionY - this.radius <= 0) {
					return true;
					
				//hitting the top border
				} else if(this.positionY + this.radius >= object.canvasHeight) {
					return true;
				}
				
				return false;
					
				
			default:
				throw 'Unsupported object type';
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
				
				return false;
					
				
			default:
				throw 'Unsupported object type';
		}
		
	}
	
});