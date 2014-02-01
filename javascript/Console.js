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
    * Width de la console quand elle est ouverte
    * Note : Définie par UI.onresize_window
    * @property {Number} width_opened
    */
  width_opened: null,
  /**
    * Width de la console quand elle est fermée
    * Note : Définie par UI.onresize_window
    * @property {Number} width_ranged
    */
  width_ranged: null,
  /**
    * Hauteur de la console
    * Note : Définie par UI.on_resize
    * @property {Number} height
    */
  height: null,
  /**
    * Liste des étapes préambule de l'animation courante
    * @rappel : les étapes "préambule" sont des étapes à interpréter avant que
    * l'animation ne soit lancée
    * @property {Array} preambule
    */
  preambule:[],
  
  /**
    * On utilise cette propriété pour pouvoir sélectionner des choses dans la console
    * sans déclencher le mécanisme du focus qui l'ouvre.
    * Lorsque la propriété est TRUE, la méthode on_focus s'en retourne sans rien faire
    * @property {Boolean} focus_disabled
    * @default false
    */
  focus_disabled:false,
  
  /**
    * Ouvre la console (l'étend)
    * @method open
    */
  open:function()
  {
    if(Anim.on && !Anim.pause_on) return
    this.section.animate({right:"8px"})
  },
  /**
    * Range la console (la rétracte)
    * @method range
    */
  range:function()
  {
    this.section.animate({right:"-"+(this.width_opened - this.width_ranged)+"px"})
  },
  /**
    * Méthode qui s'occupe de l'autocompletion. Par exemple, lorsque l'on tape
    * une accolade ouverte, la méthode écrit l'accolade fermante et place le curseur
    * à la bonne position. Lorsque l'on tape une accolade fermante, on vérifie s'il y
    * en a une après et on déplace simplement le curseur derrière si c'est le cas,
    * etc.
    * + la tabulation permet de l'autocomplétion de mots.
    *
    * La méthode est appelée dès qu'on frappe une touche alors que le focus se
    * se trouve dans la console.
    *
    * @method autocompletion
    * @param  {KeybaordEvent} evt L'évènement Keyboard (keypress)
    * @return {Boolean} TRUE si une autocompletion a été exécutée, false otherwise
    */
  autocompletion:function(evt)
  {
    /*
     *  Autocomplétion complexe, avec la touche tabulation
     *  
     */
    var dbef, dauto ;
    if(evt.keyCode == K_TAB)
    {
      // On prend les trois caractères avant la position du curseur
      dbef = Selection.around(this.console, {before:true, length:3})
      if(undefined != DATA_AUTOCOMPLETION[dbef.content])
      {
        dauto = DATA_AUTOCOMPLETION[dbef.content]
        // Si le paramètre `fourth` est défini, il faut chercher la quatrième
        // lettre
        if(dauto.fourth)
        {
          dbef = Selection.around(this.console, {before:true, length:4})
          if(undefined == DATA_AUTOCOMPLETION[dbef.content]) return false
          dauto = DATA_AUTOCOMPLETION[dbef.content]
        }
      	this.console[0].setSelectionRange(dbef.start, dbef.end)
        Selection.set(this.console, dauto.replace, {end:-dauto.boffset, length:dauto.length || 0})
        return true
      }
      return false // renverra true
    }
    /*
     *  Autocomplétion simple (p.e. "{" => "{}")
     *  
     */
    switch(evt.charCode)
    {
    case 34  : // guillemets (apostrophe double)
      return this.closed_char_or_move_cursor('"', '"', 1)
    case 39  : // apostrophe simple
      return this.closed_char_or_move_cursor("'", "'", 1)
    case 44  : // virgule (on la passe s'il y en a une après)
      return this.move_cursor_if_next(',', 1)    
    case 123 : // accolade ouvrante
    case 125 : // accolade fermante
      return this.closed_char_or_move_cursor("{", "}", 1)
    case 40  : // Parenthèse ouvrante
    case 41  : // Parenthèse fermante
      return this.closed_char_or_move_cursor("(", ")", 1)
    case 91  : // Crochet ouvrant
    case 93  : // Crochet fermant
      return this.closed_char_or_move_cursor("[", "]", 1)
    default:
      // Décommenter pour avoir le charCode/keyCode de la touche
      // UI.feedback("[Console.autocompletion] charCode:"+evt.charCode+" / "+"keyCode:"+evt.keyCode)
    }
    return false
  },
  /**
    * Méthode qui ajoute le caratère "fermant" au caractère fourni, sauf
    * si ce caractère suit la position courante du curseur
    * @method closed_char_or_move_cursor
    * @param  {String}  opening_char    Le caractère qui provoque l'appel
    * @param  {String}  closing_char    Le caractère fermant à ajouter
    * @param  {Number}  moving          Le déplacement de curseur à effectuer
    * @return {Boolean} TRUE pour pouvoir renvoyer tout de suite la méthode
    */
  closed_char_or_move_cursor:function(opening_char, closing_char, moving)
  {
    var around = this.around_selection(false, 1)
    if( around.content == closing_char)
    {
      this.select({start:around.start+1, end:around.start+1})
    } 
    else
    {
      this.set_caret_to(opening_char+closing_char, moving)
    }
    return true
  },
  /**
    * Méthode qui déplace le curseur d'un caractère vers la droite si
    * le caractère suivant (ou le texte) est +next_str+
    * @method move_cursor_if_next
    * @param {String} next_str
    */
  move_cursor_if_next:function(next_str)
  {
    var len_str = next_str.length
    var around  = this.around_selection(false, len_str)
    if(around.content != next_str) return false
    this.select({start:around.start+len_str, end:around.start+len_str})
    return true
  },
  /**
    * Méthode qui place le texte +inserted+ à la position du curseur et place
    * le cursor au décalage +back_offset+ (0 par défaut = après l'ajout)
    * @method set_caret_to
    * @param  {String} inserted Le nouveau texte
    * @param  {Number} back_offset  Le décalage gauche (arrière) par rapport à la fin de l'insert.
    *                           Par exemple, la valeur `1` fera REMONTER le curseur d'un caractère.
    *
    */
  set_caret_to:function(inserted, back_offset)
  {
    if(undefined == back_offset) back_offset = 0
    else back_offset = - back_offset
    Selection.set(this.console, inserted, {end:back_offset})
  },
  
  /*
   *  ---------------------------------------------------------------------
   *  
   */
  /**
    * Méthode appelée quand on focus dans le code console
    * @method onfocus
    */
  onfocus:function()
  {
    if(this.focus_disabled || (Anim.on && !Anim.pause_on)) return true
    this.open()
    IN_CONSOLE = true
  },
  /**
    * Méthode appelée quand on blure du code console
    * @method onblur
    */
  onblur:function(evt)
  {
    if(Anim.on && !Anim.pause_on) return true
    this.range()
    IN_CONSOLE = false
    $('input#nothing')[0].blur()
    return stop_event(evt)
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
    * Affiche la ligne de code actuellement jouée
    * @method show_code_line
    * @param {String} code_line La ligne de code
    */
  show_code_line:function(code_line)
  {
    $('div#console_last_step').html(code_line)
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
    while(liste[0] && liste[0].is_etape_preambule) this.preambule.push(liste.shift())
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
    * Retourne les +x+ caractères avant ou après la sélection courante
    * @method around_selection
    * @param {Boolean} before   Si true, les caractères avant sinon après
    * @param {Number}  length   Le nombre de caractères à retourner
    * @param {Boolean} only_content  Si true, la méthode ne retourne que le texte (false par défaut)
    * @return {Object|String} Soit un objet contenant {content, start, end} soit seulement le texte
    */
  around_selection:function(before, length, only_content)
  {
    var sel = Selection.around(Console.console, {before:before, length:length})
    if(only_content)  return sel.content
    else              return sel
  },
  /**
    * Sélectionne une partie du texte (ou place le curseur)
    * @method select
    * @param  {Object} params Les paramètres obligatoires
    *   @param  {Number} params.start   Début de la sélection
    *   @param  {Number} params.end     Fin de la sélection
    */
  select:function(params)
  {
    if(params.disable_focus) this.focus_disabled = true
    Selection.select(this.console, {start:params.start, end:params.end})
    if(params.blur) this.console[0].blur()
    if(params.disable_focus) this.focus_disabled = false
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
    Anim.File.modified = true
    if(Anim.options.autosave) Anim.File.save()
  },
  
  /**
    * Méthode qui reçoit une liste ou un string de code et le transforme
    * en instances Pas.
    * Notes
    * -----
    *   * La méthode gère aussi les images pour les charger tout de suite.
    *
    * @method code2pas
    * @protected
    * @param {String|Array} arr_lines   Le code brut ou une liste de strings
    * @param {Object} params    Paramètres optionnels
    *   @param {Number}  params.offset      La position initiale du curseur
    *   @param {Array}   params.array       Éventuellement, la liste à laquelle les pas doivent être ajoutés
    *   @param {Boolean} params.as_flash    Si true, le code envoyé est un code
    *                                       à jouer en mode "flash" (rapide), et
    *                                       donc une propriété `flashed` doit être mise à true
    *                                       et certaines étapes sont passées.
    * @return {Array of Pas} Liste des instances de Pas (étapes) correspondant au code
    */
  code2pas:function(arr_lines, params)
  {
    var step, cur_offset ;
    if(undefined == params) params = {}
    if(undefined == params.offset)    params.offset   = 0
    if(undefined == params.as_flash)  params.as_flash = false
    if(undefined == params.array)     params.array    = []
    if('string' == typeof arr_lines) arr_lines = arr_lines.split("\n")
    cur_offset = params.offset
    L(arr_lines).each(function(line){
      // On calcule les positions du curseur ici car en mode flash (as_flash),
      // certaines étapes sont passées.
      cur_start   = parseInt(cur_offset, 10)
      cur_offset += line.length + 1
      if(params.as_flash && line.match(/^(WAIT|CAPTION)/)) return
      step = new Pas({code:line, offset_start:cur_start, flashed: params.as_flash})
      if(step.is_image) Img.preload_image_of_code(step.code)
      params.array.push( step )
    })
    return params.array
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
    * L'objet DOM de la section console
    * @property {jQuerySet} section
    */
  "section":{
    get:function(){return $('section#section_console')}
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
        Pas.last_id  = 0
        this._etapes = this.expurge_preambule(this.code2pas(this.raw))
      }
      return $.merge([], this._etapes) // clone
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
    *                          nécessaires. Note : c'est un clone de la liste conservée.
    */
  "steps_selection":{
    get:function(){
      if( !this._steps_selection )
      { // => Première sélection (ou modification du code), on la calcule
        Pas.last_id = 0
        var sel   = this.get_selection()
        // == Les étapes avant les étapes à vraiment jouer ==
        var steps = this.code2pas(this.get_code(0, sel.start), {as_flash:true})
        // == Les étapes à partir desquelles jouer ==
            steps = this.code2pas(sel.content, {array:steps, cur_offset:parseInt(sel.start,10)})
        this._steps_selection = this.expurge_preambule(steps)
      }
      // Il faut renvoyer un clone car l'exécution des étapes mange (shift) dans
      // cette liste renvoyée.
      return $.merge([], this._steps_selection)
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
      if(start == -1) start = 0
      var end   = this.raw.indexOf("\n#!END")
      if(end == -1) end = this.raw.length - 1
      this.select({start:start+1, end:end, disable_focus:true})
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
      this.select({start:start+1, end:this.raw.length, disable_focus:true})
      delete this._steps_selection  // pour forcer le recalcul
      return this.steps_selection
    }
  }
})