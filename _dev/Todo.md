# Fonctionnalités à créer

* Pouvoir régler l'armure

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