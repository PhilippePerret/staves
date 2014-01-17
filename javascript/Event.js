/**
  * @module Event.js
  * Gestion des évènements
  */

/**
  * @method onkeypress
  * @for window
  * @param  {Event} evt L'évènement keypress envoyé
  *
  */
window.onkeypress = function(evt)
{
  // Mettre en route ou arrêter l'animation avec la barre espace
  if(evt.charCode == K_SPACE)
  {
    Anim.on ? Anim.stop(forcer = true) : Anim.start()
    return stop_event(evt)
  }
  if(!evt.metaKey && !evt.altKey && !evt.ctrlKey && !evt.shiftKey) return true
  
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
      if(evt.shiftKey) Anim.save_as()
      else Anim.save()
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
    F.show("charcode:"+evt.charCode+ " / keyCode:"+evt.keyCode)
  }
  return true
}