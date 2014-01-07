/**
  * @module Console.js
  */

/**
  * Gestion de la console pour définir l'animation
  *
  * @class Console
  * @static
  */
if(undefined == window.Console) Console = {}
$.extend(window.Console,{
  
  /**
    * Décalage actuel du "curseur", c'est-à-dire de la fin de la sélection
    * @method {Number} cursor_offset
    * @default 0
    */
  cursor_offset:0,
  
  /**
    * Mets un code en console.
    * @method set
    * @param  {String|Array} code   Le code à écrire, sous forme de String ou d'Array
    */
  set:function(code)
  {
    if('string'!=typeof code) code = code.join("\n")
    this.console.val(code)
  },
  
  /**
    * Déplace le "curseur" de la console, c'est-à-dire exactement sa
    * portion de sélection.
    * Notes
    * -----
    *   * La nouvelle position courante (this.cursor_offset) est mise à la 
    *     nouvelle position params.to.
    *
    * @method move_cursor
    * @param {Object} params Les paramètres obligatoires
    *   @param  {Number} params.for  Le nombre de caractères à sélectionner depuis la position courante
    */
  move_cursor:function(params)
  {
    this.select({start:this.cursor_offset, end:this.cursor_offset + params.for})
    this.cursor_offset += parseInt(params.for,10)
  },
  
  /**
    * Sélectionne une partie du texte (en général, l'étape courante)
    * @method select
    * @param  {Object} params Les paramètres obligatoires
    *   @param  {Number} params.start   Début de la sélection
    *   @param  {Number} params.end     Fin de la sélection
    */
  select:function(params)
  {
    Selection.select(this.console, {start:params.start, end:params.end})
  }
  
})

Object.defineProperties(window.Console,{
  /**
    * L'objet DOM de la console
    * @property {jQuerySet} console
    */
  "console":{
    get:function(){return $('textarea#console')}
  },
  
  /**
    * Retourne le code brut de la console
    * @property {String} raw
    */
  "raw":{
    get:function(){return this.console.val().trim()}
  },
  /**
    * Récupère le code dans la console, comme une liste de pas
    *
    * @property steps
    * @return {Array} Liste des strings représentant les pas de l'animation
    */
  "steps":{
    get:function(){
      return this.raw.split("\n")
    }
  }
})