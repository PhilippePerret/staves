/**
  * @module Event.js
  * Gestion des évènements
  */

window.IN_TEXT_FIELD = false
window.IN_CONSOLE    = false

window.KEYPRESS_HORS_CONSOLE = function(evt)
{
  var no_modifiers = !evt.metaKey && !evt.altKey && !evt.ctrlKey

  // (seulement si l'on ne se trouve pas dans un champ d'édition)
  if(!IN_TEXT_FIELD)
  {
    /* KEY CODE */
    switch(evt.keyCode)
    {
    case K_RIGHT_ARROW : 
      /*
       *  En mode Pas à pas, la touche "->" doit permettre de passer au pas suivant
       *  
       */
      if(Anim.Step.mode_pas_a_pas)
      {
        Anim.Step.next()
        return stop_event(evt)
      } 
      break
    }
    /* CHAR CODE */
    switch(evt.charCode)
    {
    case K_SPACE :
      /*
       *  La touche ESPACE doit lancer l'animation ou l'arrêter
       *  
       */
      Anim.on ? Anim.stop(forcer = true) : Anim.start()
      return stop_event(evt)
    case K_TAB :
      /*
       *  La touche TABULATION doit focusser dans le code console
       *  
       */
      Console.console.focus()
      return stop_event(evt)
    case Key_p:
      /*
       *  La touche P doit mettre en pause ou sortir de la pause si
       *  l'animation est en route.
       *
       */
      if( no_modifiers && Anim.on ) {
        if(Anim.pause_on) Anim.restart()
        else              Anim.pause()
        return stop_event(evt)
      }
      break
    }

  }
  else
  {
    // Si l'on est dans la console, l'autocomplétion est active.
    if(IN_CONSOLE && Console.autocompletion(evt)) return stop_event(evt)
  }
  
  if(no_modifiers)
  {
    return true
  } 
  
  switch(evt.charCode)
  {
  case Key_d:
    break
  case Key_n: // => nouvelle animation
    if(evt.metaKey)
    {
      Anim.new()
      return stop_event(evt)
    }
  case Key_o: // => Ouvrir…
    if(evt.metaKey)
    {
      Anim.want_open()
      return stop_event(evt)
    }
  // case Key_r: // => recharger l'animation
  //   if(evt.metaKey)
  //   {
  //     Anim.reload()
  //     return stop_event(evt)
  //   }
  //   break
  case Key_s: // => Sauver/Sauver sous l'animation
    if(evt.metaKey)
    {
      if(evt.shiftKey)  Anim.File.save_as()
      else              Anim.File.save()
      return stop_event(evt)
    }
    break
  case Key_0:
  case Key_0PN:
    if(evt.metaKey){ Anim.onchange_play_type('all');return stop_event(evt) }
    break
  case Key_1:
  case Key_1PN:
    if(evt.metaKey){ Anim.onchange_play_type('selection');return stop_event(evt) }
    break
  case Key_2:
  case Key_2PN:
    if(evt.metaKey){ Anim.onchange_play_type('repairs');return stop_event(evt) }
    break
  case Key_3:
  case Key_3PN:
    if(evt.metaKey){ Anim.onchange_play_type('cursor');return stop_event(evt) }
    break
  case Key_4:
  case Key_4PN:
    if(evt.metaKey){ Anim.onchange_play_type('stepbystep');return stop_event(evt) }
    break
  default:
    // F.show("charcode:"+evt.charCode+ " / keyCode:"+evt.keyCode)
  }
  return true
}

/**
  * @method onkeypress
  * @for window
  * @param  {Event} evt L'évènement keypress envoyé
  *
  */
window.onkeypress = KEYPRESS_HORS_CONSOLE
