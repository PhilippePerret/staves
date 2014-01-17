/**
  * @module Anim_Dom.js
  */

/**
  * Gestion de la partie DOM de l'animation
  *
  * @class Anim.Dom
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
Anim.Dom = {
  /**
    * Valeur left maximale en fonction de la taille de l'animation à l'écran
    * Note : La valeur est calculée par UI.onresize_window
    * @property {Number} left_max
    */
  left_max:null,
  /**
    * Affiche un objet quelconque de l'animation
    * Notes
    * -----
    *   * La méthode est toujours en fin de chaine donc elle doit toujours
    *     appeler NEXT_STEP(). Mais si la méthode `params.complete` est
    *     définie, elle peut être appelée au lieu de NEXT_STEP, en sachant
    *     que cette méthode `complete` devra se charger OBLIGATOIREMENT
    *     d'appeler NEXT_STEP().
    *     Cela arrive par exemple lorsqu'un objet est constitué de plusieurs
    *     éléments, comme une note altérée avec lignes supplémentaires
    *
    * @method show
    * @param  {Any} obj L'objet (Note, Txt, etc.) à afficher
    * @param  {Object} params Les paramètres optionnels
    *   @param  {Number} params.duree   Le temps pour faire apparaitre l'objet
    *   @param  {Function} params.complete  La méthode pour suivre (NEXT_STEP par défaut)
    */
  show:function(obj, params)
  {
    // dlog("-> Anim.Dom.show / params:");dlog(params)
    if(undefined == params) params = {}
    if(undefined == params.complete) params.complete = NEXT_STEP
    if(MODE_FLASH)
    {
      obj.css('opacity',1)
      params.complete()
    }
    else
    {
      obj.animate(
        {opacity:1}, 
        params.duree || Anim.delai_for('show'),
        params.complete
        )
    }
  },
  /**
    * Ajoute un objet DOM à l'animation
    * Notes
    *   * Pour pouvoir fonctionner, l'instance doit toujours définir : 
    *     - la propriété `code_html` qui définit le code HTML de l'instance
    *     - la méthode `positionne` qui positionne l'élément.
    *     - la méthode `show` qui l'affiche
    * @method add
    * @async
    * @param  {HTMLString|Instance} instance 
    *                               L'instance ou le code HTML de l'élément. Si c'est
    *                               une instance, elle doit répondre à la méthode
    *                               `code_html` qui renvoie le code HTML à afficher
    * @params {Object|Undefined} params Les paramètres optionnels
    *   @params {Function} params.complete    La méthode à appeler en fin de processus (ce processus étant asynchrone)
    *     
    */
  add:function(instance, params)
  {
    // dlog("-> Anim.Dom.add")
    var a_simple_string = 'string' == typeof instance, code_html ;
    if(a_simple_string)
    {
      code_html = instance
    }
    else
    {
      code_html = instance.code_html
    }
    
    // === Ajout du code ===
    this.section.append(code_html)
    
    if(a_simple_string)
    {
      
    }
    else
    {
      // Positionne et affiche l'objet
      instance.positionne()
      instance.show(params)
    }
  },
  /**
    * Initialisation du doublage (efface et masque les champs doublage et caption)
    * @method init_doublage
    */
  init_doublage:function()
  {
    $('span#caption_text').html('');
    $('div#caption').hide();
    $('div#doublage').html('').hide();
  },
  /**
    * Écrit le doublage ou le sous-titre +texte+ (en fonction de params et des
    * réglages par défaut)
    * Notes
    * -----
    *   * Si Anim.prefs.caption_timer est true, le texte est écrit au débit
    *     Anim.prefs.caption_debit.
    *
    * @method set_doublage
    * @param {String} texte Le texte (vide ou undefined pour supprimer le div)
    * @param {Object|Boolean} params  Les paramètres optionnels
    *                                 Ou une valeur true ou false, qui détermine caption
    *   @param {Boolean} params.caption    Si false => doublage, si true => caption
    *   @param {Boolean} params.wait      Si true, on attend la fin de l'affichage du doublage
    *                                     avant de passer à la suite.
    */
  set_doublage:function(texte, params)
  {
    // dlog("-> set_doublage(params :");dlog(params)
    if(undefined == params) params = {}
    else if ('boolean' == typeof params) params = {caption:params}
    else if (params.doublage == true) params.caption = !params.doublage
    var is_caption  = params.caption == true || Anim.prefs.caption == true
    var is_doublage = !is_caption
    var obj = $(is_caption ? 'span#caption_text' : 'div#doublage')
    var montrer = (undefined != texte) && (texte.trim() != "")
    if(montrer)
    {
      obj.show()
      if(is_doublage && Anim.prefs.caption_timer)
      { // On doit afficher le texte comme il sera dit
        this.mots_doublage = texte.trim().split(' ')
        this.imot_doublage = 0
        $('div#doublage').html('')
        if(params.wait) this.doublage_temporised.poursuivre = NEXT_STEP
        // dlog(this.mots_doublage)
        this.doublage_temporised()
      }
      else obj.html(texte.trim())
    }
    else
    {
      obj.hide()
    }
    if(is_caption) $('div#caption')[montrer?'show':'hide']()
    if(!params.wait) NEXT_STEP(notimeout=true)
  },
  doublage_temporised:function()
  {
    if(this.timer_doublage) clearTimeout(this.timer_doublage)
    if(mot = this.mots_doublage.shift())
    {
      ++this.imot_doublage
      $('div#doublage').append('<span id="spanmot'+this.imot_doublage+'" style="display:none;">'+mot+'</span> ')
      $('div#doublage > span#spanmot'+this.imot_doublage).show(400)
      
      var duree = parseInt(Math.ceil(mot.length / 3) * 200, 10)
      this.timer_doublage = setTimeout($.proxy(Anim.Dom.doublage_temporised, Anim.Dom), duree)
    }
    else
    {
      if(this.doublage_temporised.poursuivre) this.doublage_temporised.poursuivre()
    }
  },
  /**
    * Méthode d'aide qui affiche un point de repère aux coordonnées x/y, puis
    * le fait disparaitre. Écrit les coordonnées dans le feedback UI
    * @method show_point_at
    * @param  {Number} x    Position horizontale
    * @param  {Number} y    Position verticale
    */
  show_point_at:function(x,y)
  {
    UI.feedback("<span class=\"red\">x/left:"+x+" | y/top:"+y+'</span>')
    if(this.point_repere.length == 0) this.section.append('<div id="point_repere_anim"></div>')
    this.point_repere.css({opacity:1, left:x+'px', top:y+'px'})
    this.timer_point_repere = setTimeout($.proxy(this.hide_point_repere, this),500)
  },
  hide_point_repere:function()
  {
    clearTimeout(this.timer_point_repere)
    delete this.timer_point_repere
    this.point_repere.animate({opacity:0})
  }
}

Object.defineProperties(Anim.Dom,{
  /**
    * Objet DOM de la section animation
    * @property section
    */
  "section":{
    get:function(){return $('section#animation')}
  },
  
  /**
    * Objet DOM du point de repère
    * @property {jQuerySet} point_repere
    */
  "point_repere":{
    get:function(){return $('section#animation div#point_repere_anim')}
  }
})