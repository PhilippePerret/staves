/**
  * @module ImageTool.js
  */

/**
  * Objet pour la gestion des images.
  * Principalement, il doit permettre de définir, dans une image comme une partition
  * par exemple, la portion à afficher (en utilisant l'image en background d'un div
  * et en jouant sur le positionnement, ou simplement en utilisant des left/top
  * appropriés — négatifs — et des overflow hidden ?)
  * @class ImageTool
  * @static
  */
window.ImageTool = {
  /**
    * Instance de l'image éditée
    * @property {Img} current
    */
  current:null,

  /**
    * Données de l'image en cours d'édition
    * Note : L'objet est renseigné en début de processus par les 
    * méthodes `this.set_data_image` et `this.get_taille_image`
    * @property {Object} data_image
    * @default NULL
    */
  data_image:null,
  
  /**
    * Méthode qui définit les données de base de l'image
    * La méthode renseigne la propriété `this.data_image`
    * Elle calcule aussi le rapport de l'image (hauteur par largeur)
    * @method set_data_image
    */
  set_data_image:function()
  {
    this.data_image = {
      inner_x  : this.current.inner_x, // recadrage horizontal
      inner_y  : this.current.inner_y, // recadrage vertical
      cadre_width     : this.current.cadre_width,
      cadre_height    : this.current.cadre_height,
      src             : this.current.url,
      rapport         : parseFloat(this.current.abs_image.rapport)
    }
  },
  /**
    * Définit la taille de l'image (éditée) à l'écran
    * La méthode renseigne l'objet this.data_image
    * @method get_taille_image
    */
  get_taille_image:function()
  {
    $.extend(this.data_image,{
      width_init      : this.image.width(),
      width           : this.image.width(),
      height_init     : this.image.height(),
      height          : this.image.height(),
    })
  },
  /**
    * == Main ==
    *
    * Mise en édition de l'image de source +src+
    * 
    * @method edit
    * @param {String} image     Instance de l'image éditée
    * @param {Object} params    Paramètres optionnels
    */
  edit:function(image, params)
  {
    this.current = image
    this.set_data_image()
    if(this.gabarit.length == 0) this.prepare()
    else
    {
      this.gabarit.show()
      this.image.replaceWith(this.html_image)
      this.set_cadre_properties()
    } 
    this.get_taille_image()
    this.box_feedback.val('')
    this.box_feedback_alt.val('')
    this.box_feedback_zoom.val('')
  },
  
  end_edit:function()
  {
    this.gabarit.hide()
  },
  
  /**
    * Définit le code pour obtenir le réglage courant
    * La méthode donne le code à utiliser dans l'animation
    * @method params_image
    */
  params_image:function()
  {
    // Rappel : l'image est placée à 10px * 10px des bords
    // Il faut prendre la position du recadrage
    this.calcul_recadrage()
    var code = '{'+
              'url:\''    +this.data_image.src+'\', '+
              'x:'        +this.current.x+', '+
              'y:'        +this.current.y+', '+
              'width:'    +this.data_image.width+', '+
              'height:'   +this.data_image.height+', '+
              'inner_x:'  +this.data_image.inner_x+', '+
              'inner_y:'  +this.data_image.inner_y+', '+
              'cadre_width:'    +this.data_image.cadre_width+', '+
              'cadre_height:'   +this.data_image.cadre_height +
            '}'
    this.box_feedback.val(code)
    
    code = [];
    if(this.current.inner_x != this.data_image.inner_x)
      code.push('x:' +this.data_image.inner_x);
    if(this.current.inner_y != this.data_image.inner_y)
      code.push('y:' +this.data_image.inner_y) ;
    if(this.current.cadre_width != this.data_image.cadre_width)
      code.push('width:'+this.data_image.cadre_width);
    if(this.current.cadre_height != this.data_image.cadre_height)
      code.push('height:'+this.data_image.cadre_height);
    code = '{'+code.join(', ')+'}'
    this.box_feedback_alt.val(code)
    
    code = []
    var code_zoom = '{'+code.join(', ')+'}'
    this.box_feedback_zoom.val(code_zoom)
  },
  /**
    * Méthode qui calcule le recadrage de l'image en fonction de la position
    * du cadre rouge.
    * Elle renseigne les propriétés `offset_x` et `offset_y` de `data_image`
    * @method calcul_recadrage
    */
  calcul_recadrage:function()
  {
    var pos = this.box_cadre.position()
    this.data_image.inner_x = pos.left - 10 // car image placée à 10px
    this.data_image.inner_y = pos.top  - 10 // car image placée à 10px
    this.data_image.cadre_width   = this.box_cadre.width()
    this.data_image.cadre_height  = this.box_cadre.height()
  },
  /**
    * Diminuer proportionnellement la taille de l'image
    * @method image_smaller
    * @param {Event} evt Evènement (pour savoir si des modifiers sont pressés)
    */
  image_smaller:function(evt)
  {
    // Valeur de l'incrément en fonction des modifiers pressés
    var inc = this.increment_per_modifiers(evt)
    this.data_image.width  -= inc
    this.data_image.height = this.data_image.width * this.data_image.rapport
    this.set_image_properties()
  },
  /**
    * Augmenter proportionnellement la taille de l'image
    * @method image_bigger
    * @param {Event} evt Evènement (pour savoir si des modifiers sont pressés)
    */
  image_bigger:function(evt)
  {
    // Valeur de l'incrément en fonction des modifiers pressés
    var inc = this.increment_per_modifiers(evt)
    this.data_image.width  += inc
    this.data_image.height = this.data_image.width * this.data_image.rapport
    this.set_image_properties()
  },
  
  /**
    * Retourne la valeur de l'incrément en fonction des modifiers pressés.
    *   CMD divise par 2
    *   ALT divise par 2 (donc si CMD + ALT => division par 4)
    *   CTRL => inc = 1
    *   MAJ multiplie par 10
    *       Donc CMD + MAJ => inc = 50, CMD + ALT + MAJ => inc = 25
    * @method increment_per_modifiers
    * @param {Event} evt L'évènement envoyé
    * @return {Number} La valeur toujours positive de l'incrément
    */
  increment_per_modifiers:function(evt)
  {
    var inc = 10
    if (evt.ctrlKey)   inc = 1
    if (evt.shiftKey)  inc = inc * 10
    if (evt.metaKey)   inc = parseInt(inc / 2)
    if (evt.altKey)    inc = parseInt(inc / 2)
    if( inc <= 0 ) inc = 1
    return inc
  },
  
  /**
    * Définit les propriétés du cadrage (sa position et sa taille)  
    * @method set_cadre_properties
    */
  set_cadre_properties:function()
  {
    this.box_cadre.css({
      width   :this.data_image.cadre_width+'px',
      height  :this.data_image.cadre_height+'px',
      top     :(this.data_image.inner_y+10)+'px',
      left    :(this.data_image.inner_x+10)+'px'
    })
  },
  /**
    * Redéfinit les propriétés de l'image éditée à l'affichage
    * @method set_image_properties
    */
  set_image_properties:function()
  {
    this.image.css({
      width   :this.data_image.width+'px',
      height  :this.data_image.height+'px'
    })
  },
  /**
    * Prépare les éléments DOM des outils image
    * @method prepare
    */
  prepare:function()
  {
    $('body').append('<div id="imgtool_gabarit"></div>')
    this.gabarit.append(this.html_code_boutons)
    this.gabarit.append(this.html_image)
    this.gabarit.append(this.html_cadre)
    this.set_cadre_properties()
    $('div#in_recadrage').bind('mousedown',function(){$('div#recadrage').draggable()})
    $('div#in_recadrage').bind('mouseup',function(){$('div#recadrage').draggable("destroy")})
  }
}
Object.defineProperties(ImageTool,{
  
  /**
    * Objet DOM du gabarit général
    * @property {jQuerySet} gabarit
    */
  "gabarit":{
    get:function(){return $('div#imgtool_gabarit')}
  },
  /**
    * Objet DOM de la boite de recadrage
    * @property {jQuerySet} box_cadre
    */
  "box_cadre":{
    get:function(){return $('div#recadrage')}
  },
  /**
    * Objet DOM de l'image éditée
    * @property {jQuerySet} image
    */
  "image":{
    get:function(){return $('img#imgtool_image')}
  },
  /**
    * Objet DOM du textarea pour placer le code à copier-coller
    * @property {jQuerySet} box_feedback
    */
  "box_feedback":{get:function(){return $('textarea#imgtool_feedback')}},
  /**
    * Objet DOM du textarea pour placer les paramètres travelling
    * @property {jQuerySet} box_feedback_alt
    */
  "box_feedback_alt":{get:function(){return $('textarea#imgtool_feedback_alt')}},
  /**
    * DOM Object du textarea pour placer les paramètres zoom
    * @property {jQuerySet} box_feedback_zoom
    */
  "box_feedback_zoom":{get:function(){return $('textarea#imgtool_feedback_zoom')}},
  
  /**
    * Code HTML pour l'image
    * @property {HTMLString} html_image
    */
  "html_image":{
    get:function(){
      var style = [], cur = this.current
      if(cur.width)   style.push('width:'+cur.width+'px')
      if(cur.height)  style.push('height:'+cur.height+'px')
      return '<img id="imgtool_image" src="'+cur.url+'" style="'+style.join(';')+'" />'
    }
  },
  /**
    * Code HTML pour le div du cadre
    * Note :  Aucun réglage de taille ou de position n'est effectué ici,
    *         c'est la méthode `set_cadre_properties` qui s'en charge
    * @property {HTMLString} html_cadre
    */
  "html_cadre":{
    get:function(){
      return '<div id="recadrage"><div id="in_recadrage"></div></div>'
    }
  },
  /**
    * Code HTML pour les boutons
    * @property {String} html_code_boutons
    */
  "html_code_boutons":{
    get:function(){
      return  '<div class="buttons">'+
                '<fieldset><legend>Taille image</legend>' +
                  '<input type="button" value=" + " onclick="$.proxy(ImageTool.image_bigger, ImageTool, event)()" />'+
                  '<input type="button" value=" - " onclick="$.proxy(ImageTool.image_smaller, ImageTool, event)()" />'+
                '</fieldset>'+
                '<div class="tiny">Code à copier-coller dans les paramètres de l\'image</div>'+
                '<textarea id="imgtool_feedback" onfocus="this.select()"></textarea>'+
                '<div class="tiny">Paramètres pour travelling</div>'+
                '<textarea id="imgtool_feedback_alt" onfocus="this.select()"></textarea>'+
                '<div class="tiny">Paramètres pour ZOOM</div>'+
                '<textarea id="imgtool_feedback_zoom" onfocus="this.select()"></textarea>'+
                '<div class="right">'+
                  '<input type="button" value="-> Code" onclick="$.proxy(ImageTool.params_image, ImageTool)()" />'+
                  '<input type="button" value="OK" onclick="$.proxy(ImageTool.end_edit, ImageTool)()" />'+
                '</div>'+
              '</div>'
      
    }
  }
  
})