/**
  * @module Texte.js
  */

/**
  * Définition de la couleur du texte en fonction du fond courant (if any)
  * @class COLOR_TEXT_PER_BACKGROUND
  * @static 
  * @final
  */
window.COLOR_TEXT_PER_BACKGROUND = {
  'black'   : 'white',
  '#00000'  : 'white',
  '#000'    : 'white',
  'white'   : 'black',
  '#FFFFFF' : 'black',
  '#FFF'    : 'black'
}
/**
  * Méthodes qui doivent être héritées ($.extend) par tout objet
  * pouvant contenir un texte (Note, Chord, Staff, etc.)
  * @property {Object} METHODES_TEXTE
  * @for window
  */
window.METHODES_TEXTE = {
  /**
    * Écrit un texte au-dessus ou en dessous du possesseur du texte
    * Notes
    * -----
    *   * La méthode placera le texte (instance {Txt} dans la propriété `texte`
    *     avec en clé le type de texte ('regular', 'harmony', 'chord', etc.)
    *   * L'étape suivante doit être appelée par l'affichage du texte (Txt::show)
    *
    * @method write
    * @param  {String} texte Le texte à écrire
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number}  params.x          La position horizontale absolue du texte
    *   @param  {Number}  params.offset_x   Le décalage horizontale par rapport à la position par défaut
    *   @param  {Number}  params.y          La position verticale absolue du texte
    *   @param  {Number}  params.offset_y   Le décalage vertical par rapport à la position par défaut
    * @return {Object} L'instance du porteur (pour chainage)
    */
  write:function(texte, params)
  {
    // dlog("-> <Note>.write("+texte+")")
    params = define_params(params, {texte:texte})
    if(undefined == params.type) params.type = 'regular'
    if(params.type_cadence)
    {
      params.sous_type = params.type_cadence
      delete params.type_cadence
    } 
    if(!this.texte) this.texte = {}
    this.texte[params.type] = TXT(this, params)
    this.texte[params.type].build()
    return this
  },
  /**
    * Raccourci-write pour écrire un numéro de mesure
    * @method measure
    * @param {Object} params Paramètres optionnels
    *   @param  {Number}  params.x    Le décalage horizontal par rapport à la position par défaut (sera transformé en `offset_x`)
    *   @param  {Number}  params.y    Idem, mais pour le décalage vertical
    * @return {Object} L'instance du porteur (pour chainage)
    */
  measure:function(numero, params)
  {
    params = define_params(params, {type:measure})
    params = change_x_y_to_offsets_in_params( params )
    this.write(numero, params)
    return this
  },
  /**
    * Alias de measure
    * @method mesure
    */
  mesure:function(numero,params){return this.measure(numero,params)},
  
  /**
    * Raccourci-write pour écrire un texte d'harmony
    * @method harmony
    * @param  {String} texte  Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    *   @param  {Number}  params.staff      La portée sous laquelle il faut placer l'harmonie
    *   @param  {Number}  params.offset_x   Décalage horizontal par rapport à position par défaut
    *   @param  {Number}  params.x          Idem que `offset_x` (sera détruit et remplacé)
    *   @param  {Number}  params.offset_y   Décalage avec la position normale par rapport à la portée
    *   @param  {Number}  params.y          Même chose (sera détruit et remplacé)
    * @return {Object} L'instance du porteur (pour chainage)
    */
  harmony:function(texte, params)
  {
    params = change_x_y_to_offsets_in_params( params )
    params.type = harmony
    this.write(texte, params)
    
    return this
  },
  /**
    * Raccourci pour écrire un texte de type cadence
    * @method cadence
    * @param  {String} texte    Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    * @return {Object} L'instance du porteur (pour chainage)
    */
  cadence:function(texte, params)
  {
    params = change_x_y_to_offsets_in_params( params )
    if(params.type) params.sous_type = params.type
    params.type = cadence
    this.write(texte, params)
    return this
  },
  /**
    * Ajoute une marque de modulation
    * @method modulation
    * @param {String} texte   Le texte de la modulation (au moins la note)
    * @param {Object} params  Les paramètres optionnels
    * @return {Object} L'instance du porteur (pour chainage)
    */
  modulation:function(texte, params)
  {
    params = change_x_y_to_offsets_in_params( params )
    params.type = modulation
    this.write(texte, params)
    return this
  },
  /**
    * Écrit une marque de PARTIE
    * @method part
    * @param {String} texte     Le texte de la partie
    * @param {Object} params    Les paramètres optionnels (cf. write, les mêmes)
    * @return {Object} L'instance du porteur (pour chainage)
    */
  part:function(texte, params)
  {
    params = define_complete(params)
    params = change_x_y_to_offsets_in_params( params )
    params.type = part
    this.write(texte, params)
    return this
  },
  /**
    * Raccourci pour écrire un texte de type 'chord' (un accord placé au-dessus
    * de la portée et au-dessus de l'élément porteur)
    * @method chord
    * @param  {String} accord   L'accord à marquer
    * @param  {Object} params   Les paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  chord:function(accord, params)
  {
    params = change_x_y_to_offsets_in_params( params )
    params.type = chord
    this.write(accord, params)
    return this
  }
}
/**
  * Propriétés qui doivent être héritées (Object.defineProperties) par tout objet
  * pouvant contenir un texte (Note, Accords, etc.)
  * @property {Object} PROPERTIES_TEXTE
  * @for window
  */
window.PROPERTIES_TEXTE = {
  
}
