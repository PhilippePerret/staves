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

REAL_INDICES_NOTES = {
  'c' : 1,
  'd' : 3,
  'e' : 5,
  'f' : 6,
  'g' : 8,
  'a' : 10,
  'b' : 12
}

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
  this.left = Anim.current_x
  
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
    // Faut-il des lignes suplémentaires
    var dsuplines = this.need_suplines(Anim.current_staff.cle)
    dlog("-- Calcul des lignes supplémentaires --")
    dlog({
      'note': this.note,
      'alteration': this.alteration,
      'midi': this.midi,
      'clé portée': Anim.current_staff.cle
    })
    dlog("dsuplines:");dlog(dsuplines)
    
    if(dsuplines) Anim.current_staff.add_sup_lines($.extend(dsuplines,{upto:this.top}))
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
    }
  },
  /**
    * Return TRUE si la note nécessite des lignes supplémentaires
    *   Note max clé de SOL = 80 si "a", 81
    *   Note min clé de SOL = 62 si "c" 61 si "c" ou "b", 60
    *   
    *   Note max clé de FA  = 58 si "c", 59 si "c", 60
    *   Note min clé de FA    30 et 29 si "e", 28
    *   c au milieu = 48, c tout en bas = 24
    *   mi en bas = 28
    * @property {Boolean} need_suplines
    * @param  {String} key  La clé de la portée sur laquelle il faut mettre la note
    * @return {Object} NULL si la note ne nécessite pas de lignes supplémentaires, 
    *                       ou un object contenant :above et :number, la donnée
    *                       à envoyer à Staff pour construire les lignes supplémentaires
    */
  need_suplines:function(key)
  {
    if(undefined == this.suplines || undefined == this.suplines[key])
    {
      if(undefined == this.suplines) this.suplines = {}
      this.suplines[key] = function(key, note, midi){
        switch(key)
        {
        case SOL :
          if(midi < 60){ // strictement inférieur à 60
            return {above:false, number: parseInt((midi - 60) / 4)}
          } else if (midi < 82){ // entre 60 et 81
            if(midi <= 62 && note == "c") return {above:false, number:1}
            else if (midi >= 80 && note == "a") return {above:true, number:1}
            else return null
          } else { // Supérieur ou égal à 82
            dlog("ici avec "+note+" (midi="+midi+":"+(typeof midi)+")")
             return {above:true, number: Math.floor((midi - 82) / 4)}
          }
        case FA  :
          if(midi < 28){ // Strictement inférieur à 28
            return {above:false, number: parseInt((midi - 28) / 4)}
          } else if( midi <= 60 ){ // entre 28 et 60
            if(midi <= 30 && note == "e") return {above:false, number:1}
            else if( midi >= 58 && note == "c") return {above:true, number:1}
            else return null
          } else {
            return {above:true, number: parseInt((midi - 60) / 4)}
          }
        default: return null; // pour le moment
        }
      }(key, this.note, this.midi)
    }
    return this.suplines[key]
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
    * Retourne la valeur numérique de la note
    * Note
    *   * Elle est calculée pour qu'un C3 correspond à 60
    *   * LA4 (440Hz = 69)
    * @property {Number} midi
    */
  "midi":{
    get:function(){
      if(undefined == this._midi)
      {
        // A4 (69)
        // -> inote = 10 / octave = 4 => 10 + ((4 - 1)*24) => 10 + 72 => 82 
        // C4 (60)
        //    -> inote = 1 / octave = 4 => 1 + (4*7) => 
        // A#3 ?
        //  inote = 10 / octave = 3 => 10 + (3*7) + 31 => 10 + 21 + 31 => 62
        var inote = REAL_INDICES_NOTES[this.note]
        this._midi = inote + ((this.octave - 1) * 24) - 13
        if(this.alteration)
        {
          switch(this.alteration)
          {
          case 'b'  : this._midi -= 1; break;
          case 'd'  : this._midi += 1; break;
          case 'x'  : this._midi += 2; break;
          case 't'  : this._midi -= 2; break;
          }
        }
      }
      return this._midi
    }
  },
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
