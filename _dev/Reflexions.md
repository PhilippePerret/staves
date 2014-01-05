# Déplacement courbe

On veut déplacer une note de y1=100 à y2=50 avec x = 10

distance = y2 - y1 = 50
point culminant = distance / 2 = 25
Au point culminant, x doit être à 40 (+30)

Donc la note doit passer de :

x:10 y:100
x:40 y:75
x:10 y:50

Donc x a 25 px pour passer de 10 à 40
Puis 25px pour passer de 40 à 10

Si je l'augmente de 1, 2, 3, 4 etc. tandis que y augment de 1 seulement

x + 1 (11) / y - 1 (99)
x + 2 (13) / y - 1 (98)
x + 3 (16) / y - 1 (97)
x + 

Je fais augmenter x jusqu'à atteindre la position voulue (en mémorisant le nombre de pas qu'il lui a fallu)

var ix = dep_x
var inc_x = 0
var i_inc = 0 // nombre d'incréments pour atteindre max_x
for(var iy=dep_y; iy <= fin_y; ++iy )
{
  if(ix < fin_x){
    ix += ++ inc_x
    ++ i_inc
  }
  
  // Il faut commencer à ramener x
  if(fin_y - i_inc < iy)
  {
    ix -= -- inc_x
  }
}
