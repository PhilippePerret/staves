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
    * Retourne les étapes sélectionnés. Permet de ne jouer qu'une partie du code.
    * Notes
    * -----
    *   * Mais l'opération n'est pas aussi simple que ça : il faut jouer les
    *     code qui gèrent les portées et autres réglages par défaut.
    *     Donc l'opération se fait en deux temps :
    *     1.  On prend le code sélectionné pour connaitre l'offset et le contenu
    *     2.  On passe en revue l'intégralité du code en conservant les lignes
    *         qui doivent être jouées.
    *   * La méthode règle aussi le `cursor_offset` pour pouvoir suivre correctement
    *     le code. On pourrait imaginer faire une petite correction pour être sûr
    *     de prendre le code depuis le premier caractère.
    *   * On mémorise les informations pour pouvoir rejouer la même sélection
    *
    * @method steps_selection
    * @return {Array} La liste des étapes sélectionnées et étapes précédentes
    *                 nécessaires.
    */
  steps_selection:function()
  {
    if(this.steps_selection.steps)
    { // => On a déjà calculé la sélection, on la rejoue
      this.cursor_offset = this.steps_selection.cursor
    }
    else
    { // => Première sélection, on la calcule
      var sel   = this.get_selection()
      var steps = sel.content.split("\n")
      var befor = this.get_code(0, sel.start)
      var steps_before = []
      L(befor).each(function(line){
        if(line.contains('STAFF') || line.contains('DEFAULT') || line.contains('NEXT'))
        {
          steps_before.push(line)
        }
      })
      this.cursor_offset = sel.start
      this.steps_selection.steps  = steps_before.concat(steps)
      this.steps_selection.cursor = parseInt(sel.start,10)
    }
    return this.steps_selection.steps
  },
  /**
    * Retourne le code depuis le caractère +from+ (0-start) jusqu'au caractère
    * +to+. Si +as_list+ est true, sous forme de liste (true par défaut).
    * @method get_code
    * @param  {Number} from   Index du premier caractère
    * @param  {Number} to     Index du dernier caractère
    * @param  {Boolean} as_list Si True (défaut) sous forme de liste
    * @return {String|Array}  Le code relevé dans la console
    */
  get_code:function(from, to, as_list)
  {
    if(undefined == as_list) as_list = true
    var code = this.raw.substring(from, to - from + 1)
    if(as_list) code = code.split("\n")
    return code
  },
  /**
    * Récupère la sélection courante pour la jouer
    *
    * @method get_selection 
    * @return {String} Tout le code sélectionné
    */
  get_selection:function()
  {
    return Selection.of(this.console)
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