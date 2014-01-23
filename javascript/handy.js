/**
  * @module handy.js
  */

/**
  * Méthode définissant la propriété `complete` si nécessaire
  * @method define_complete
  * @for window
  * @return {Object}  Les paramètres, auxquels a été ajouté la méthode complete
  *                   (à NEXT_STEP) si elle n'existait pas.
  */
window.define_complete = function(params)
{
  if(undefined == params) params = {}
  if(undefined == params.complete) params.complete = NEXT_STEP
  return params
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