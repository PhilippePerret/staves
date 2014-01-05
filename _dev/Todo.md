# Fonctionnalités à créer

* Plutôt que d'utiliser le 'top' de la staff, définir un 'zero' qui sera
  utilisé pour position la note. De cette manière, les notes se placement
  automatiquement au bon endroit
* Pour que les portées soient parfaitement placées (écart de 6 pixels), faire
  une seule ligne et composer la portée avec cinq lignes
  
* ->  lignes supplémentaires (noter qu'elles ne doivent pas être associées à 
      des notes, même si la création d'une note les invoque). Si elles étaient
      associées, cela produirait leur déplacement en même temps que la note…
    
* Pouvoir régler l'armure
* Dans NOTE_TO_OFFSET, il faudrait mettre en fait un array avec en première
  valeur le décalage sur une clé de sol et en deuxième valeur le décalage sur
  une clé de fas
* Pouvoir définir le nombre de portées
* Pouvoir définir avec ou sans rythme
* Pouvoir régler la vitesse de l'animation
  > Par défaut, chaque ligne correspond à un "beat", par exemple une seconde si
  le tempo est réglé sur 60.
* Un console pour entrer le code de l'animation, qui devra se construire avec
  des codes très simples comme&nbsp;:
  - `c4 -> d4` Signifie que le do monte au ré (idem avec `<-` en descendant)
  - Pouvoir définir les notes de départ (un accord, des notes seules)
  - `<c4` signifie qu'il faut faire apparaitre le do progressivement (mais
  est-ce que ça ne sera pas le cas de toutes les notes&nbsp;?) (`c4>` pour disparaitre)
  ? Comment marquer la différence entre des évènements qui ont lieu en même temps
  ou pas => puisque chaque ligne est un beat, tous les éléments sur la même ligne
  doivent se dérouler en même temps.
  ? Comment gérer cette fausse synchronicité ?
  

### Fonctionnalités optionnelles

* Pouvoir définir la métrique (simplement un menu sur la portée)