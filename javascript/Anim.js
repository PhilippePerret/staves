/**
  * @module Anim
  */

/**
  * Objet Anim pour jouer l'animation
  *
  * @class Anim
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
$.extend(window.Anim,{
  /**
    * Vitesse d'apparition des éléments
    * @property {Number} VITESSE_SHOW
    * @static
    * @final
    */
  VITESSE_SHOW: 400,
  
  /**
    * Mode pas à pas
    * Si true, on passe d'un pas de l'animation à un autre en cliquant
    * sur le bouton pour jouer l'animation
    * @property {Boolean} MODE_PAS_A_PAS
    */
  MODE_PAS_A_PAS:false,
  
  /**
    * Liste des portées affichées
    * @property {Array} staves
    */
  staves:[],
  
  /**
    * La portée courante (une instance Staff)
    * @property {Staff} current_staff
    */
  current_staff:null,
  
  /**
    * === Main ===
    *
    * Joue l'animation courante
    * Notes
    * -----
    *   * La méthode est également appelée à chaque pas en mode "pas à pas"
    * @method start
    * @param  {Object} params   Paramètres optionnels
    */
  start:function(params){
    if(!this.steps) this.steps = Console.steps
    this.next_step()
  },
  /**
    * Stoppe l'animation, parce qu'on est au bout ou parce que 
    * c'est demandé
    * @method stop
    */
  stop:function()
  {
    delete this.timer
    delete this.steps
  },
  
  /**
    * Méthode qui joue la séquence suivante
    * @method next_step
    */
  next_step:function()
  {
    if(this.timer) clearTimeout(this.timer)
    if(!this.steps) return // un timer qui resterait perdu
    this.current_step = this.steps.shift()
    this.write_current_step()
    eval('this.Objects.'+this.current_step)
    if(this.steps.length == 0) this.stop()
  },
  
  /**
    * Passe à l'étape suivante, mais seulement si le mode pas à pas n'est
    * pas enclenché
    * @method auto_next_step
    */
  auto_next_step:function()
  {
    if(this.MODE_PAS_A_PAS) return
    this.next_step()
  },
  
  /**
    * Attends +laps+ secondes avant de passer à l'étape suivante
    *
    * @note C'est un raccourci de Anim.Objects.WAIT
    * @method wait
    * @param  {Number} laps Nombre de secondes (peut être un flottant)
    */
  wait:function(laps){ this.Objects.WAIT(laps) },
    
  /**
    * Ajoute un objet DOM à l'animation
    * Notes
    *   * On ajoute toujours l'élément masqué, mais c'est ici que la méthode
    *     ajouter ` style="opacity:0;"` donc inutile de le mettre dans le
    *     code.
    *   * Pour pouvoir fonctionner, l'instance doit toujours définir : 
    *     - la propriété `code_html` qui définit le code HTML de l'instance
    *     - la méthode `positionne` qui positionne l'élément.
    *     - la méthode `show` qui l'affiche
    * @method add
    * @param  {HTMLString} code_html  Le code HTML de l'élément.
    */
  add:function(instance)
  {
    var code_html = instance.code_html
    if(code_html.indexOf('opacity:0')<0)
    {
      code_html = code_html.substring(0, code_html.length-1) + ' style="opacity:0;">'
    }
    $('section#staves').append(code_html)
    instance.positionne()
    instance.show(instance.class == 'Staff' ? 0 : this.VITESSE_SHOW)
  },
  
  /**
    * Écrit l'étape courante
    * @method write_current_step
    * Note: l'étape courante ({String}) se trouve dans this.current_step
    */
  write_current_step:function()
  {
    $('div#current_step').html(this.current_step)
  },
  
  /**
    * Active ou désactive le mode "pas à pas"
    * @method def_mode_pas_a_pas
    * @param  {Boolean} active    Si true, active le mode Pas à pas
    */
  def_mode_pas_a_pas:function(active)
  {
    dlog("-> def_mode_pas_a_pas(active="+active+")")
    this.MODE_PAS_A_PAS = active
    Flash.show("Le mode pas à pas est "+(active ? 'activé' : 'désactivé'))
  },
  
  /**
    * Affiche un objet quelconque de l'animation
    * @method show
    * @param  {Any} obj L'objet (Note, Txt, etc.) à afficher
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number} params.duree   Le temps pour faire apparaitre l'objet
    *   @param  {Function} params.complete  La méthode pour suivre
    */
  show:function(obj, params)
  {
    if(undefined == params) params = {}
    obj.animate(
      {
        opacity:1
      }, 
      params.duree || 1000, 
      params.complete ? params.complete : null
    )
  },
  
  /**
    * Crée une nouvelle portée de clé +cle+ et de métrique +metrique+ sous
    * la dernière portée affichée (et l'enregistre dans this.staves)
    * Notes
    *   * Cette méthode ne met pas la portée en portée courante, c'est la méthode
    *     appelante qui doit s'en charger.
    * @method new_staff
    * @param  {String} cle La clé de la portée (obligatoire)
    * @param  {Object} params Les paramètres éventuels
    *   @param  {String} params.metrique La métrique optionnelle
    *   @param  {Number} params.offset    Le décalage par rapport à la dernière portée
    */
  new_staff:function(cle, params)
  {
    if(undefined == params) params = {}
    var nombre_staves = this.staves.length
    var top = 50 + (100 * nombre_staves)
    if(params.offset) top += params.offset
    var staff = new Staff({cle:cle, top:top})
    staff.build()
    this.staves.push(staff)
    return staff
  }
})

/**
  * Raccourci pour définir de passer à l'étape suivante
  * @for window
  * @property NEXT_STEP
  * @static
  * @final
  */
var NEXT_STEP = $.proxy(Anim.auto_next_step, Anim)