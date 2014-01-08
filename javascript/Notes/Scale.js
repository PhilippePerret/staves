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
  var note_scale  = scale.substring(0,1).toLowerCase() // -> p.e. "c"
  var inote_scale = NOTES.indexOf(note_scale)
  if(inote_scale < 0) throw "Il faut donner une note correcte pour la gamme !"
  var alteration = null
  if(scale.length > 1) alteration = scale.substring(1,2)
  // Paramètres de la gamme
  if(undefined == params) params = {}
  if(undefined == params.staff)   params.staff = Anim.current_staff
  else params.staff = Anim.staves[params.staff]
  if(undefined == params.staff) throw "Portée "+params.staff+" inconnue…"
  if(undefined == params.type)    params.type  = 'MAJ'
  var data_scale = DATA_SCALES[params.type]
  if(undefined == data_scale) throw "Le type de gamme `"+params.type+"` est inconnu…"
  if(undefined == params.asc)     params.asc   = true
  if(undefined == params.offset)  params.offset = 60
  if(undefined == params.octave)  params.octave = Staff.best_octave_scale(params.staff.cle, inote_scale)
  if(undefined == params.for)     params.for    = 8
  if(undefined == params.from)    params.from   = note_scale
  // Liste des intervalles de la gamme demandée
  var intervalles = DATA_SCALES[params.type].intervalles
  
  //== On peut construire la gamme ==
  var groupnotes = [null]
  var i, note, i_int = -1, alt, last_hauteur ;
  for(i = 0; i < params.for; ++i)
  {
    note = NOTES[i + inote_scale] // p.e. "e"
    if(i > 0 && note == "c") ++params.octave

    // -- L'altération --
    if('undefined' != typeof last_hauteur)
    {
      hauteur_needed     = (last_hauteur + intervalles[++i_int])
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
      alt = alteration || ""
    }
    note_str = note + alt
    
    // -- l'octave --
    note_str += params.octave.toString()
    
    // dlog("note str finale:"+note_str)
    
    Anim.current_x += params.offset
    groupnotes.push(NOTE(note_str))
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
  
  $.extend(groupnotes, GROUPNOTES_METHODS)
  Object.defineProperties(groupnotes, GROUPNOTES_PROPERTIES)
  return groupnotes
}
