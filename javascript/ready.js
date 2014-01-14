$(document).ready(function(){

  // Préparer l'interface (dont la règle)
  UI.prepare()
  
  Anim.on_load()
    
  // Pour test courant
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'CBT1_Prelude1_01-11')
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'CBT1_Prelude1_12-19')
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'CBT1_Prelude1_20-25')
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'CBT1_Prelude1_26-35')
  Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'Essais_images')
  // Anim.load_list_animations.poursuivre = $.proxy(Anim.load, Anim, 'Essais_motif')
  Anim.load_list_animations()
  
  // Pour forcer à choisir la bonne animation
  Console.set('')

})