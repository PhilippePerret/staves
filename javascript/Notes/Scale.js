/**
  * @module Scale.js
  */
/**
  * Objet construisant une gamme
  * @method SCALE
  * @for window
  *
  * @param  {String} scale  La gamme à construire, exprimée par une note et une altération
  * @param  {Object} params Les paramètres optionnels
  *   @param  {Number} params.staff     Indice de la portée. Défaut : la portée courante.
  *   @param  {String} params.type      Le type de gamme parmi :
  *                                     * 'MAJ' (défaut = gamme majeure), 
  *                                     * 'min_h' (mineure harmonique), 
  *                                     * 'min_ma' (mineure mélodique ascendante)
  *                                     * 'min_md' (mineur mélodique descendante)
  *   @param  {Number} params.offset    Le décalage pixel entre chaque note. Par défault
  *                                     le décalage optimal en fonction des altérations
  *   @param  {Number} params.octave    Octave de la note de départ. Par défaut, la meilleure position
  *                                     par rapport à la portée et la note, pour produire le
  *                                     moins de lignes supplémentaires possible.
  *   @param  {Boolean} params.asc      Ascendante ou descendante (true par défaut)
  *   @param  {String}  params.from     La note de laquelle on doit partir, si c'est
  *                                     une autre note que la fondamentale.
  *   @param  {Number}  params.for      Le nombre de notes à écrire (8 par défaut)
  * 
  * @return {Array} un Array des instances notes dont les méthodes et propriétés ont
  *                 été étendus par GROUPNOTES_METHODS et GROUPNOTES_PROPERTIES.
  */
window.SCALE = function(scale, params)
{
  return new Scale(scale, params)
}

/**
  * Class Scale
  * Gestion des gammes de toute sorte
  * @class Scale
  * @constructor
  * @param  {String} scale  La gamme à construire, exprimée par une note et une altération
  * @param  {Object} params Les paramètres optionnels
  *   @param  {Number} params.staff     Indice de la portée. Défaut : la portée courante.
  *   @param  {String} params.type      Le type de gamme parmi :
  *                                     * 'MAJ' (défaut = gamme majeure), 
  *                                     * 'min_h' (mineure harmonique), 
  *                                     * 'min_ma' (mineure mélodique ascendante)
  *                                     * 'min_md' (mineur mélodique descendante)
  *   @param  {Number} params.offset    Le décalage pixel entre chaque note. Par défault
  *                                     le décalage optimal en fonction des altérations
  *   @param  {Number} params.octave    Octave de la note de départ. Par défaut, la meilleure position
  *                                     par rapport à la portée et la note, pour produire le
  *                                     moins de lignes supplémentaires possible.
  *   @param  {Boolean} params.asc      Ascendante ou descendante (true par défaut)
  *   @param  {String}  params.from     La note de laquelle on doit partir, si c'est
  *                                     une autre note que la fondamentale.
  *   @param  {Number}  params.for      Le nombre de notes à écrire (8 par défaut)
  * 
  */
window.Scale = function(scale, params)
{
  this.class  = 'scale'
  this.type   = 'MAJ'
  this.note_scale   = null  // Le "nom" de la gamme (par exemple "c" pour DO#mineur)
  /**
    * Altération de la gamme (par exemple "d" pour DO#mineur)
    * @property {String} alteration
    * @static
    */
  this.alteration = null
  /**
    * "Indice note" de la gamme
    * C'est l'indice dans la constante liste NOTES
    * Par exemple 0=DO, 1=RÉ, 2=MI etc.
    * @property {Number} inote_scale
    * @static
    */
  this.inote_scale  = null
  /**
    * Les données absolues de la gamme en fonction de son `type`, tirés de
    * DATA_SCALES
    * @property {Object} data_scale
    * @static
    */
  this.data_scale = null
  /**
    * La suite des intervalles en fonction du `type` de la gamme
    * Par exemple [2,2,1,2,2,2,1] pour une gamme majeure (type="MAJ")
    * Notes
    *   * Les intervalles sont exprimés en demi-tons
    * @property {Array} intervalles
    * @static
    */
  this.intervalles = null
  
  this.staff  = Anim.current_staff
  this.offset = 60
  this.octave = null
  this.asc    = true
  this.from   = null
  this.for    = 8
  /**
    * Liste des instances {Note} des notes de la gamme
    * @property {Array of Note} notes
    */
  this.notes  = null
  
  // Analyse de la gamme
  this.note_scale  = scale.substring(0,1).toLowerCase() // -> p.e. "c"
  this.inote_scale = NOTES.indexOf(this.note_scale)
  if(this.inote_scale < 0) throw "Il faut donner une note correcte pour la gamme !"
  if(scale.length > 1) this.alteration = scale.substring(1,2)
  
  // Dispatch des paramètres envoyés
  if(undefined == params) params = {}
  for(var prop in params) this[prop] = params[prop]
  
  this.data_scale   = DATA_SCALES[this.type]
  if(undefined == this.data_scale)   throw "Le type de gamme `"+this.type+"` est inconnu…"
  this.intervalles  = this.data_scale.intervalles
  if(this.octave  == null)  this.octave = Staff.best_octave_scale(this.staff.cle, this.inote_scale)
  if(this.from    == null)  this.from   = this.note_scale
  
  if(!this.staff) throw "Portée "+params.staff+" inconnue…"
  
  this.build()
}
$.extend(Scale.prototype, METHODES_GROUPNOTES)

$.extend(Scale.prototype,{
  /**
    * Construction de la gamme
    * @method build
    */
  build:function()
  {
    this.notes = [null]
    var i, note, i_int = -1, alt, last_hauteur, cur_octave = parseInt(this.octave) ;
    for(i = 0; i < this.for; ++i)
    {
      note = NOTES[i + this.inote_scale] // p.e. "e"
      if(i > 0 && note == "c") ++cur_octave

      // -- L'altération --
      if('undefined' != typeof last_hauteur)
      {
        hauteur_needed     = (last_hauteur + this.intervalles[++i_int])
        if(hauteur_needed > 12) hauteur_needed -= 12
        diff = hauteur_needed - REAL_INDICES_NOTES[note]
        switch(diff)
        {
        case -2 : alt = "t"; break;
        case -1 : alt = "b"; break;
        case 0  : alt = "" ; break;
        case 1  : alt = "d"; break;
        case 2  : alt = "x"; break;
        default : ""
        }
      }
      else
      { // la première
        alt = this.alteration || ""
      }
    
      // -- la note string complète --
      note_str = note + alt + cur_octave.toString()
    
      // dlog("note str finale:"+note_str)
    
      Anim.current_x += this.offset
      this.notes.push(NOTE(note_str))
      // On mémorise la hauteur de la note courante pour pouvoir
      // régler la hauteur de la prochaine note
      last_hauteur = REAL_INDICES_NOTES[note]
      switch(alt)
      {
      case null: break;
      case 'd' : last_hauteur += 1; break
      case 'b' : last_hauteur -= 1; break
      case 'x' : last_hauteur += 2; break
      case 't' : last_hauteur -= 2; break
      }
    }
  }
})