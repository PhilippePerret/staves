/**
  * Pour tout ce qui concerne un pas, une étape de l'animation
  *
  * Notes
  * -----
  *   * C'est au bout de ce fichier qu'est défini NEXT_STEP
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
    * Liste de toutes les étapes (code de console splitter par les retours-chariot)
    * @property {Array} list
    * @default null
    */
  list:null,
  
  /**
    * Étape courante (texte string de la console, sans le retour chariot)
    * @property {String} current
    */
  current:null,
  
  /**
    * Joue l'étape (évalue son code)
    * Notes
    * -----
    *   * Pour le moment, la méthode prend le code dans Anim.Step.current
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
    // dlog("-> Anim.Step.run / Anim.Step.current:"+this.current)
    try
    {
      // dlog("run:this.Objects."+this.current)
      eval('Anim.Objects.'+this.current)
      // dlog("run OK")
    }
    catch(err)
    {
      if(MODE_FLASH)
      {
        if(this.nombre_essais_run && this.nombre_essais_run > 2)
        {
          errMess = "# J'ai essayé de jouer 3 fois le code `this.Objects."+this.current+"` en vain. Je poursuis, sans bien être sûr du résultat produit…"
          F.error(errMess)
          dlog("#ERROR# "+ errMess)
        }
        else
        {
          if(undefined == this.nombre_essais_run) this.nombre_essais_run = 0
          ++ this.nombre_essais_run
          dlog("this.nombre_essais_run="+this.nombre_essais_run)
          if(this.timer_essais_run) clearTimeout(this.timer_essais_run)
          this.timer_essais_run = setTimeout($.proxy(this.run, this), 500)
          return
        }
      }
      else // mode non flash (normal)
      {
        errMess = "# Erreur: "+err+ " survenue avec le code `this.Objects."+this.current+". Mais j'essaie de poursuivre."
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
  },
  /**
    * Méthode qui joue la séquence suivante
    * @method next
    */
  next:function()
  {
    if(this.timer) clearTimeout(this.timer)
    if(!this.list) return Anim.stop()
    this.set_current()
    if(undefined == this.current) return
    // Passer les commentaires
    if(this.current.substring(0,1) == "#") return this.next()
    // Passer les lignes vides 
    if(this.current.trim() == "") return this.next()
    /* === On joue l'étape === */
    this.run()
    if(!this.list || this.list.length == 0) Anim.stop()
  },
  /**
    * Définit l'étape courante
    * PRODUIT
    * -------
    *   * Définit la propriété `current` (Anim.Step.current)
    *   * Sélectionne la portion de code dans la console
    *
    * @method set_current
    */
  set_current:function()
  {
    // On prend le code tel quel pour pouvoir gérer la sélection du code
    this.current = this.list.shift()
    if(undefined == this.current) return
    Console.move_cursor({for:this.current.length + 1})
    this.current = this.current.trim() // => le texte épuré de l'étape
  },
  
  /**
    * Passe à l'étape suivante, mais seulement si le mode pas à pas n'est
    * pas enclenché.
    * NOTES
    * -----
    *   * Si Anim.transition.step est défini, et que +no_timeout+ n'est pas true,
    *     alors il faut appeler next() seulement après le délai spécifié
    *
    * @method auto_next
    * @param  {Boolean} no_timeout Si true, pas de délai avant d'appeler l'étape suivante
    */
  auto_next:function(no_timeout)
  {
    if(Anim.timer) clearTimeout(Anim.timer)
    if(this.MODE_PAS_A_PAS) return
    if(MODE_FLASH || no_timeout || Anim.transition.step == 0)
    {
      this.next()
    }
    else
    {
      Anim.timer = setTimeout($.proxy(Anim.Step.next, Anim.Step), Anim.transition.step)
    }
  }
  
}

/**
  * Raccourci pour définir de passer à l'étape suivante
  * @for window
  * @property NEXT_STEP
  * @static
  * @final
  */
var NEXT_STEP = $.proxy(Anim.Step.auto_next, Anim.Step)