/**
  * @module UI.js
  */

/**
  * @class UI
  * @static
  */
if(undefined == window.UI) window.UI = {}
$.extend(UI,{
  
  /**
    * Peuple le menu des applications avec la liste +name_list+
    * @method peuple_liste_animations
    * @param {Array} name_list  Liste des affixes d'animation
    */
  peuple_liste_animations:function(name_list)
  {
    $('select#animation').html('<option value="0">Charger l\'animation…</option>')
    L(name_list).each(function(name){
      $('select#animation').append('<option value="'+name+'">'+name+'</option>')
    })
  },
  
  /**
    * Modifie le nom courant de l'animation
    * Note
    *   * La méthode est appelée après avoir changé le nom du fichier
    *     enregistré
    *   * La méthode modifie également le nom Anim.name
    *
    * @method change_animation_name
    * @param  {String} L'ancien nom (le nom actuel)
    * @param  {String} Le nouveau nom
    */
  change_animation_name:function(old_name, new_name)
  {
    code = '<option value="'+new_name+'">'+new_name+'</option>'
    old_option = $('select#animation option[value="'+old_name+'"]')
    $(code).insertAfter(old_option)
    old_option.remove()
    Anim.name = new_name
    $('select#animation').val(new_name)
  }
  
  
})