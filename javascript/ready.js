$(document).ready(function(){

  // Régler le mode pas à pas 
  Anim.def_mode_pas_a_pas($('input#cb_mode_pas_a_pas')[0].checked)
  
  // Préparer l'interface (dont la règle)
  UI.prepare()
  // Prépare la section Infos
  Anim.Infos.prepare()
  
  Anim.set_slider()
  
  Anim.load_list_animations()
  
  // Pour forcer à choisir la bonne animation
  Console.set('')

})