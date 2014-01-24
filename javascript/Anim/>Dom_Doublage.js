/**
  *
  * @module Dom_Doublage.js
  */

/**
  * @class  Doublage
  * @for    Anim.Dom
  */
window.Anim.Dom.Doublage = {
  /**
    * Propriété indiquant si un doublage est en cours d'écriture (true dans ce cas,
    * false si aucun doublage n'est en cours d'écriture)
    * @property {Boolean} on
    */
  on:false,
  
  /**
    * Initialisation du doublage (efface et masque les champs doublage et caption)
    * @method init_doublage
    */
  init:function()
  {
    $('span#caption_text').html('');
    $('div#caption').hide();
    $('div#doublage').html('').hide();
    this.dbl_indx   = 0
    this.dbls_list  = {}
  },
  /**
    * Indice du texte de doublage courant
    * Note : utile pour laisse l'"écho" du texte précédent
    * Il permet de récupérer la liste de mots dans this.dbls_list
    * @property {Number} dbl_indx
    */
  dbl_indx:0,
  /**
    * Liste des textes de doublage. En clé `dbl_indx` (l'indice 1-start du
    * doublage) et en valeurs la liste des indices de mots.
    * @property {Object} dbls_list
    */
  dbls_list:{},
  /**
    * == main ==
    *
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
  show:function(texte, params)
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
      { // On doit afficher le texte comme il sera dit (version "temporisé")
        this.on       = true
        this.dbl_mots = texte.trim().split(' ')
        this.dbl_imot = 0
        this.dbl_indx += 1
        // Si nécessaire, on peut détruire complètement l'avant-dernier
        // doublage (le doublage précédent, lui, est traité en écho)
        this.remove_last(this.dbl_indx - 2)
        this.dbls_list[this.dbl_indx] = []
        if(params.wait) this.temporize.poursuivre = NEXT_STEP
        this.temporize()
      }
      else obj.html(texte.trim())
    }
    else
    {
      obj.hide()
    }
    if(is_caption) $('div#caption')[montrer?'show':'hide']()
    
    // Si l'appel ne définissait pas la propriété wait à true OU que le
    // caption_timer n'est pas à true dans les préférences, alors ou passe tout
    // de suite à l'étape suivante.
    if(!params.wait || Anim.prefs.caption_timer == false)
    {
      NEXT_STEP(notimeout=true)
    } 
  },
  /**
    * Quand un doublage temporisé est en route, on doit laisser l'"écho"
    * du doublage précédent. C'est cette méthode qui s'en charge, en effaçant
    * progressivement les mots du précédent doublage (plus vite que le nouveau
    * doublage n'apparait).
    * @method echo_last
    * @param {Number} dbl_indx   Indice du doublage à laisser en écho
    */
  echo_last:function(idoub)
  {
    if(undefined == this.dbls_list[idoub]) return
    if(this.dbls_list[idoub].length == 0)
    {
      return this.remove_last(idoub)
    }
    // Sinon, on efface les mots du précédent doublage à concurrence de 3
    // anciens mots pour un nouveau mot (puisque cette méthode est appelée chaque
    // fois qu'un nouveau mot doit être affiché)
    for(var i=0; i<3; ++i)
    {
      var iprev_mot = this.dbls_list[idoub].shift()
      if(undefined != iprev_mot) $('span#spanmot'+iprev_mot).animate({'opacity':0})
      // Note : on ne peut pas supprimer les mots tout de suite, ça déplacerait
      // les derniers mots. On le fera lorsque tous les mots auront été traités
      // en supprimant tous les div du doublage en question.
    }
  },
  /**
    * Méthode qui efface le doublage d'indice +idoub+. En fait, ça n'est pas
    * le dernier, mais l'avant dernier, car :
    *   - Un doublage est en cours d'affichage
    *   - Le doublage précédent est en cours d'écho
    *   - Le doublage d'avant peut être détruit complètement.
    * @method remove_last
    * @param {Number} idoub   Indice du DIV doublage à détruire
    *
    */
  remove_last:function(idoub)
  {
    $('div#doublage > div#doublage-'+idoub).remove()
  },
  temporize:function()
  {
    if(this.timer_doublage) clearTimeout(this.timer_doublage)
    if(mot = this.dbl_mots.shift())
    {
      ++ this.dbl_imot
      this.dbls_list[this.dbl_indx].push(this.dbl_imot)
      this.echo_last(this.dbl_indx-1)
      var jid_div_doublage = 'div#doublage > div#doublage-'+this.dbl_indx
      // Doit-on construire le div de ce doublage là ?
      if($(jid_div_doublage).length == 0)
      {
        $('div#doublage').append('<div id="doublage-'+this.dbl_indx+'"></div>')
        $(jid_div_doublage).css('color', this.dbl_indx % 2 == 0 ? "mediumspringgreen" : "yellow")
      }
      $(jid_div_doublage).append('<span id="spanmot'+this.dbl_imot+'" class="spanmot_'+this.dbl_indx+'" style="display:none;">'+mot+'</span> ')
      $(jid_div_doublage +' > span#spanmot'+this.dbl_imot).show(400)
      
      var duree = parseInt(Math.ceil(mot.length / 3) * 200  * Anim.coef_speed, 10)
      this.timer_doublage = setTimeout($.proxy(Anim.Dom.Doublage.temporize, Anim.Dom.Doublage), duree)
    }
    else
    {
      // Fin du doublage 
      this.on = false
      if(this.temporize.poursuivre) this.temporize.poursuivre()
    }
  }

}