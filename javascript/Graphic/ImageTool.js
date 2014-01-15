/**
  * @module ImageTool.js
  */

/**
  * Objet pour la gestion des images importées.
  * Principalement, il doit permettre de définir, dans une image comme une partition
  * par exemple, la portion à afficher (en utilisant l'image en background d'un div
  * et en jouant sur le positionnement, ou simplement en utilisant des left/top
  * appropriés — négatifs — et des overflow hidden ?)
  * @class ImageTool
  * @static
  */
window.ImageTool = {
  /**
    * Source de l'image en cours de traitement
    * @property {String} image_src
    * @default null
    */
  image_src:null,
  
  /**
    * == Main ==
    *
    * Mise en édition de l'image de source +src+
    * 
    * @method edit
    * @param {String} src       Path de l'image
    * @param {Object} params    Paramètres optionnels
    */
  edit:function(src, params)
  {
    this.image_src = src
    if(this.gabarit.length == 0) this.prepare()
    else this.gabarit.show()
  },
  
  end_edit:function()
  {
    this.gabarit.hide()
  },
  
  /**
    * Pour recadrer à partir de la sélection courante
    * @method recadrer
    */
  recadrer:function()
  {
    // Rappel : l'image est placée à 10px * 10px des bords
    // Il faut prendre la position du recadrage
  },
  /**
    * Diminuer la taille de l'image
    * @method image_smaller
    * @param {Event} evt Evènement (pour savoir si des modifiers sont pressés)
    */
  image_smaller:function(evt)
  {
    
  },
  /**
    * Augmenter la taille de l'image
    * @method image_bigger
    * @param {Event} evt Evènement (pour savoir si des modifiers sont pressés)
    */
  image_bigger:function(evt)
  {
    
  },
  /**
    * Prépare les éléments DOM des outils image
    * @method prepare
    */
  prepare:function()
  {
    $('body').append('<div id="imgtool_gabarit"></div>')
    this.gabarit.append(this.html_code_boutons)
    this.gabarit.append('<img id="imgtool_image" src="'+this.image_src+'" />')
    this.gabarit.append('<div id="recadrage"><div id="in_recadrage"></div></div>')
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
    * @property box_cadre
    */
  "box_cadre":{
    get:function(){return $('div#recadrage')}
  },
  
  
  /**
    * Code HTML pour les boutons
    * @property {String} html_code_boutons
    */
  "html_code_boutons":{
    get:function(){
      return  '<div class="buttons">'+
                '<input type="button" value="Renoncer" onclick="$.proxy(ImageTool.end_edit, ImageTool)()" />'+
                '<input type="button" value="Recadrer" onclick="$.proxy(ImageTool.recadrer, ImageTool)()" />'+
                '<input type="button" value="Augmenter" onclick="$.proxy(ImageTool.image_bigger, ImageTool, event)()" />'+
                '<input type="button" value="Diminuer" onclick="$.proxy(ImageTool.image_smaller, ImageTool, event)()" />'+
              '</div>'
      
    }
  }
  
})