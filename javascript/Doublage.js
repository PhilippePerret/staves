/**
  * @module Caption.js
  */

/**
  * Objet gérant les doublages, mais hors affichage au cours de l'animation.
  * Le module a été inauguré pour l'export des doublages.
  *
  * @class Caption
  * @static
  */
window.Caption = {
  
  /**
    * Exporter les doublages ou les sous-titres
    * @method export
    */
  export:function(type, rajax)
  {
    if(undefined == rajax)
    {
      F.show("Création du fichier "+type+". Merci de patienter…")
      Ajax.send(
        {script:'export/'+type, name:Anim.File.name, folder:Anim.File.folder},
        $.proxy(this.export, this, type)
      )
    }
    else
    {
      // Retour de la requête ajax
      if(false == rajax.ok) F.error(rajax.message)
      else
      {
        F.show("Le "+type.replace(/_/, '-')+" a été exporté avec succès dans le fichier "+rajax.file)
      }
    }
  }  
}