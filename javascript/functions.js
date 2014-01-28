/**
  * @module Functions.js
  */

/** Méthode qui traite la propriété `wait` dans les paramètres de la
  * plupart des méthodes.
  *
  * L'idée est la suivante : si `params.wait` est exactement égal à `false`, on
  * doit immédiatement passer à la suite (ce n'est pas la méthode `animate` ou autre
  * qui s'en charge). Si `params.wait` est un nombre, alors c'est le temps d'attente,
  * en secondes, avant de passer à la suite.
  *
  * @method traite_wait
  * @for window
  * @param {Objet} params   Les paramètres envoyés (peut être indéfini)
  */
window.traite_wait = function(params)
{
  if(undefined == params || undefined === params.wait) return
  if(params.wait === false)
  {
    NEXT_STEP(no_timeout = true)
  }
  else if('number' == params.wait)
  {
    NEXT_STEP(params.wait * 1000)
  }
}