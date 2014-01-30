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
  this.left = 20
  /**
    * Indice (1-start) de la portée dans l'animation
    * Notes
    *   * Il sera défini au moment de la création de la portée (`create`)
    * @property {Number} indice
    */
  this.indice = null
  
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
  
  this.id = "staff"+this.cle+this.top+(new Date()).getTime()
  
}
/* ---------------------------------------------------------------------
    Méthodes de classe
   --------------------------------------------------------------------- */
$.extend(Staff,{
  /**
    * Crée une nouvelle portée de clé +cle+ et de métrique +metrique+ sous
    * la dernière portée affichée (et l'enregistre dans this.staves)
    * Notes
    *   * Cette méthode ne met pas la portée en portée courante, c'est la méthode
    *     appelante qui doit s'en charger.
    *   * Si la portée (son indice) est utilisée dans une préférence (par exemple
    *     la préférence qui détermine sur quelle portée se marqueront les harmonies)
    *     alors l'indice sera remplacé par la Staff.
    * @method create
    * @param  {String} cle La clé de la portée (obligatoire)
    * @param  {Object} params Les paramètres éventuels
    *   @param  {String} params.metrique La métrique optionnelle
    *   @param  {Number} params.offset    Le décalage par rapport à la dernière portée
    */
  create:function(cle, params)
  {
    if(undefined == params) params = {}
    var staff = new Staff({cle:cle, top:this.top_next_staff(params)})
    staff.build()
    Anim.staves.push(staff)
    staff.indice = Anim.staves.length // ! 1-start
    // Cette portée est-elle utilisée dans un réglage des préférences
    L(['staff_harmony', 'staff_chords']).each(function(key){
      if(('number' == typeof Anim.prefs[key]) && Anim.prefs[key] == staff.indice)
      {
        Anim.prefs[key] = staff
      } 
    })
    return staff
  },
  
  /**
    * Retourne le top de la prochaine portée
    * @method top_next_staff
    * @param  {Object} params           Paramètres optionnels
    *   @param  {Number} params.offset  Le décalage éventuel par rapport à la position naturelle
    */
  top_next_staff:function(params)
  {
    var top = Anim.prefs.staff_top + (Anim.prefs.staff_offset * Anim.staves.length)
    if(params && params.offset) top += params.offset
    return top
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
      return 2 // TODO à mieux régler
    case UT4  :
      return 2 // TODO à mieux régler
    }
  },
  
  /**
    * Efface des lignes supplémentaires
    * @method erase_suplines
    * @param  {Number} istaff   Indice de la portée
    * @param  {Number} xoffset  Décalage horizontal où se trouve la ligne
    * @param  {String} endroit  'bot' ou 'top' pour bottom ou top
    * @param  {Array}  indices  Indices 1-start des lignes supplémentaires à supprimer
    */
  erase_suplines:function(istaff, xoffset, endroit, indices)
  {
    L(indices).each(function(indice_supline){
      var id = "supline-"+istaff+xoffset+"-"+(indice_supline - 1)+endroit
      $('img#'+id).fadeOut(Anim.delai_for('show'))
    })
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
    this.img_staff.css({top: this.top+"px", left: this.left+"px"})
    var dec_top = this.cle == SOL ? -19 : -1
    // this.img_cle.css({top:(this.top + dec_top)+"px", left:(this.left+6)+"px"})
    this.img_cle.css({top:dec_top+"px"})
    //+9.6 pour clé de FA, -7 pour clé de Sol
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
  remove_suplines:function(params)
  {
    params.staff = this.indice
    Anim.Objects.REMOVE_SUPLINE(params)
  },
  /** Alias pour remove_suplines
    * @method remove_supline
    */
  remove_supline:function(params){return this.remove_suplines(params)}
  
})

Object.defineProperties(Staff.prototype,{
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
        case FA   : this._zero = this.top -38; break;
        case UT3  : this._zero = this.top + 50; break;// pas encore implémenté
        case UT4  : this._zero = this.top + 44; break; // pas encore implémenté
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
            this.html_img_metrique +
            this.html_img_armure
      return '<div id="'+this.id+'" style="top:'+this.top+'px;" class="staff">'+c+'</div>'
    }
  },
  /**
    * Return le code HTML pour la clé
    * @property {HTMLString} html_img_cle
    */
  "html_img_cle":{
    get:function(){
      return '<img id="'+this.dom_id_cle+'" class="cle" src="img/cle/'+this.cle+'.png" />'
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
      var c = ""
      return '<div id="'+this.dom_id_metrique+'" class="metrique">'+c+'</div>'
    }
  },
  /**
    * Return le code HTML pour l'armure
    * Notes
    * -----
    *   * C'est un DIV principal contenant les éléments
    *
    * @property {String} html_img_armure
    */
  "html_img_armure":{
    get:function(){
      if(!this.armure) return ""
      var c = ""
      return '<div id="'+this.dom_id_armure+'" class="armure">'+c+'</div>'
    }
  }
  
})