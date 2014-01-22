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
    * Longueur du code (tient compte du retour chariot, l'inclut dans le compte)
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
  
  /**
    * Propriété qui détermine si l'étape doit être “flashée” (exécutée le plus
    * rapidement possible) ou exécutée normalement.
    * Cette propriété est utile pour les demandes de jeu d'une sélection seulement
    * du code (tout ce qui est avant devrait être exécuté, sauf pas qui peuvent
    * être passés).
    * @property flashed
    */
  this.flashed = false
  
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
    * Exécute l'étape
    * @method exec
    */
  exec:function()
  {
    if(this.is_comment || this.is_empty)              return false
    if(Anim.options.caption_omit && this.is_caption)  return false
    if(this.flashed) MODE_FLASH = true
    try
    { 
      dlog("Pas.exec("+this.trimed+")")
      // Anim.Step.set_exec_on()
      eval('Anim.Objects.'+this.trimed) 
    }
    catch(err){ 
      dlog("[<Pas>.exec] # Erreur : "+err+" survenue (noter que cela aura pour conséquence directe de passer à l'étape suivante).")
      this.on_error(err, retry = true) 
    }
    // S'il y a eu plusieurs essais
    if(this.timer_tries_exec)
    {
      clearTimeout(this.timer_tries_exec)
      delete this.tries_exec
    }
    if(this.flashed) MODE_FLASH = false
    return true
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
        errMess = "# ERROR:"+error+". J'ai essayé de jouer 3 fois le code `this.Objects."+this.code+"` (étape #"+this.id+") en vain. Je poursuis, sans bien être sûr du résultat produit…"
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
      errMess = "# Erreur: "+error+ " survenue avec le code `this.Objects."+this.code+"` (#"+this.id+"). Mais j'essaie de poursuivre."
      F.error(errMess)
      dlog("#ERROR# "+errMess)
    }
    this.errors.push(error)
    NEXT_STEP()
  },
  /**
    * Sélectionne l'étape dans le code
    * Notes
    *   * On blure tout de suite de la console pour ne pas effacer le code
    *     sélectionné avec le raccourci SPACE (pour arrêter l'animation)
    * @method select
    */
  select:function()
  {
    Console.select({start:this.offset_start, end:this.offset_end, blur:true})
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
  },
  /**
    * Propriété qui détermine si l'étape est une étape "préambule" c'est-à-dire
    * soit un réglage de préférence (DEFAULT), soit un commentaire, etc., toute
    * étape qui ne “produit” rien de l'animation.
    * @property {Boolean} is_etape_preambule
    */
  "is_etape_preambule":{
    get:function(){
      if(undefined == this._is_etape_preambule)
      {
        this._is_etape_preambule = this.is_comment || this.is_empty || this.is_setting
      }
      return this._is_etape_preambule
    }
  },
  /**
    * Return TRUE si l'étape est un commentaire
    * @property {Boolean} is_comment
    */
  "is_comment":{
    get:function(){
      if(undefined == this._is_comment) this._is_comment = (this.trimed.substring(0,1) == "#")
      return this._is_comment
    }
  },
  /**
    * Return TRUE si l'étape est une ligne vide
    * @property {Boolean} is_comment
    */
  "is_empty":{
    get:function(){
      if(undefined == this._is_empty) this._is_empty = this.trimed == ""
      return this._is_empty
    }
  },
  /**
    * Return TRUE si l'étape est un réglage par défaut
    * @property {Boolean} is_comment
    */
  "is_setting":{
    get:function(){
      if(undefined == this._is_setting)
      {
        this._is_setting =  this.trimed.substring(0,7) == "DEFAULT" || 
                            this.trimed.substring(0,6) == "SUITE("
      }
      return this._is_setting
    }
  },
  /**
    * Return TRUE si l'étape est un sous-titre ou doublage (CAPTION)
    * @property {Boolean} is_caption
    */
  "is_caption":{
    get:function(){
      if(undefined == this._is_caption) this._is_caption = this.trimed.substring(0,7) == 'CAPTION'
      return this._is_caption
    }
  },
  /**
    * Return TRUE si le pas concerne une image (contient IMAGE)
    * @property {Boolean} is_image
    */
  "is_image":{
    get:function(){
      if(undefined == this._is_image) this._is_image = this.code.indexOf('IMAGE') > -1;
      return this._is_image
    }
  }
  
  
})