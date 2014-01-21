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
    * Liste de toutes les étapes (instances {Pas})
    * @property {Array of Pas} list
    * @default null
    */
  list:null,
  
  /**
    * Étape courante (instance {Pas})
    * @property {Pas} current
    */
  current:null,
  
  // /**
  //   * Indicateur de processus en cours
  //   * Tant que sa valeur est TRUE, on ne peut pas passer à l'étape suivante
  //   * @property {Boolean} EXEC_ON
  //   * @default false
  //   */
  // EXEC_ON: false,
  
  // /**
  //   * Méthode appelée par Pas.exec pour indiquer qu'un processus est en
  //   * cours. Tant que ce processus est en cours, on ne peut pas passer à
  //   * l'étape suivante, quel que soit les appels
  //   * Définit la valeur de Anim.Step.EXEC_ON (this.EXEC_ON)
  //   * @method set_exec_on
  //   */
  // set_exec_on:function()
  // {
  //   this.EXEC_ON = true
  // },
  // /**
  //   * Méthode appelée lorsque l'on est certain que le processus est terminé
  //   * et qu'on peut passer à l'étape suivante.
  //   * Définit la valeur de Anim.Step.EXEC_ON (this.EXEC_ON)
  //   * @method set_exec_off
  //   */
  // set_exec_off:function()
  // {
  //   this.EXEC_ON = false
  // },
  /**
    * Méthode qui définit et exécute l'étape suivante
    * @method next
    */
  next:function()
  {
    if(this.timer) clearTimeout(this.timer)
    // if(this.EXEC_ON)  return // Un processus est encore en cours
    if(Anim.pause_on) return 
    if(!this.list) return Anim.stop()
    this.set_current()
    /* Si this.current est indéfini, c'est qu'on est arrivé au bout */
    if(undefined == this.current) return Anim.stop()
    /* === 
       
       On joue l'étape (sauf commentaires ou lignes vides) 
       
       === */
    var res = this.current.exec()
    // Si l'étape est une étape qui ne produit rien (commentaire, ligne vide),
    // ou qu'il y a eu un problème grave, on passe à l'étape suivante.
    if(false == res) this.next()
  },
  /**
    * Définit l'étape courante et la sélectionne dans le code
    *
    * Notes
    * -----
    *   * Définit la propriété `this.current`
    *
    * @method set_current
    */
  set_current:function()
  {
    if(!this.list || this.list.length == 0)
    {
      delete this.current
      return
    } 
    this.current = this.list.shift()
    this.current.select()
  },
  
  /**
    * Passe à l'étape suivante, mais seulement si le mode pas à pas n'est
    * pas enclenché.
    *
    * NOTES
    * -----
    *   * Si Anim.transition.step est défini, et que +no_timeout+ n'est pas true,
    *     alors il faut appeler next() seulement après le délai spécifié
    *   * On ne fait rien si c'est le préambule qui est joué (les étapes avant que 
    *     l'animation ne démarre vraiment).
    *
    * @method auto_next
    * @param  {Boolean} no_timeout Si true, pas de délai avant d'appeler l'étape suivante
    */
  auto_next:function(no_timeout)
  {
    dlog("-> Anim.Step.auto_next(no_timeout="+no_timeout+")")
    // if(no_timeout) this.EXEC_ON = false
    if(Anim.preambule_on) return
    if(this.timer) clearTimeout(this.timer)
    if(this.mode_pas_a_pas) return
    if(MODE_FLASH || no_timeout || Anim.transition.step == 0)
    {
      this.next()
    }
    else
    {
      this.timer = setTimeout($.proxy(Anim.Step.next, Anim.Step), Anim.delai_for('step'))
    }
  }
}
Object.defineProperties(Anim.Step,{
  "mode_pas_a_pas":{
    get:function(){
      return Anim.play_type == 'stepbystep'
    }
  }
})
/**
  * Raccourci pour définir de passer à l'étape suivante
  * @for window
  * @property NEXT_STEP
  * @static
  * @final
  */
var NEXT_STEP = $.proxy(Anim.Step.auto_next, Anim.Step)