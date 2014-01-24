/**
  * @module Anim_infos
  */

/**
  * Gestion des informations de l'animation courante (dans la section #infos)
  *
  * @class Infos
  * @static
  * @for Anim
  */
if(undefined == window.Anim) window.Anim = {}
window.Anim.Infos = {
  /**
    * L'objet DOM de la section infos
    * @property {jQuerySet} section
    */
  section:null,
  /**
    * Prépare la section infos
    * @method prepare
    */
  prepare:function()
  {
    this.section = $('section#infos')
    var me = this
    // Position actuelle du curseur
    this.section.append(this.div_infos_for('current_x', Anim.current_x, "Position curseur"))
    // Les valeurs des préférences
    L(Anim.prefs).each(function(k, v){me.section.append(me.div_infos_for('prefs-'+k, v, k))})
    this.section.draggable()
  },
  /**
    * Retourne la valeur à afficher, en fonction de son type
    * @method displayed_value
    * @param {Any} value  La valeur transmise
    * @return {String} La valeur à afficher
    */
  displayed_value:function(value)
  {
    if('boolean' == typeof value) return value ? 'true' : 'false'
    if(value === null) return 'null'
    return value.toString()
  },
  /**
    * Retourne la valeur odd ou even pour la ligne à écrire
    * @method oddeven
    * @return {String} une fois "odd" et une fois "event"
    */
  oddeven_value: 'odd',
  oddeven:function()
  {
    this.oddeven_value = this.oddeven_value == 'odd' ? 'even':'odd'
    return this.oddeven_value
  },
  /**
    * Retourne le DIV pour l'information de clé +key+
    * @method div_infos_for
    * @param {String}         key     La clé visée
    * @param {String|Number}  value   La valeur à afficher
    * @param {String}         label_alt   Label optionnel à utiliser au lieu de +key+
    * @return {String} Le code HTML du div.
    */
  div_infos_for:function(key, value, label_alt)
  {
    return  '<div id="infos-'+key+'" class="'+this.oddeven()+'">'+
              '<label>'+(label_alt || key).replace(/_/g,' ')+'</label>'+
              '<span id="infos-'+key+'-value" class="value">'+this.displayed_value(value)+'</span>'+
            '<div>'
  },
  /**
    * Retourne le selector jQuery pour l'info de clé +key+
    * @method jid_key
    * @param {String} key   La clé
    */
  jid_key:function(key)
  {
    return "span#infos-"+key+"-value"
  },
  /**
    * Affiche toutes les infos courantes
    * (au démarrage de l'animation)
    * @method show
    */
  show:function()
  {
    var my = this
    // Valeur des préférences
    L(Anim.prefs).each(function(k,v){$(my.jid_key('prefs-'+k)).html(my.displayed_value(v))})
    // Valeur du décalage (next) actuel
    this.show_offset_cursor()
  },
  /**
    * Actualise une valeur dans l'affichage
    * @method set
    * @param {String} key   La clé exacte pour construire de DOM id
    * @param {Number|String} value  La valeur à afficher
    */
  set:function(key, value)
  {
    $(this.jid_key(key)).html(this.displayed_value(value))
  },
  /**
    * Actualise l'affichage d'une préférence (Anim.prefs)
    * @method show_pref
    * @param  {String} kpref  La clé dans Anim.prefs
    * @param  {Number|String} vpref   La valeur à afficher
    */
  show_pref:function(kpref, vpref)
  {
    this.set('prefs-'+kpref, vpref)
  },
  show_offset_cursor:function()
  {
    this.set('offset_cursor', Anim.current_x)
  }
}