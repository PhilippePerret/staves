/**
  * @module Pas.js
  */

/**
  * Instance des étapes
  * -------------------
  *
  * Notes
  * -----
  *   * Mis dans le dossier Anim par convénience, mais appartient à window.
  *   * L'instance a été inauguré pour gérer le jeu de la sélection. Avec chaque
  *     étape doit être conservé son index pour une sélection correcte.
  *
  * @class Pas
  * @for window
  * @constructor
  * @param  {Object} params   Les paramètres
  *   @param  {String}  params.code   Le code à jouer (sans retour chariot) (mandatory)
  *   @param  {Number}  params.offset_start   Le décalage du code dans la console (mandatory)
  */
window.Pas = function(params)
{
  /**
    * Identifiant de l'étape
    * @property {Number} id
    */
  this.id = ++ Pas.last_id
  /**
    * Code de l'étape
    * @property {String} code
    */
  this.code = null
  /**
    * Offset de départ dans le code total
    * @property {Number} offset_start (0-start)
    */
  this.offset_start = null
  /**
    * Longueur du code
    * @property {Number} length
    */
  this.length = null
  /**
    * Offset de fin dans le code total
    * @property {Number} offset_end
    */
  this.offset_end = null
  
  /**
    * Liste {Array} des erreurs produites au cours de l'exécution du code
    * @property {Array} errors
    * @default []
    */
  this.errors = []
  
  var me = this
  L(params).each(function(k,v){me[k]=v})
  
  /* Calcul des valeurs nécessaires */
  this.length     = this.code.length + 1 // le retour chariot
  this.offset_end = this.offset_start + this.length - 1
}

/* ---------------------------------------------------------------------
 *  Méthodes et propriétés de classe
 *  
 */
$.extend(Pas,{
  /**
    * Dernier identifiant d'étape affecté
    * @property {Number} last_id
    */
  last_id: 0
})


/* ---------------------------------------------------------------------
 *  Méthodes et propriétés d'instance
 *  
 */
$.extend(Pas.prototype,{
  
  /**
    * == Main ==
    *
    * Exécuter l'étape
    * @method exec
    */
  exec:function()
  {
    try{ eval('Anim.Objects.'+this.trimed) }
    catch(err){ this.on_error(err, retry = true) }
    // S'il y a eu plusieurs essais en mode flash
    if(this.timer_tries_exec)
    {
      clearTimeout(this.timer_tries_exec)
      delete this.tries_exec
    }
  },
  /**
    * Méthode appelée en cas d'erreur, principalement lors de l'exécution de
    * l'étape
    * @method on_error
    * @param  {String|Object} error  L'erreur rencontrée
    * @param  {Boolean}       retry   Si true, on tente de ré-exécuter l'étape
    */
  on_error:function(error, retry)
  {
    var errMess
    
    if(MODE_FLASH)
    {
      if(this.tries_exec && this.tries_exec > 2)
      {
        errMess = "# ERROR:"+error+". J'ai essayé de jouer 3 fois le code `this.Objects."+this.current.code+"` (étape #"+this.current.id+") en vain. Je poursuis, sans bien être sûr du résultat produit…"
        F.error(errMess)
        dlog("#ERROR# "+ errMess)
      }
      else
      {
        if(undefined == this.tries_exec) this.tries_exec = 0
        ++ this.tries_exec
        if(this.timer_tries_exec) clearTimeout(this.timer_tries_exec)
        this.timer_tries_exec = setTimeout($.proxy(this.exec, this), 500)
        return
      }
    }
    else // mode non flash (normal)
    {
      errMess = "# Erreur: "+error+ " survenue avec le code `this.Objects."+this.current.code+"` (#"+this.current.id+"). Mais j'essaie de poursuivre."
      F.error(errMess)
      dlog("#ERROR# "+errMess)
    }
    this.errors.push(error)
    NEXT_STEP()
  },
  /**
    * Sélectionne l'étape dans le code
    * @method select
    */
  select:function()
  {
    Console.select({start:this.offset_start, end:this.offset_end})
  },
  
  /**
    * Retourne True si le pas est une ligne de commentaires
    * @method is_comment
    * @return {Boolean} True si commentaire
    */
  is_comment:function()
  {
    if(undefined == this._is_comment) this._is_comment = (this.trimed.substring(0,1) == "#")
    return this._is_comment
  },
  
  /**
    * Retourne TRUE si le pas est du code vide
    * @method is_empty
    * @return {Boolean} True si vide (trimé)
    */
  is_empty:function()
  {
    if(undefined==this._is_empty) this._is_empty = (this.trimed == "")
    return this._is_empty
  }
})

/* ---------------------------------------------------------------------
 *  Propriétés d'instance complexes
 *  
 */
Object.defineProperties(Pas.prototype,{
  /**
    * Code "trimé"
    * @property {String} trimed
    */
  "trimed":{
    get:function(){
      if(undefined == this._trimed) this._trimed = this.code.trim()
      return this._trimed
    }
  }
})