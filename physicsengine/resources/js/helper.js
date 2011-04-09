/**
 * Random number
 * 
 * @param	{Number} min
 * @param	{Number} max
 * @return	{Number}
 */

function randomNumber(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}