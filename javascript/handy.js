/**
  * @module handy.js
  */

/**
  * Méthode qui retourne TRUE si les paramètres +params+ contiennent une des clés contenues
  * dans +keys+
  * @method object_has_key
  * @for window
  * @param {Object}   objet   L'objet qu'il faut tester
  * @param {Array}    keys    La liste des clés
  * @param {Boolean}  all     Si true, toutes les clés doivent être trouvées (false par défaut)
  * @return TRUE si la clé (ou toutes les clés) a été trouvée. False otherwise.
  */
window.object_has_key = function(objet, keys, all)
{
  var i, len, key ;
  for(i = 0, len = keys.length; i<len; ++i)
  {
    key = keys[i]
    if(all && undefined === objet[key]) return false
    else if(!all && undefined !== objet[key])   return true
  }
  return all ? true : false
}
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

/** Message de suivi en console
  * @method dlog
  * @param {Object|String}  foo       Ce qu'il faut placer en console.
  * @param {Boolean}        is_error  Si true, c'est un message d'erreur qui est produit (false par défaut)
  * @return {String} le message, mais seulement si foo n'est pas un objet.
  */
window.dlog = function(foo, is_error)
{
  if('object'==typeof foo) console.dir(foo)
  else
  {
    if(is_error) console.error(foo)
    else console.log(foo)
    return foo // pour l'utiliser dans le code par exemple
  } 
}

/** Pour le débuggage, retourne le nombre de secondes courant, avec
  * deux décimales pour les millisecondes et l'écrit en console
  * Note
  * ----
  *   * Si un point de départ a été défini avec la méthode `now_start`, c'est
  *     ce point de référence qui est utilisé. Sinon, on prend la date courante
  *
  * @method now
  * @for window
  * @return {String} Le nombre de secondes avec millisecondes ("SSSS.MM")
  */
window.now = function()
{
  var time_now, dtime, time, dlaps ;
  time_now = Time.now()
  // La donnée temps depuis le départ temporel ou absolu
  dtime = Time.decompose(time_now - (this.now.start || 0))
  time = "= TIME POINT = " + dtime.scs + "." + dtime.only_mls
  // La donnée temps depuis le dernier passage dans cette méthode
  if(this.now.now_last)
  {
    dlaps = Time.decompose(time_now - this.now.now_last)
    time += " [depuis dernier PT : "+dlaps.scs+"."+dlaps.only_mls+"]"
  } 
  // On mémorise ce temps courant
  this.now.now_last = parseInt(time_now)
  dlog(time)
  return time
}
/** Pose un point de départ pour le débuggage
  * @method now_start
  * @for window
  */
window.now_start = function()
{
  this.now.start = Time.now()
  dlog("= START POINT TEMPOREL =")
}