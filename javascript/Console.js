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
    * Méthode appelée quand on focus dans le code console
    * @method onfocus
    */
  onfocus:function()
  {
    window.onkeypress = null
  },
  /**
    * Méthode appelée quand on blure du code console
    * @method onblur
    */
  onblur:function()
  {
    window.onkeypress = KEYPRESS_HORS_CONSOLE
  },
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
    * Retourne le code depuis le caractère +from+ (0-start) jusqu'au caractère
    * +to+. Si +as_list+ est true, sous forme de liste (true par défaut).
    * @method get_code
    * @param  {Number} from   Index du premier caractère (0 par défaut)
    * @param  {Number} to     Index du dernier caractère (le dernier par défaut)
    * @param  {Boolean} as_list Si True (défaut) sous forme de liste
    * @return {String|Array}  Le code relevé dans la console
    */
  get_code:function(from, to, as_list)
  {
    if(undefined == as_list) as_list = true
    if(!from) from = 0
    if(!to  ) to   = this.raw.length
    var code = this.raw.substring(from, to - from + 1)
    if(as_list) code = code.split("\n")
    return code
  },
  /**
    * Expurge de la liste des étapes +liste+ les étapes dite "de préambule" qui
    * ne font que définir des valeurs (par exemple valeurs par défaut).
    * Ces étapes sont toujours interprétées avant le décompte.
    * La méthode produit this.preambule qui sera joué en tout premier lieu.
    * @method expurge_preambule
    * @param {Array de Pas} liste Liste des instances d'étape
    * @return {Array} La liste des étapes sans les étapes de préambule. C'est un
    *                 clone de la liste pour que les méthodes appelantes n'aient pas à le faire
    *                 (il faut un clone pour pouvoir conserver la liste, car celle envoyée sera
    *                  mangée — shift — au cours de l'opération).
    */
  expurge_preambule:function(liste)
  {
    this.preambule = []
    while(liste[0].is_etape_preambule) this.preambule.push(liste.shift())
    return $.merge([], liste)
  },
  /**
    * Récupère la sélection courante
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
    if(params.blur) this.console[0].blur()
  },
  
  /**
    * La méthode est appelée lorsque le code console a été modifié. Cela
    * permet d'initialiser les étapes retenues.
    * Notes
    * -----
    *   * Si la sauvegarde automatique est activée, on enregistre tout de
    *     suite le code.
    *
    * @method onchange_code
    */
  onchange_code:function()
  {
    if(this._etapes)          delete this._etapes
    if(this._steps_selection) delete this._steps_selection
    Anim.modified = true
    if(Anim.options.autosave) Anim.save()
  },
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
    get:function(){return this.console.val()}
  },
  /**
    * Retourne le code brut mais trimé
    * @property {String} raw_trimed
    */
  "raw_trimed":{get:function(){return this.raw.trim()}},
  
  /**
    * Récupère le code dans la console, comme une liste de pas
    * Moins les étapes de préambule éventuelles.
    *
    * Notes
    * -----
    *   * La liste renvoyée est expurgée des pas de "préambule" ou peuvent
    *     être définies des préférences.
    *
    * @property steps
    * @return {Array of Pas} Liste des instances {Pas} de l'animation
    */
  "steps":{
    get:function(){
      if(undefined == this._etapes)
      {
        this._etapes = []
        var me = this, cur_offset = 0, pas ;
        L(this.raw.split("\n")).each(function(line){
          pas = new Pas({code:line, offset_start:cur_offset})
          me._etapes.push( pas )
          cur_offset += pas.length
        })
      }
      return this.expurge_preambule(this._etapes) // clone
    }
  },
  /**
    * Retourne les étapes sélectionnées. Permet de ne jouer qu'une partie du code.
    * Moins les étapes de préambule éventuelles
    * Notes
    * -----
    *   * Mais l'opération n'est pas aussi simple que ça : il faut jouer les
    *     code qui gèrent les portées et autres réglages par défaut.
    *     Donc l'opération se fait en deux temps :
    *     1.  On prend le code sélectionné pour connaitre l'offset et le contenu
    *     2.  On passe en revue l'intégralité du code en conservant les lignes
    *         qui doivent être jouées.
    *   * On mémorise les informations pour pouvoir rejouer la même sélection
    *   * La liste renvoyée est expurgée des pas de "préambule" ou peuvent
    *     être définies des préférences.
    *
    * @property {Array of Pas} steps_selection La liste des étapes sélectionnées et étapes précédentes
    *                                   nécessaires.
    */
  "steps_selection":{
    get:function(){
      if( !this._steps_selection )
      { // => Première sélection (ou modification du code), on la calcule
        var sel   = this.get_selection()
        var steps = []
        /* == On crée des instances d'étapes précédentes, en sautant
              toutes celles qu'on peut passer 
              On ajoute à toutes ces étapes la propriété `flashed` qui va
              déterminer qu'elles doivent être interprétées le plus vite
              possible.
        */
        Pas.last_id = 0
        var pas, cur_offset = 0 ;
        L(this.get_code(0, sel.start, as_list=true)).each(function(line){
          cur_start   = parseInt(cur_offset, 10)
          cur_offset += line.length + 1
          // Toutes les commandes qu'on peut passer
          if(line.match(/^(WAIT|CAPTION)/)) return
          pas = new Pas({code:line, offset_start:cur_start, flashed:true})
          steps.push(pas)
        })
        // == On crée les instances étapes à partir desquelles jouer ==
        cur_offset = parseInt(sel.start,10)
        L(sel.content.split("\n")).each(function(line){
          pas = new Pas({code:line, offset_start:cur_offset})
          steps.push(pas)
          cur_offset += pas.length
        })
        this._steps_selection = steps
        
      }
      // Il faut renvoyer un clone car l'exécution des étapes mange (shift) dans
      // cette liste renvoyée.
      return this.expurge_preambule(this._steps_selection)
    }
  },
  /**
    * Liste des étapes entre les repères #!START et #!END (+ les étapes indispensables avant)
    * Moins les étapes de préambule éventuelles
    * Notes
    *   * Pour définir la liste on utilise la propriété `steps_selection` simplement
    *     en sélectionnant la portion de texte voulu avant.
    *   * La liste renvoyée est expurgée des pas de "préambule" ou peuvent
    *     être définies des préférences à établir avant le départ.
    *
    * @property {Array of Pas} steps_between_repairs
    */
  "steps_between_repairs":{
    get:function(){
      var start = this.raw.indexOf("\n#!START")
      var end   = this.raw.indexOf("\n#!END")
      if(start < -1 || end < -1)
      {
        F.error("Il faut placer les repères `#!START` et `#!END` dans le code (et les placer sur une ligne vierge) !")
        return null
      }
      this.select({start:start+1, end:end})
      delete this._steps_selection  // pour forcer le recalcul
      return this.steps_selection
    }
  },
  /**
    * Retourne la liste de toutes les étapes à partir du pointeur (qui peut
    * Moins les étapes de préambule éventuelles
    * se trouver à l'intérieur d'une ligne, pas forcément au début)
    * Notes:
    *   * Cette méthode se sert aussi de steps_selection
    *   * Principe : on cherche le premier retour chariot avant la position du curseur
    *     et on place la fin de la sélection à la fin du code.
    * @property {Array of Pas} steps_from_cursor
    */
  "steps_from_cursor":{
    get:function(){
      var dsel    = this.get_selection()
      var before  = this.raw.substring(0, dsel.start)
      var start   = before.lastIndexOf("\n")
      this.select({start:start+1, end:this.raw.length})
      delete this._steps_selection  // pour forcer le recalcul
      return this.steps_selection
    }
  }
})