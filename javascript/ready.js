$(document).ready(function(){

  // Préparer l'interface (dont la règle)
  UI.prepare()
  
  Anim.on_load()
    
  // Pour test courant
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'CBT1_Prelude_1')
  Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'Essai_grid')
  Anim.load_list_animations()
  
  // Pour forcer à choisir la bonne animation
  Console.set('')

})