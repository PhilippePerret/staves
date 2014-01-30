* Poursuivre le travail sur le zoom (complexe)

RÉFLEXION SUR LE ZOOM

Toute la réflexion tourne autour de prendre les valeurs réelles ou prendre les valeurs par rapport à la taille originale. Par exemple, si on veut sélectionner la portion d'image située à la position 4 pixels / 8 pixels pour une dimension de 10 pixels par 20, il existe donc ces quatre valeurs :

inner_x = 4
inner_y = 8
cadre_width = 10
cadre_height = 20

… mais si l'image est grossie deux fois, les vraies valeurs sont :

inner_x = 8
inner_y = 16
cadre_width = 20
cadre_height = 40

Avec lesquelles travailler ?

Les secondes correspondent exactement à ce qu'on voit, et sont plus faciles à gérer pour ImageTools puisque ce sont toujours les pixels qui sont jouées vraiment.

Mais ça pose un problème pour le width et le height du zoom, car ils doivent être calculés en fonction de la taille réelle de l'image et non pas d'un grossissement.

  > Il faut pouvoir obtenir le code du zoom
  
  - Le zoom modifie forcément la taille de l'image (contrairement au travelling)
    Si l'image n'a pas été grossie en édition, c'est la nouvelle taille du cadre
    qui détermine l'ampleur du zoom
    Mais noter que cela doit pouvoir entrainer une modification des dimensions
    du cadre de l'image (si le nouveau cadre n'est pas proportionnel)
  
  - Si `x` est fourni, il définit obligatoirement le nouveau `inner_x`
  - Si `y` est fourni, il définit obligatoirement le nouveau `inner_y`
  - Si `zoom` est fourni, il détermine le grossissement/diminution
  - Si `zoom` n'est pas fourni, ça peut être `width` et/ou `height` qui déterminent
  l'ampleur du zoom, entendu que le width actuel (cadre_witdh) restera inchangé
  (mais ne faut-il pas qu'il y ait la possibilité d'en décider autrement)
  Si `zoom` et `width`et/ou`height` sont fournis, ça pourrait être la marque que
  l'image doit changer de taille (donc zoom avec grossissement de l'image, et width et height détermineraient la nouvelle taille).
  
  
  - Faut-il la possibilité 
  
* Poursuivre l'analyse du Prélude 1

