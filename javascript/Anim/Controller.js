/*
 *  Attention, il NE s'agit PAS d'un objet Anim.Controller, mais 
 *  de l'extension de la class Anim
 *  
 */
/**
  * Toutes les méthodes qui gèrent le contrôleur de l'animation
  *
  * @module Controller.js
  * @for Anim
  */
if(undefined == window.Anim) window.Anim = {}
$.extend(Anim,{

  /**
    * === Main ===
    *
    * Joue l'animation courante
    * Notes
    * -----
    *   * La méthode est appelée chaque fois qu'on clique le bouton “Play”
    *   * Elle réagit différemment en fonction du mode de jeu (this.play_type)
    *
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    dlog("-> Anim.start (in Controller.js)")
    if(this.on && this.Step.mode_pas_a_pas)
    { 
      // En cours de jeu en mode pas à pas
      this.Step.next()
    }
    else if(this.pause_on)
    { 
      // => redémarrage après pause
      return this.restart()
    }
    else
    { 
      
      // === DÉMARRAGE DE L'ANIMATION ===
      
      this.reset()
      this.Step.list = function(playtype){
        switch(playtype)
        {
        case 'all'        :
        case 'stepbystep' : return Console.steps
        case 'selection'  : return Console.steps_selection
        case 'repairs'    : return Console.steps_between_repairs
        case 'cursor'     : return Console.steps_from_cursor
        }
      }(this.play_type)
      if( this.Step.list )
      {
        Img.get_taille_all_images.complete = $.proxy(this.post_start, this)
        Img.get_taille_all_images()
      }
      else
      {
        F.error("Je n'ai pu trouver aucune étape…")
      }
    } 
  },
  /**
    * Méthode appelée lorsque la taille de toutes les images a été relevée
    * @method post_start
    */
  post_start:function()
  {
    dlog("-> Anim.post_start (in Controller.js)")
    if(this.Step.list)
    { 
      this.play_preambule()
      this.play()
    }
  },
  /**
    * Interprète les étapes de préambule
    * @method play_preambule
    */
  play_preambule:function()
  {
    dlog("-> Anim.play_preambule ("+Console.preambule.length+" étapes)")
    this.preambule_on = true
    L(Console.preambule).each(function(pas){ pas.exec() })
    this.preambule_on = false
    // dlog("<- Anim.play_preambule")
  },
  /**
    * Pré-démarrage de l'animation
    * Notes
    * -----
    *   * Cette méthode a été inaugurée pour gérer les différents traitement
    *     entre jouer tout le code et ne jouer qu'une sélection du code.
    *
    * @method play
    */
  play:function()
  {
    this.on       = true
    this.pause_on = false
    this.Step.auto_next_count = 0 // débuggage
    Pas.count                 = 0 // débuggage
    this.set_interface()
    UI.Regle.hide()
    var delai_before = (this.isSuite) ? 0 : this.prefs.decompte
    if(delai_before > 0)
    {
      this.decompte.poursuivre = $.proxy(this.play_for_good, this)
      this.decompte(delai_before)
    }
    else
    { // Pas de décompte
      this.play_for_good()
    } 
  },
  /**
    * Lance véritablement l'animation, soit après le décompte, soit tout de suite
    * @method play_for_good
    */
  play_for_good:function()
  {
    dlog("-> Anim.play_for_good")
    if( !this.isSuite ) UI.chronometre.start
    // C'est seulement ici qu'on efface l'écran précédent, pour la lien le plus
    // fluide dans une suite d'animation
    // Noter que c'est la possibilité d'une boucle infinie, si complete n'attend
    // pas vraiment la fin de l'effacement
    if($('section#animation *').length)
    {
      return this.Dom.clear($.proxy(this.play_for_good, this), {all:true})
    } 
    this.Step.next()
    dlog("<- Anim.play_for_good")
  },
  /**
    * Pause demandée
    * @method pause
    */
  pause:function()
  {
    UI.chronometre.pause
    this.pause_on = true
    this.set_interface()
  },
  /**
    * Re-démarre après une pause
    * @method restart
    */
  restart:function()
  {
    UI.chronometre.restart
    this.pause_on = false
    this.Step.next()
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * le bouton Stop a été cliqué (ou barre espace).
    * Note : si l'arrêt est forcé par le bouton stop (+forcer+ = true), on ne
    * lance pas l'animation suivante éventellement demandée.
    * @method stop
    * @param {Boolean|Undefined} forcer Mis à true quand c'est un arrêt forcé
    */
  stop:function(forcer)
  {
    if(this.on == false) return // retardataires
    this.on       = false
    this.pause_on = false
    this.kill_timer()
    Console.console.blur()
    delete this.Step.list
    if(forcer)
    { // => arrêt forcé
      if(this.hasSuite)
      { 
        this.hasSuite = false
        delete this.animation_pour_suivre
      }
      this.real_stop()
    } 
    else
    { // => Le cas courant du stop
      var method ;
      if(this.hasSuite)
      { // Une animation doit suivre (noter qu'on s'en retourne tout de suite)
        return this.load_and_start_animation_pour_suivre()
      }
      else
      { // vraiment la fin
        method = 'real_stop'
      } 
      
      if(this.prefs.decompte > 0)
      {
        this.decompte.poursuivre = $.proxy(this[method], this)
        this.decompte(this.prefs.delai_after_show)
      }
      else
      {
        this[method]()
      }
    }
  },
  /**
    * Procède vraiment au stop, en faisant réapparaitre les outils de l'interface
    * Notes
    *   * La méthode n'est pas appelée lors d'une suite d'animations
    *   * Si nécessaire, arrête l'enregistrement QuickTime courant
    *
    * @method real_stop
    */
  real_stop:function()
  {
    if(!this.hasSuite) UI.chronometre.stop
    this.kill_timer()
    $('div#warning').hide()
    this.set_interface()
    this.stop_button.css('opacity', 1)
    UI.Regle.show()
    if(this.recording) this.stop_record()
  },
  /**
    * Pour jouer seulement la sélection
    * Note : La méthode est appelée par le bouton "•" du contrôleur
    * @method play_selection
    */
  play_selection:function()
  {
    var select  = Selection.of(Console.console),
        before  = Console.around_selection(true, 400, true),
        after   = Console.around_selection(false, 400, true) ;
    var index_nl_before = before.lastIndexOf("\n")
    var index_nl_after  = after .indexOf("\n")
    before = before.substring(index_nl_before+1, before.length)
    after  = after.substring(0, index_nl_after)
    var code = before + select.content + after
    var pas, cur_offset = select.start - before.length ;
    L(code.split("\n")).each(function(line){
      pas = new Pas({code:line, offset_start:cur_offset})
      pas.exec()
      cur_offset += pas.length
    })
  },
  /**
    * Affiche un décompte (en fin ou en début d'animation)
    * @method decompte
    * @param  {Number} secs_reste Le nombre de secondes de décompte
    */
  decompte:function(reste)
  {
    this.kill_timer()
    if(!this.decompte.on)
    {
      this.decompte.on = true
      $('div#decompte').show()
    } 
    else reste -= 1
    if(reste == 0)
    {
      $('div#decompte').hide()
      delete this.decompte.on
      this.decompte.poursuivre()
    } 
    else
    {
      $('div#decompte').html(reste)
      this.timer = setTimeout($.proxy(this.decompte,this,reste), 1000)
    }
  },

  /**
    * Règle l'interface, soit pour le jeu, soit pour l'arrêt, soit pour la pause
    * @method set_interface
    */
  set_interface:function()
  {
    // dlog("-> set_interface [on="+this.on+"/pause_on="+this.pause_on+"]")
    
    UI.feedback("")
    
    this.stop_button.css('visibility', this.on ? 'visible':'hidden')
    this.pause_button[this.on && !this.pause_on && !this.Step.mode_pas_a_pas ?'show':'hide']()
    this.start_button[!this.on || this.pause_on || this.Step.mode_pas_a_pas ?'show':'hide']()

    if(!this.on || this.pause_on)
    {
      if(Anim.prefs.grid) this.Grid.show()
    } 
    else this.Grid.hide()
    
    if(this.on)
    {
      /* Les éléments qu'il faut toujours masquer */
      UI.Popups.section.hide()
      /* Les éléments à masquer optionnellement */
      if(Anim.options.fullscreen)
      {
        this.controller.hide()
        Console.console.css('opacity', 0.2)
      }
    }
    else
    {
      /* Les éléments qu'il faut toujours masquer (et donc remettre)*/
      UI.Popups.section.show()
      /* Les éléments à masquer optionnellement */
      if(Anim.options.fullscreen)
      {
        this.controller.show()
        Console.console.css('opacity', 1)
      }
    }
  },
  
  /**
    * Définit le slider de vitesse de l'animation
    * @method set_slider
    */
  set_slider:function()
  {
    $('div#vitesse_animation').slider({
      step    : 1,
      value   : 11,
      min     : 1,
      max     : 21,
      change  : $.proxy(Anim.on_change_vitesse, Anim)
    })
  },
  /**
    * Règle la vitesse (avec la commande SPEED)
    * @method set_speed
    * @param {Number} speed Une valeur de 1 à 21
    */
  set_speed:function(speed)
  {
    $('div#vitesse_animation').slider('value', speed)
  },
  /**
    * Change la vitesse de l'animation
    * Notes
    *   * Appelé par le slider de vitesse du contrôleur
    *     OU par la commande SPEED(...) — qui modifie le slider
    *   * Ne pas mettre d'argument (car le premier est l'évènement)
    *
    * @method on_change_vitesse
    */
  on_change_vitesse:function()
  {
    this.calc_speed_coef()
  }
  
})

Object.defineProperties(Anim,{
  /**
    * Objet DOM de la boite de controller
    * @property {jQuerySet} controller
    */
  "controller":{get:function(){return $('section#controller')}},
  /** 
    * Objet DOM du bouton Start
    * @property {jQuerySet} start_button
    */
  "start_button":{
    get:function(){return $('img#btn_anim_start')}
  },
  /** 
    * Objet DOM du bouton Stop
    * @property {jQuerySet} stop_button
    */
  "stop_button":{
    get:function(){return $('img#btn_anim_stop')}
  },
  /** 
    * Objet DOM du bouton Pause
    * @property {jQuerySet} pause_button
    */
  "pause_button":{
    get:function(){return $('img#btn_anim_pause')}
  },
})