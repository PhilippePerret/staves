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
    * Exporter les doublages dans un fichier
    * En fait, tout se passe en ruby, c'est une simple requête qui est envoyée
    * @method export_doublage
    */
  export_doublage:function(rajax)
  {
    if(undefined == rajax)
    {
      F.show("Création du fichier doublage. Merci de patienter…")
      Ajax.send(
        {script:'export/doublage', name:Anim.File.name, folder:Anim.File.folder},
        $.proxy(this.export_doublage, this)
      )
    }
    else
    {
      // Retour de la requête ajax
      if(false == rajax.ok) F.error(rajax.message)
      else
      {
        F.show("Le doublage a été exporté avec succès dans le fichier "+rajax.file)
      }
    }
  },
  /**
    * Exporter les sous-titres dans un fichier
    * La procédure est exécutée en ruby
    * @method export_sous_titres
    */
  export_sous_titres:function()
  {
    F.show("L'export des sous-titres n'est pas encore implémenté.")
  }
  
}