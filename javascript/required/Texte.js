/**
  * @module Texte.js
  */

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
    * @return {Object} L'instance Note courante (pour chainage)
    */
  write:function(texte, params)
  {
    // dlog("-> <Note>.write("+texte+")")
    if(undefined == params) params = {}
    params.texte  = texte
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
    * @return {Object} L'instance courante (pour chainage)
    */
  measure:function(numero, params)
  {
    if(undefined == params) params = {}
    params.type = measure
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
    *   @param  {Number}  params.offset_y   Décalage avec la position normale par rapport à la portée
    * @return {Object} L'instance Note courante (pour chainage)
    */
  harmony:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = harmony
    this.write(texte, params)
    
    return this
  },
  /**
    * Raccourci pour écrire un texte de type cadence
    * @method cadence
    * @param  {String} texte    Le texte à écrire
    * @param  {Object} params   Paramètres optionnels
    * @return {Object} L'instance Note courante (pour chainage)
    */
  cadence:function(texte, params)
  {
    if(undefined == params) params = {}
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
    * @return {Object} L'instance Note courante (pour chainage)
    */
  modulation:function(texte, params)
  {
    if(undefined == params) params = {}
    params.type = modulation
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
    if(undefined == params) params = {}
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
