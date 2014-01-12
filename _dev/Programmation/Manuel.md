#Manuel pour la programmation de l'application

Note : il y a 22 pixels entre le 'left' d'une note et le centre de son affichage
Utiliser la méthode <note>.centre pour obtenir le vrai left

* [Affichage de tout objet animation](#show_objet_animation)
* [Passage au pas (étape) suivant](#passage_step_suivante)
* [Traitement du code de l'animation](#traitement_code_animation)
* [Portée](#les_portees)

<a name="nomenclature"></a>
##Nomenclature

J'appelle chaque ligne de l'animation un `pas` ou un `step`.

<a name="show_objet_animation"></a>
##Affichage de tout objet animation

C'est la méthode :

    Anim.Dom.show(instance|DOM objet, <parameters>)
  
… qui se charge de l'affichage de tout objet animation.

Où les paramètres peuvent contenir la propriété `complete` qui définira la fonction pour suivre. 

Par défaut, cette fonction pour suivre est `NEXT_STEP` pour passer à l'étape suivante.

<a name="passage_step_suivante"></a>
##Passage au pas suivant

Pour passer à l'étape suivante (`Anim.Step.next`), on peut utiliser le raccourci :

    NEXT_STEP()

Mais dans beaucoup de cas, un `objet` animé est constitué de plusieurs éléments, comme la note, qui peut avoir une altération et des lignes supplémentaires.

Dans ce cas, on se sert de la propriété `complete` dans les paramètres qu'on envoie à `Anim.Dom.show`

Par exemple, pour une note, on TROUVAIT AVANT cette enchaînement&nbsp;:

    <note> appelle la méthode Anim.Dom.add pour s'ajouter à l'animation
    Anim.Dom.add appelle la méthode <note>.show
    <note>.show appelle <note>.show_note 
      ... qui affiche la note
      ... puis appelle <note>.show_alteration
    <note>.show_alteration
      ... qui affiche l'altération si elle existe
      ... puis appelle <note>.on_complete
    <note>.on_comlete
      ... qui affiche les notes supplémentaires si nécessaires
      ... puis appelle enfin NEXT_STEP pour passer à l'étape suivante
      
*Voir maintenant le nouveau traitement de la note, où tout les éléments sont construits en même temps, et la méthode `<note>.on_complete` regarde si tous les éléments sont construits, et quand c'est le cas, elle passe à l'étape suivante.*

<a name="traitement_code_animation"></a>
##Traitement du code de l'animation



Tous les codes utilisateur de l'animation sont évalués avec le code :

    this.Objects.<code séquence>
  
*(où `this` est l'objet `Anim`)*

Par exemple, si le code est :

    maNote=NOTE(a3)

… alors le code évalué sera :

    this.Objects.maNote = <instance note>
  
C'est la raison pour laquelle l'objet Anim.Objects contient des méthodes comme&nbsp;:

    WAIT(...)

Car le code séquence :

    WAIT(4)

… sera interprété

    this.Objects.WAIT(4)

## Définir l'appel à la séquence suivante

Quelque soit la situation, il faut que le résultat de la séquence appelle la méthode `Anim.Step.next()` pour pouvoir passer à la suite.

Si un délai est nécessaire, au lieu d'appeler directement `Anim.Step.next`, on peut appeler `Anim.wait` (qui est un raccourci de `Anim.Objects.WAIT`).

Par exemple, quand on crée une note, la fin de la fonction `NOTE` appelle&nbsp;:

    Anim.wait(1)

… car si elle appelait tout de suite la méthode `Anim.Step.next` une erreur serait produite puisque la fonction n'aurait pas encore renvoyé l'instance créée (en d'autres termes, la séquence ne serait pas encore terminée).

Au lieu de ça on a :

1.Le code maNote=NOTE(a3) est joué (évalué) par Anim.Step.next
2.La méthode NOTE crée l'instance
3.La méthode NOTE appelle `Anim.wait(1)` pour attendre 1 seconde
4.Pendant ce temps, Anim.Step.next reçoit l'instance note et la met dans `maNote` (en réalité dans `Anim.Objects.maNote`)
5.La méthode `Anim.Step.next` a le temps de se finir
6.La méthode Anim.Objects.WAIT appelle `Anim.Step.next` pour passer à la suite

<a name="les_portees"></a>
##Les portées

Le `top` de la portée correspond exactement au top de la ligne supérieure.
