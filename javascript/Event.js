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
  case Key_r: // => recharger l'animation
    if(evt.metaKey)
    {
      Anim.reload()
      return stop_event(evt)
    }
    break
  case Key_s: // => Sauver/Sauver sous l'animation
    if(evt.metaKey)
    {
      if(evt.shiftKey) Anim.save_as()
      else Anim.save()
      return stop_event(evt)
    }
    break
    
  }
  return true
}