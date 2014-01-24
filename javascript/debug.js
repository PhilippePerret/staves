/**
  * @module Debug
  *
  * Pour le débuggage en temps réel
  *
  * Chaque fonction devrait commencer par :
  *   stack("-> <nom string de la fonction>"[, <paramètres éventuels>])
  *
  * Pour obtenir le stack (l'afficher en console) :
  *   Debug.output()
  *
  */

/**
  * @class Debug
  * @static
  */
window.Debug = {
  fn_stack:[],
  
  /**
    * Méthode qui enregistre une méthode/fonction dans le stack du programme
    * Utiliser plutôt le raccourci `stack(<fonction name>)`
    * @method add_stack
    * @param  {String} Le nom de la méthode
    * @param  {Object} Les paramètres éventuelles (PAS forcément les arguments)
    */
  add_stack:function(fn_name, fn_params)
  {
    this.fn_stack.push({function:fn_name, params:fn_params})
  },
  
  /**
    * Sort le débug en console
    * @method output
    * @param  {Object} params Les paramètres éventuels
    */
  output:function(params)
  {
    console.log("\n ==== DÉBUG DU STACK ====")
    L(this.fn_stack.reverse()).each(function(stack_obj){
      console.log(stack_obj.function)
      if(stack_obj.params) console.dir(stack_obj.params)
    })
    console.log("\n ==== FIN DU STACK ====")
  }
  
}

/**
  * Raccourci pour `Debug.add_stack`, enregistre une méthode
  * @method stack
  * @for window
  */
window.stack = function(fn,param){Debug.add_stack(fn,param)}