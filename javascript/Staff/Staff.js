/**
  * @module Staff
  */

/**
  * @class Staff
  * @constructor
  * @param  {Object} params Les paramètres optionnels (n'importe quelle propriété)
  */
window.Staff = function(params)
{
  this.class  = "staff"
  this.cle    = SOL
  
  /**
    * Décalage vertical par défaut de la portée
    * @property {Number} top
    * @default 0
    */
  this.top  = null
  /**
    * Décalage horizontal par défaut de la portée
    * @property {Number} left
    * @default 0
    */
  this.left = Anim.prefs.staff_left
  
  /**
    * Indice (1-start) de la portée dans l'animation
    * Notes
    *   * Il sera défini au moment de la création de la portée (`create`)
    * @property {Number} indice
    */
  this.indice = null
  
  /**
    * Largeur de la portée
    * @property {Number} width
    */
  this.width = null
  
  /**
    * Liste des identifiants de lignes supplémentaires
    * Notes
    *   * Pour le moment, la liste n'est utile que pour la suppression de
    *     la portée, mais TODO à l'avenir il faudra créer une instance
    *     SupLine et enregistrer les instances (qui auront des méthodes comme
    *     les autres objets)
    * @property {Array} suplines
    */
  this.suplines = []
  
  // On définit l'objet complexe this.notes (qui permet de conserver les notes)
  this.notes = $.extend(deep = true, {}, OBJECT_STAFF_NOTES)
  this.notes.staff = this
  
  // On dispatche les valeurs transmises
  var me = this
  L(params || {}).each(function(k,v){me[k]=v})
    
  this.id = "staff"+this.cle+this.top+this.left+(new Date()).getTime()
  
  Anim.staves.push(this)
  this.indice = Anim.staves.length // ! 1-start
  
}
/* ---------------------------------------------------------------------
    Méthodes de classe
   --------------------------------------------------------------------- */
$.extend(Staff,{
  /**
    * Crée une nouvelle portée de clé +cle+ et de métrique +metrique+ sous
    * la dernière portée affichée ou à la hauteur spécifiée (et l'enregistre dans this.staves)
    * Notes
    *   * Cette méthode ne met pas la portée en portée courante, c'est la méthode
    *     appelante qui doit s'en charger ou le code de l'animation.
    *   * Si la portée (son indice) est utilisée dans une préférence (par exemple
    *     la préférence qui détermine sur quelle portée se marqueront les harmonies)
    *     alors l'indice sera remplacé par la Staff.
    * @method create
    * @param  {String} cle La clé de la portée (obligatoire)
    * @param  {Object} params Les paramètres éventuels
    *   @param  {String} params.metrique  La métrique optionnelle
    *   @param  {String} params.armure    L'armure
    *   @param  {Number} params.offset    Le décalage par rapport à la dernière portée
    *   @param  {Number} params.y         La position verticale précise
    *   @param  {Number} params.x         La position horizontale précise
    *   @param  {Number} params.width     La largeur précise
    */
  create:function(cle, params)
  {
    
    params = $.extend(params || {}, {cle:cle, top:this.top_next_staff(params)})
    var data_build = {}
    
    // if(params.wait === false)
    // {
    //   data_build.wait = false
    // }
    // else
    // {
    //   Process.close( params.wait || 0.2 )
    // }
    
    var staff = new Staff(params)
    
    // Cette portée est-elle utilisée dans un réglage des préférences
    // réglé avec DEFAULT('staff_harmony', <indice>) (ou staff_chords)
    L(['staff_harmony', 'staff_chords']).each(function(key){
      if(('number' == typeof Anim.prefs[key]) && Anim.prefs[key] == staff.indice)
      {
        Anim.prefs[key] = staff
      } 
    })
    
    staff.build( {wait: params.wait || 0.1} )
    
    return staff
  },
  
  /**
    * Retourne le top de la prochaine portée. Sauf si la hauteur est donnée explicitement,
    * avec le paramètres +params.y+, la hauteur est calculée par rapport à la portée
    * la plus basse, en ajoutant l'écartement par défaut, auquel est ajouté l'éventuel
    * +params.offset+
    *
    * @method top_next_staff
    * @param  {Object} params           Paramètres optionnels
    *   @param  {Number} params.offset  Le décalage éventuel par rapport à la position naturelle
    */
  top_next_staff:function(params)
  {
    var lower_staff, top ;
    if( undefined == params.y )
    {
      lower_staff = this.get_lower_staff()
      if(undefined !== params.offset_y) params.offset = params.offset_y
      return lower_staff ?
              lower_staff.top + Anim.prefs.staff_offset + (params.offset ? params.offset : 0)
              : Anim.prefs.staff_top
    }
    else return params.y
  },
  
  /**
    * Retourne la portée la plus basse.
    * @method lower_staff
    * @return {Staff} la portée
    */
  get_lower_staff:function()
  {
    if(Anim.staves.length == 0) return null
    var lstaff ;
    L(Anim.staves).each(function(staff){
      if( !lstaff || (staff.top > lstaff.top) ) lstaff = staff
    })
    return lstaff
  },
  /**
    * Retourne le meilleur octave pour la gamme
    * @method best_octave_scale
    * @param  {String} cle    La clé de la portée
    * @param  {Number} inote  L'indice de la note (0=DO, 1=RE, 2=MI, etc.)
    * @return {Number} Le meilleur octave trouvé
    */
  best_octave_scale:function(cle, inote)
  {
    switch(cle)
    {
    case SOL  : return 4 // quelle que soit la note
    case FA   :
      if(inote >= 2/* mi */) return 2
      else return 3
    case UT3  :
      return 2
    case UT4  :
      return 2
    }
  }
  
})
/* ---------------------------------------------------------------------
    Méthodes pour la propriété-object `notes` de la portée (qui contient
    toutes ses notes)
   --------------------------------------------------------------------- */
window.OBJECT_STAFF_NOTES = {
  /**
    * L'instance {Staff}
    * @property {Staff} staff
    */
  staff:null,
  /**
    * Liste de toutes les notes de la portée.
    * En clé : l'offset ou se trouve la note (note.left), en valeur une liste
    * de toutes les notes se trouvant à cet offset
    * @property {Object} list
    * @static
    */
  list:{},
  /**
    * Retourne True si la note +note+ possède une note conjointe supérieure
    * au même niveau
    * @method hasConjointeUpper
    * @return {Note|Null} la note conjointe supérieure si elle existe, ou NULL
    */
  hasConjointeUpper:function(note)
  {
    var arr, len, tested, inote = 0, upper = note.conjointe_upper;
    if(!this.list[note.left]) return null
    arr = $.merge([], this.list[note.left])
    while(tested = arr.shift()) {
      if(tested.note+tested.octave == upper && tested.staff.indice == note.staff.indice) return tested
    }
    return null
  },
  /**
    * Retourne True si la note +note+ possède une note conjointe en dessous
    * au même décalage left
    * @method hasConjointeUnder
    * @return {Note|Null} la note conjointe supérieure si elle existe, ou NULL
    */
  hasConjointeUnder:function(note)
  {
    var arr, len, tested, inote = 0, under = note.conjointe_under;
    arr = $.merge([], this.list[note.left] || [])
    while(tested = arr.shift()){
      if(tested.note+tested.octave == under && tested.staff.indice == note.staff.indice) return tested
    }
    return null
  },
  /**
    * Ajoute une note à la portée
    * Notes
    *   * La méthode s'occupe aussi de gérer les notes conjointes. Si la
    *     note ajoutée a une note conjointe au-dessus, cette note au-dessus
    *     est décalée vers la gauche
    * @method add
    * @param {Note} Instance de la note à ajouter
    */
  add:function(note)
  {
    if(undefined == this.list[note.left]) this.list[note.left] = []
    this.list[note.left].push(note)
    if(upper = this.hasConjointeUpper(note)) upper.update_affichage()
  },
  /**
    * Retire une note de la portée
    * Notes : ça la retire simplement de la donnée, pas de l'affichage
    * @method remove
    * @param {Note} Instance de la note à ajouter
    */
  remove:function(note)
  {
    var arr = this.list[note.left]
    var new_arr = []
    L(arr).each(function(n){
      if(n.id == note.id) return
      new_arr.push(n)
    })
    this.list[note.left] = new_arr
  }
}
/* ---------------------------------------------------------------------
     Méthodes d'instance
   --------------------------------------------------------------------- */
$.extend(Staff.prototype, METHODES_TEXTE)
$.extend(Staff.prototype, UNVERSAL_METHODS)
$.extend(Staff.prototype, {

  /**
    * Affichage des éléments
    * @method show
    * @params {Object} params   Paramètres éventuels (ou durée) — wait, duree
    */
  show:function(params)
  {
    params = define_wait_and_duree(params, this, 'show')
    Anim.Dom.anime(this.objets, {opacity:1}, params)
  },
  /**
    * Masquage de la portée
    * @method hide
    * @params {Object} params   Paramètres éventuels (ou durée) — wait, duree
    */
  hide:function(params)
  {
    params = define_wait_and_duree(params, this, 'show')
    Anim.Dom.anime(this.objets, {opacity:0}, params)
  },
  /**
    * Destruction de la portée (et retrait de la liste des portées) et
    * de tout ce qu'elle porte sans exception.
    * @method remove
    * @param {Object} params Paramètres éventuels
    *
    */
  remove:function(params)
  {
    Anim.staves.splice(this.indice - 1, 1)
    
    // Détruire les textes de la portée
    this.remove_textes()
    
    // Détruire portée et clés
    params = define_wait_and_duree( params, this, 'show')
    params.complete_each  = 'remove'
    Anim.Dom.anime(this.objets, {opacity:0}, params)
    
    // On doit détruire toutes les notes, avec leurs textes
    var liste_notes = $.extend({}, this.notes.list)
    L(liste_notes).each(function(kleft){
      L(liste_notes[kleft]).each(function(note){
        note.remove({dont_unstaff:true, texts:true})
      })
    })
    L(this.suplines).each(function(sid){$('img#'+sid).remove()})
  },
  
  /**
    * Positionne la portée, la clé et la métrique (if any)
    * @method positionne
    * @param {Object} params  Paramètres optionnels
    */
  positionne:function()
  {
    this.img_staff.css({
      top   : this.top  + 'px', 
      left  : this.left + 'px',
      width : (this.width ? this.width + 'px' : '100%')
    })
    // Positionnement de la clé
    this.img_cle.css({ top:this.top_cle + 'px' })
    // Positionnement de la métrique
    this.img_metrique.css({left: this.left_metrique + 'px'})
    // Positionnement de l'armure
  },
  
  /**
    * Objet complexe conservant les notes de la portée
    * Notes
    * -----
    *   * Il est défini à l'instanciation de la portée
    * @property {Object} notes
    */
  notes:{},
  /**
    * Ajoute des lignes supplémentaires à la portée
    * Notes
    * -----
    *   * Les lignes portent l'identifiant "<indice portée>-<left>-<indice>"
    *     pour pouvoir être supprimées par REMOVE_SUPLINE
    *   * @rappel : les lignes sont séparées par 12px
    * @method add_suplines
    * @protected
    * @param  {Object} params   Paramètres optionnels
    *   @param  {Boolean} params.top      Si true (default) ajouter au-dessus
    *   @param  {Number}  params.number   Le nombre de lignes
    *
    */
  add_suplines:function(params)
  {
    if(undefined == params) return F.error("Staff.add_suplines ne peut être appelé sans paramètres…")
    if(undefined == this.suplines) this.suplines = []
    var ontop    = params.top == true
    var hauteur  = ontop ? this.top - 12 : this.top + (5 * 12) ;
    var incre    = ontop ? -12 : + 12
    var left     = params.left || Anim.current_x
    // dlog("-> add_suplines")
    // dlog({
    //   ontop:ontop, hauteur:hauteur, inc:incre, nombre:params.number
    // })
    var prefid   = "supline-"+this.indice+left+"-"
    var suffid   = ontop ? 'top' : 'bot'
    // On ajoute le nombre de lignes nécessaires
    for(var i = 0; i < params.number; i++)
    {
      style = "top:"+hauteur+"px;left:"+(left - 2)+"px;"
      sid   = prefid + i + suffid
      Anim.Dom.add('<img id="'+sid+'" class="supline" src="img/note/supline.png" style="'+style+'" />')
      hauteur += incre
      this.suplines.push(sid)
    }
  },
  /**
    * Supprime des lignes supplémentaires
    * @method remove_suplines
    * @param {Object} params  Paramètres de suppression
    *   @param {Array|Number} params.top    Ligne(s) à supprimer au-dessus
    *   @param {Array|Number} params.bottom Ligne(s) à supprimer en dessous
    */
  remove_suplines:function(params){ Supline.erase($.extend(params, {staff: this.indice})) },
  /** Alias de remove_suplines
    * @method remove_supline
    */
  remove_supline:function(params){return this.remove_suplines(params)}
  
})

Object.defineProperties(Staff.prototype,{
  /**
    * Alias de `top` Pour utilisation par les autres méthodes, le top
    * @property {Number} y
    */
  "y":{
    set:function(y){this.top = y},
    get:function(){return this.top}
  },
  
  /**
    * Alias de `top` Pour utilisation par les autres méthodes, le left
    * @property {Number} x
    */
  "x":{
    set:function(x){this.left = x},
    get:function(){return this.left}
  },
  
  /**
    * Hauteur de la portée
    * @property {Number} height
    */
  "height":{get:function(){
    return 4 * (Anim.prefs.note_height - 1)}
  },
  /**
    * Bas de la portée
    * @property {Number} bottom
    */
  "bottom":{
    get:function(){return this.top + this.height}
  },
  /**
    * Le "zéro" de la portée, en fonction de sa clé, qui permettra
    * de positionner les notes.
    * Notes
    *   * Ce zéro doit correspondre à la hauteur de la note A4
    * @property {Number} zero
    */
  "zero":{
    get:function(){
      if(undefined == this._zero)
      {
        switch(this.cle)
        {
        case SOL  : this._zero = this.top + 35; break;
        case FA   : this._zero = this.top - 38; break;
        case UT3  : this._zero = this.top + 50; break;
        case UT4  : this._zero = this.top + 44; break;
        }
      }
      return this._zero
    }
  },
  /**
    * Liste des objets DOM que possède la portée (exception faite des notes)
    * @property {Array} objets
    */
  "objets":{
    get:function(){
      var objs = [this.img_staff]
      if(this.img_cle.length) objs.push(this.img_cle)
      if(this.img_armure.length) objs.push(this.img_armure)
      if(this.img_metrique.length) objs.push(this.img_metrique)
      this.nombre_objets = objs.length
      return objs
    }
  },
  /**
    * Position top de l'image de la clé en fonction de la clé
    * @property {Number} top_cle
    */
  "top_cle":{
    get:function(){
      switch(this.cle)
      {
      case SOL : return -19   ;
      case FA  : return -1    ;
      case FA3 : return 10.5  ;
      case UT3 : return -1    ;
      case UT4 : return -13   ;
      }
    }
  },

  /**
    * Position left de l'image (DIV) de la métrique
    * @property {Number} left_metrique
    */
  "left_metrique":{
    get:function(){
      var lm = 62 - parseInt((this.width_metrique - 15) / 2)
      if(this.armure ) lm += this.width_armure + 4
      return lm
    }
  },
  /**
    * Retourne la largeur de la métrique
    * @property {Number} width_metrique
    */
  "width_metrique":{
    get:function(){
      return UI.exact_width_of(this.img_metrique)
    }
  },
  
  "width_armure":{
    get:function(){
      if(this.armure)
      {
        
      }
      return this._width_armure || 0
    }
  },
  /**
    * Return l'élément DOM de la portée contenue dans son DIV
    * (ie l'ensemble de ses images de lignes)
    * @property {jQuerySet} img
    */
  "img_staff":{
    get:function(){return $('div#'+this.id)}
  },
  /**
    * Return l'élément DOM de la clé
    * @property {jQuerySet} img_cle
    */
  "img_cle":{
    get:function(){return $('img#'+this.dom_id_cle)}
  },
  "dom_id_cle":{get:function(){return "staff_cle-"+this.id}},
  
  /**
    * Objet DOM pour l'armure (if any)
    * @property {jQuerySet} img_armure
    */
  "img_armure":{
    get:function(){return $('div#'+this.dom_id_armure)}
  },
  "dom_id_armure":{get:function(){return "staff_armure-"+this.id}},
  /**
    * Objet DOM pour la métrique (if any)
    * @property {jQuerySet} img_metrique
    */
  "img_metrique":{
    get:function(){return $('div#'+this.dom_id_metrique)}
  },
  "dom_id_metrique":{get:function(){return "staff_metrique-"+this.id}},
  /**
    * Return le code HTML complet de la portée
    * @property {HTMLString} code_html
    */
  "code_html":{get:function(){return this.html_img}},
  
  /**
    * Return le code HTML pour la portée
    * Avec tous ses éléments (clé, métrique, armure)
    * @property {HTMLString} html_img
    */
  "html_img":{
    get:function(){
      var i=0, c = "", top = this.top, nheight = (Anim.prefs.note_height - 1) ;
      for(; i<5; ++i)
      {
        c += '<img style="top:'+(i * nheight)+'px;" class="staffline" src="img/line.png" />'
        // top += 12
      }
      c +=  this.html_img_cle +
            this.html_img_armure +
            this.html_img_metrique
            
      return '<div id="'+this.id+'" style="top:'+this.top+'px;opacity:0;" class="staff">'+c+'</div>'
    }
  },
  /**
    * Return le code HTML pour la clé
    * @property {HTMLString} html_img_cle
    */
  "html_img_cle":{
    get:function(){
      return '<img id="'+this.dom_id_cle+'" class="cle" src="img/cle/'+this.img_png_cle+'.png" />'
    }
  },
  /**
    * Nom (affixe) de l'image PNG de la clé en fonction de la clé
    * @property {String} img_png_cle
    */
  "img_png_cle":{
    get:function(){
      if(this.cle.substring(0,2)=='ut') return 'ut'
      else if(this.cle == FA3)          return 'fa'
      else                              return this.cle
    }
  },
  /**
    * Return le code HTML pour la métrique
    * Notes
    * -----
    *   * C'est un DIV principal contenant les éléments
    *
    * @property {String} html_img_metrique
    */
  "html_img_metrique":{
    get:function(){
      if(!this.metrique) return ""
      return '<div id="'+this.dom_id_metrique+'" class="metrique">'+this.metrique.replace(/\//,'<br>')+'</div>'
    }
  },
  /**
    * Return le code HTML pour l'armure
    * Notes
    * -----
    *   * C'est un DIV principal contenant les éléments
    *   * La propriété armure contient une note anglaise avec éventuellement l'altération.
    *     Par exemple "cd" pour "DO dièse"
    *
    * @property {String} html_img_armure
    */
  "html_img_armure":{
    get:function(){
      if(!this.armure) return ""
      // On cherche dans le cycle des quintes de la tonalité
      var dtune = DATA_TUNES[this.armure]
      if(undefined == dtune) return F.error("Impossible de trouver les données de la tonalité `"+this.armure+"`. Existe-t-elle vraiment ?…")
      var cycle = dtune.cycle == 'dieses' ? CYCLE_DIESES : CYCLE_BEMOLS,
          alt   = dtune.cycle == 'dieses' ? 'diese' : 'bemol',
          off_x = alt == 'diese' ? 12 : 10,  // décalage horizontal entre chaque altération
          off_y_cle = this.offset_y_armure_per_cle, // décalage vertical en fonction de la clé
          off_y,
          i     = 0, 
          dalt, 
          style = "",
          arm   = "",
          cur_x = 58 ;
          
      for(; i < 7; ++i)
      {
        dalt = cycle[i]
        // Par rapport à la position de l'altération, il y a quelques exceptions. Elles sont 
        // renseignées dans les données cycles avec en clé le nom de la clé.
        // alt_y = dalt[this.cle] || dalt.y // ça ne suffit pas car certains valeur sont 0
        off_y = undefined === dalt[this.cle] ? dalt.y : dalt[this.cle] ;
        dlog("off_y (cle="+this.cle+"/i="+i+") : "+off_y)
        // On construit l'altération
        style = "top:"+(off_y + off_y_cle)+'px;left:'+cur_x+'px;'
        arm += '<img src="./img/note/'+alt+'-black.png" class="alteration" style="'+style+'" />'
        if(dalt.tune == this.armure) break
        cur_x += off_x
      }
      dlog("Armure : "+arm)
      return '<div id="'+this.dom_id_armure+'" class="armure">'+arm+'</div>'
    }
  },
  /**
    * Décalage vertical de l'armure en fonction de la clé de la portée (toutes les valeurs de 
    * hauteur dans les données des cycles des quintes sont fixées par rapport à la clé de sol)
    * @property {Number} offset_y_armure_per_cle
    */
  "offset_y_armure_per_cle":{
    get:function()
    {
      switch(this.cle)
      {
      case FA   : return 12 ;
      case FA3  : return 24 ;
      case SOL  : return 0  ;
      case UT3  : return 6  ;
      case UT4  : return -6 ;
      }
    }
  }
  
})