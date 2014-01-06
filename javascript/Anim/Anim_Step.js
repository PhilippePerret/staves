/**
  * Pour tout ce qui concerne un pas, une étape de l'animation
  *
  * @module Anim_Step
  */

/**
  * @class Step
  * @for Anim
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
Anim.Step = {
  /**
    * Joue l'étape (évalue son code)
    * Notes
    * -----
    *   * Pour le moment, la méthode prend le code dans Anim.current_step
    *     TODO: Mais plus tard, ce code devrai être géré dans ce Anim.Step
    *   * Un timer peut avoir été défini (si Anim.transition.step est ≠ 0)
    *   * Le bloc 'try' a une double fonction ici : en mode normal, il génère
    *     une erreur mais poursuit le code. En mode flash, il peut arriver que
    *     ça aille trop vite pour les éléments soient affichés, donc on fait 
    *     une courte pause avant de ré-évaluer l'étape. On essaie un maximum de
    *     3 fois puis on abandonne.
    * @method run
    */
  run:function()
  {
    dlog("-> Anim.Step.run / Anim.current_step:"+Anim.current_step)
    try
    {
      dlog("run:this.Objects."+Anim.current_step)
      dlog("ndo3 defini ? "+(undefined == Anim.Objects.ndo3 ? "NON" : "oui"))
      eval('Anim.Objects.'+Anim.current_step)
      dlog("run OK")
    }
    catch(err)
    {
      if(MODE_FLASH)
      {
        if(this.nombre_essais_run && this.nombre_essais_run > 2)
        {
          errMess = "# J'ai essayé de jouer 3 fois le code `this.Objects."+Anim.current_step+"` en vain. Je poursuis, sans bien être sûr du résultat produit…"
          F.error(errMess)
          dlog("#ERROR# "+ errMess)
        }
        else
        {
          if(undefined == this.nombre_essais_run) this.nombre_essais_run = 0
          ++ this.nombre_essais_run
          dlog("this.nombre_essais_run="+this.nombre_essais_run)
          if(this.timer_essais_run) clearTimeout(this.timer_essais_run)
          this.timer_essais_run = setTimeout($.proxy(Anim.Step.run, Anim.Step), 500)
          dlog("J'ai placé le timer")
          return
        }
      }
      else // mode non flash (normal)
      {
        errMess = "# Erreur: "+err+ " survenue avec le code `this.Objects."+Anim.current_step+". Mais j'essaie de poursuivre."
        F.error(errMess)
        dlog("#ERROR# "+errMess)
      }
      NEXT_STEP()
    }
    // S'il y a eu plusieurs essais en mode flash
    if(this.timer_essais_run)
    {
      clearTimeout(this.timer_essais_run)
      delete this.nombre_essais_run
    }
  }
}