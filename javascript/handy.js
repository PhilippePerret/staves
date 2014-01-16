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


window.dlog = function(foo)
{
  if('object'==typeof foo) console.dir(foo)
  else console.log(foo)
}