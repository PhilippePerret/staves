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
NOTE_TO_OFFSET = {
  'd6' : -25,
  'c6' : -19,
  'b5' : -13,
  'a5' : -7,
  'g5' : -1,
  'f5' : 5,
  'e5' : 11,
  'd5' : 17,
  'c5' : 23,
  'b4' : 29,
  'a4' : 35,
  'g4' : 42,
  'f4' : 48,
  'e4' : 54,
  'd4' : 60,
  'c4' : 66,
  'b4' : 72,
  'a3' : 78,
  'g3' : 84,
  'f3' : 90,
  'e3' : 96
}
/*
Décalage avec la portée (ici une portée à 100)
a6 = -7 + ligne supplémentaire
g5 = -1
f5 = 5
e5 = 11
d5 = 17
c5 = 23
b4 = 29
a4 = 35
g4 = 42  // petit décalage
f4 = 48
e4 = 54
d4 = 60
c4 = 66 + ligne supplémentaire

a4 est le zéro => le zéro est à 35
a vaut 97
b vaut 98
c vaut 99

=> charCode - 97 => 1 pour b, 2 pour c, 3 pour d, 4 pour e, 5 pour f, 6 pour g




*/
/**
  * Pour créer une note (instance Note) et la construire sur la portée
  * @method Note
  * @for window
  */
window.NOTE = function(note)
{
  var n = new Note(note)
  n.build()
  return n
}

/**
  * @class Note
  * @constructor
  * @param  {Object|String} La note ou les données de la note
  */
window.Note = function(params)
{
  this.id = (new Date()).getTime()
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
}
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
    this.analyse_note(hauteur)
    this.positionne()
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
    * Affiche les objets de l'élément
    * @method show
    * @param  {Number} vitesse La vitesse d'apparition
    */
  show:function(vitesse)
  {
    this.obj.show(vitesse)
  },
  /**
    * Positionne la note en fonction de sa hauteur de note
    * et de la hauteur de la portée
    * @method positionne
    */
  positionne:function()
  {
    this.top = Anim.current_staff.top + NOTE_TO_OFFSET[this.note+this.octave]
    this.obj.css({top:this.top+"px", left:this.left+"px"})
  },
  
  /**
    * Analyse la note fournie en argument
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
    if(note_str[0] == "b" || note_str[0] == "#")
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
      if(this.alteration)
      { // => ajouter l'image de l'altération
      
      }
      return c
    }
  },
  /**
    * Retourne le code HTML de l'image de la note
    * @property {HTMLString} html_img
    */
  "html_img":{
    get:function(){
      return '<img class="note" id="'+this.dom_id+'" src="img/note/rond-noir.png"/>'
    }
  }
})
