/**
  * @module Note
  */

/**
  * En clé, la note et son octave et en valeur son décalage par
  * rapport à la portée. Donc il faut ajouter cette valeur à la hauteur
  * de la portée pour placer la note.
  *
  * @property {Object} NOTE_TO_OFFSET
  * @static
  * @final
  */
/* Construire automatiquement le tableau */
NOTES = ["c", "d", "e", "f", "g", "a", "b"]

NOTE_TO_OFFSET = {}
for(var octave = 0; octave < 7; ++octave)
{
  for(var inote=0; inote<7;++inote)
  {
    // zéro : octave=4 inote=5
    note    = NOTES[inote]
    valeur  = (1 + parseInt(inote)) + (octave * 7) // a4 = 6 + (4*7) = 34
    offset  = - (valeur - 34) * 6
    if(offset > 0) offset += 1 // petit décalage
    NOTE_TO_OFFSET[note+octave] = offset
  }
}

/**
  * Décalage de l'altération par rapport à la note en fonction de son type
  * @property {Object} OFFSET_ALTERATION
  * @static
  * @final
  */
OFFSET_ALTERATION = {
  'b' : {top: 12, left: 14},
  'd' : {top: 5,  left: 14},
  'x' : {top: 5,  left: 17},
  't' : {top: 12, left: 17}
}


// console.dir(NOTE_TO_OFFSET)

/**
  * Pour créer une note (instance Note) et la construire sur la portée
  * @method Note
  * @for window
  * @param  {String} note   La note en version string (p.e. "ab5" pour la bémol 5)
  * @param  {Object|Undefined} params   Paramètres optionnels
  *   @param {Boolean} params.dont_build    Si true, la note n'est pas construite
  */
window.NOTE = function(note, params)
{
  if(undefined == params) params = {}
  var n = new Note(note)
  if(!params.dont_build)
  {
    n.build()
    Anim.wait(1)
  }
  return n
}

/**
  * @class Note
  * @constructor
  * @param  {Object|String} La note ou les données de la note
  */
window.Note = function(params)
{
  ObjetClass.call(this)
  this.note       = null
  this.octave     = null
  this.alteration = null
  
  this.top  = null
  this.left = 100 // pour le moment
  
  if('string'==typeof params)
  { // => Une note précisée par "<note une lettre><altération><octave>"
    // <altération> optionnelle peut être "b" ou "#"
    // <octave> peut être "4" ou "-4"
    this.analyse_note(params)
  }
  else
  {
    var me = this
    L(params).each(function(k,v){ me[k] = v })
  }
  this.id = this.note + (this.alteration || "") + this.octave + (new Date()).getTime()
}
Note.prototype = Object.create( ObjetClass.prototype )
Note.prototype.constructor = Note

$.extend(Note.prototype,{
  /* ---------------------------------------------------------------------
   *
   *  Méthodes pour composer le code de l'animation
   *  
   */
  
  /**
    * Écrit un texte au-dessus ou en dessous de la note
    * @method write
    * @param  {String} Le texte à écrire
    * @param  {Object} Les paramètres optionnels
    */
  write:function(texte, params)
  {
    if(undefined == params) params = {}
    params.texte = texte
    this.texte = TXT(this, params)
    this.texte.build()
  },
  /**
    * Déplace la note à la hauteur +hauteur+
    * @method moveTo
    * @param  {String}  hauteur   La nouvelle hauteur
    * @param  {Object}  params    Les paramètres optionnels
    */
  moveTo:function(hauteur)
  {
    var dmvt = {
      x_dep:parseInt(this.left), 
      x_max:parseInt(this.left) + 10 + (this.alteration ? 10 : 0),
      y_dep:parseInt(this.top)
    }
    this.analyse_note(hauteur)
    dmvt.y_fin = this.top
    Courbe.move(this.obj, dmvt)
  },
  
  /**
    * Destruction de la note
    * Notes
    *   * Pour le moment, je détruis seulement son objet DOM
    * @method remove
    */
  remove:function()
  {
    this.obj.remove()
    if(this.alteration) this.obj_alt.remove()
  },
  
  // Fin des méthodes pour composer le code de l'animation
  /* --------------------------------------------------------------------- */
  /**
    * Construit la note
    * @method build
    */
  build:function()
  {
    Anim.add(this)
  },
  /**
    * Méthode propre pour afficher la note, car elle a peut-être une
    * altération
    * @method show
    * @param {Object} params Les paramètres optionnels
    */
  show:function(params)
  {
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    Anim.show(this.obj, params)
    Anim.show(this.obj_alt, params)
  },
  
  /**
    * Positionne la note en fonction de sa hauteur de note
    * et de la hauteur de la portée
    * @method positionne
    */
  positionne:function()
  {
    this.top = Anim.current_staff.zero + NOTE_TO_OFFSET[this.note+this.octave]
    // dlog({
    //   'top current staff':Anim.current_staff.top,
    //   'top note':this.top,
    //   'key in NOTE_TO_OFFSET': this.note+this.octave,
    //   'value in NOTE_TO_OFFSET':NOTE_TO_OFFSET[this.note+this.octave]
    // })
    this.obj.css({top:this.top+"px", left:this.left+"px"})
    if(this.alteration)
    {
      var off = OFFSET_ALTERATION[this.alteration]
      this.obj_alt.css({top:(this.top - off.top)+"px", left:(this.left - off.left)+"px"})
      // -12 pour bémol
    }
  },
  /**
    * Analyse la note fournie en argument
    * La méthode définit :
    *   - La note (this.note)
    *   - Le top de la note (this.top)
    *   - L'octave (this.octave)
    * @method analyse_note
    * @param {String} note_str  Un string de la forme :
    *                           "<note 1 lettre><altération><octave>"
    *                           <alteration>  : "b", "#" ou ""
    *                           <octave>      : 0 à 9 avec ou sans "-" devant
    */
  analyse_note:function(note_str)
  {
    note_str = note_str.split('')
    this.note   = note_str.shift()
    if(["b", "d", "x", "t"].indexOf(note_str[0]) > -1)
    {
      this.alteration = note_str.shift()
    }
    this.octave = note_str.shift()
    if(this.octave == "-") this.octave = "-" + note_str.shift()
    this.octave = parseInt(this.octave,10)
  }
  
})

Object.defineProperties(Note.prototype,{
  
  /**
    * Retourne l'objet DOM de la note
    * @property {jQuerySet} obj
    */
  "obj":{
    get:function(){ return $('img#'+this.dom_id)}
  },
  /**
    * Retourne l'objet DOM de l'alteration de la note, if any
    * @property {jQuerySet} obj_alt
    */
  "obj_alt":{
    get:function(){ return $('img#'+this.dom_id+'-alt')}
  },
  /**
    * Retourne l'ID DOM de la note
    * @property {String} dom_id
    */
  "dom_id":{
    get:function(){return "note-"+this.id}
  },
  
  /**
    * Retourne le code HTML pour la note (et ses altérations, effets, etc.)
    * @property {HTMLString} code_html
    */
  "code_html":{
    get:function(){
      var c = this.html_img
      if(this.alteration) c += this.html_img_alt
      return c
    }
  },
  /**
    * Retourne le code HTML de l'image de la note
    * @property {HTMLString} html_img
    */
  "html_img":{
    get:function(){
      return '<img class="note" id="'+this.dom_id+'" src="img/note/rond-noir.png" style="opacity:0;" />'
    }
  },
  
  /**
    * Retourne le nom du fichier en fonction de l'altération
    * @property {String} filename_alteration
    */
  "filename_alteration":{
    get:function(){
      switch(this.alteration)
      {
      case 'b'  : return "bemol";
      case 'd'  : return "diese";
      case 'x'  : return "double-diese";
      case 't'  : return "double-bemol";
      }
    }
  },
  /**
    * Code HTML pour l'image de l'altération, if any
    * @property {HTMLString} html_img_alt
    */
  "html_img_alt":{
    get:function(){
      return '<img class="alteration" id="'+this.dom_id+'-alt" ' +
              'src="img/note/'+this.filename_alteration+'.png" style="opacity:0;" />'
    }
  }
})
