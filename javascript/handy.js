/**
  * @module handy.js
  */

/** Prends une valeur de longueur de l'animation (width, height, x, y, etc.)
  * et, si elle est exprimée en pourcentage, la convertit en pixels par rapport
  * à la taille de l'animation courante.
  *
  * @method as_pixels
  * @for window
  * @param {Number|String}  value  La valeur fournie
  * @param {Boolean}        for_width   True si c'est pour une largeur (sinon, hauteur)
  * @return {String|Null} La valeur en pixels
  */
window.as_pixels = function(value, for_width)
{
  if('number' == typeof value) return with_unite(value, 'px')
  else if ('string' == typeof value)
  {
    if(undefined == for_width) for_width = true
    if(value.substring(value.length-1) == '%')
    {
      return parseInt(Anim.Dom[for_width ? 'width':'height'] * parseInt(value) / 100) + 'px'
    }
  }
  else return null
}
/**
  * Fonction retournant la valeur CSS à mettre, en ajoutant 'px' si 
  * nécessaire (ie lorsque la valeur ne contient pas '%' ou une autre unité)
  * @method with_unite
  * @for window
  * @param {Number|String}  value   La valeur à testée
  * @param {String}         unite   L'unité ('px' par défaut)
  * @return {String|Null} la valeur à mettre dans les styles de l'objet DOM
  */
window.with_unite = function(value, unite)
{
  if(undefined == unite) unite = 'px'
  switch(typeof value)
  {
  case 'number':
    value = "" + value + unite
    break
  case 'string':
    if(value.replace(/[0-9]/g, '') == "") value += unite
    break
  default:
    value = null
  }
  return value
}

/**
  * Beaucoup de méthodes permettent d'être invoquée avec `(attr, value)` qui
  * doit être transformé en `{attr: value}`. Lorsque `attr` est string, on peut
  * appeler cette fonction pour créer l'objet
  * @method parametize
  * @param  {String} attr   La propriété de l'objet retourné
  * @param  {Any}    value  La valeur de la propriété dans l'objet retourné
  * @return {Object} Un objet définissant la propriété +attr+
  */
window.parametize = function(attr, value)
{
  if('object' == typeof attr) return attr
  var obj = {}
  obj[attr] = value
  return obj
}

window.dlog = function(foo)
{
  if('object'==typeof foo) console.dir(foo)
  else console.log(foo)
}