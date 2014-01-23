/**
  * @module Anim_File
  */

/**
  * @class Anim.File
  * @static
  */
if(undefined == window.Anim) window.Anim = {}
window.Anim.File = {
  /**
    * Nom de l'animation (ie l'affixe de son fichier de code)
    * @property {String|Null} name
    */
  name: null,
  /**
    * Dossier de l'animation
    * @property {String} folder
    * @default ""
    */
  folder: "",
  /**
    * Méthode définissant le nom de l'animation (du champ save_as) et
    * l'enregistrant quand c'est une NOUVELLE animation
    * @method set_name_and_save
    */
  set_name_and_save:function()
  {
    var dname = this.get_new_name() ;
    if(!dname) return
    Anim.set_anim(dname[1], dname[0])
    UI.add_new_animation_to_menu(this.name)
    this.save()
  },
  /**
    * Enregistre l'animation courante
    * @method save
    * @async
    * @param  {Object} rajax  Le retour ajax au retour de la requête
    */
  save:function(rajax)
  {
    if(undefined == rajax)
    {
      if(!this.name)
      {
        return UI.Tools.show('save_as', {ok:{name:"Enregistrer", method:$.proxy(this.set_name_and_save, this)}})
      }
      Ajax.send({
        script :'animation/save',
        name   :this.name,
        folder :this.folder,
        code   :Console.raw
      }, $.proxy(this.save, this))
    }
    else
    {
      if(rajax.ok)
      {
        F.show("“"+this.name + "” enregistré.")
        this.modified = false
      } 
      else F.error(rajax.message)
    }
  },
  /**
    * Prend le nom de l'animation dans le champ save_as, le corrige
    * et le renvoie.
    * @method get_new_name
    * @return {Array} contenant [folder, nom] ou FALSE en cas de problème
    */
  get_new_name:function()
  {
    var name, dname, fold ;
    name = $('input#animation_name').val().trim()
    dname = name.split('/')
    name = dname.pop()
    fold = dname.join('/')
    name = Texte.to_ascii(name).
                replace(/ /g,'_').
                replace(/[^a-zA-z0-9_-]/g,'').
                substring(0, 60)
    if(name == "") return F.error("Il faut donner un nom (valide) !")
    else return [fold, name]
  },
  /**
    * Enregistre l'animation sous un autre nom
    * @method save_as
    * @param {Object} rajax retour de la requête ajax
    */
  save_as:function(new_name_ok, rajax)
  {
    if(undefined == rajax)
    {
      if(undefined == new_name_ok)
      {
        return UI.Tools.show('save_as', {ok:{name:"Enregistrer", method:$.proxy(this.save_as, this, true)}})
      }
      // On prend le nouveau titre et on le corrige
      var dname = this.get_new_name() ;
      if(!dname) return
      Ajax.send({
        script:"animation/save", 
        name      : dname[0],
        folder    : dname[1],
        code      : Console.raw
      }, $.proxy(this.save_as, this, true))
    }
    else
    {
      if(rajax.ok)
      {
        UI.add_new_animation_to_menu(rajax.name, rajax.path)
        Anim.set_anim(rajax.name, rajax.folder)
        this.modified = false
      }
      else F.error(rajax.message)
    }
  },
  
  /**
    * Recharge l'animation courante (utile quand on la code dans un fichier)
    * @method reload
    */
  reload:function()
  {
    this.load(this.name)
  },
  /**
    * Charge l'animation de nom +name+
    * Si une méthode `this.load.poursuivre` est définie, on la joue en fin
    * de chargement (c'est par exemple ce que fait la commande LOAD_ANIM pour
    * lancer l'animation suivante).
    * @method load
    * @async
    * @param  {String} name     Nom de l'animation (choisie dans le menu)
    * @param  {String} folder   Dossier (relatif depuis `anim`) de l'animation
    * @param  {Object} rajax    Le retour de la requête
    */
  load:function(name, folder, rajax)
  {
    if(undefined == rajax)
    {
      if(name == null) name = $('select#animations').val()
      Ajax.send({script:"animation/load", name:name, folder:folder}, $.proxy(this.load, this, name, folder))
    }
    else
    {
      if(rajax.ok)
      {
        
        // C'est ici qu'on détermine si l'animation chargée est la suite
        // d'une animation précédente.
        Anim.isSuite = (true == Anim.hasSuite)
        
        delete Anim.animation_pour_suivre
        Anim.hasSuite = false
        Anim.set_anim(name, folder, rajax.raw_code)
        this.modified = false
        UI.Popups.unableIf('def_anim', rajax.is_default_anim)
        if('function' == typeof this.load.poursuivre) this.load.poursuivre()
      }
      else F.error(rajax.message)
    }
  },
  
  /**
    * Charge la liste des animations et peuple le menu
    *
    * @method load_list_animations
    * @param  {Object} rajax  Le retour ajax
    */
  load_list_animations:function(folder, rajax)
  {
    if(undefined == rajax)
    {
      if(undefined == folder) folder = ""
      Ajax.send({script:"animation/list", folder:folder}, $.proxy(this.load_list_animations, this, folder))
    }
    else
    {
      if(rajax.ok)
      {
        UI.peuple_liste_animations(rajax.list, folder)
        // Y a-t-il une animation par défaut
        if(rajax.default_animation)
        {
          Anim.set_anim(rajax.default_animation.name, rajax.default_animation.folder, rajax.raw_code)
          UI.Popups.unableIf('def_anim', true)
          this.modified = false
        }
        if(this.load_list_animations.poursuivre) this.load_list_animations.poursuivre()
      }
      else F.error(rajax.message)
    }
  }
  
}

Object.defineProperties(Anim.File,{
  /**
    * Gère la propriété 'modified' de l'animation
    * Propriété complexe pour pouvoir faire suivre le menu "Enregistrer"
    *
    * @property {Boolean} modified
    */
  "modified":{
    set:function(mod)
    {
      this._modified = mod
      UI.Popups.enableIf('save', mod)
    },
    get:function(){return this._modified}
  }
})