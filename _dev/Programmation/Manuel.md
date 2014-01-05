#Manuel pour la programmation de l'application

Note&nbsp;: J'appelle chaque élément (ligne) de l'animation un `pas` (step).

##Passage au pas suivant

Pour passer à l'étape suivante (`Anim.next_step`), on peut utiliser le raccourci :

NEXT_STEP()

Cette constante peut aussi s'utiliser pour définir une “fonction pour suivre”. Par exemple, dans le déplacement d'une note (`Note::moveTo`), on appelle la méthode `Courbe.move` en lui donnant en paramètre la méthode à appeler quand le déplacement sera terminé. On peut utiliser `NEXT_STEP` pour ça&nbsp;:

    Courbe.move({
      x_dep    : 10,
      x_max    : 30,
      y_dep    : 100,
      y_fin    : 50,
      complete : NEXT_STEP
    })

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

Quelque soit la situation, il faut que le résultat de la séquence appelle la méthode `Anim.next_step()` pour pouvoir passer à la suite.

Si un délai est nécessaire, au lieu d'appeler directement `next_step`, on peut appeler `Anim.wait` (qui est un raccourci de `Anim.Objects.WAIT`).

Par exemple, quand on crée une note, la fin de la fonction `NOTE` appelle&nbsp;:

    Anim.wait(1)

… car si elle appelait tout de suite la méthode `next_step` une erreur serait produite puisque la fonction n'aurait pas encore renvoyé l'instance créée (en d'autres termes, la séquence ne serait pas encore terminée).

Au lieu de ça on a :

1.Le code maNote=NOTE(a3) est joué (évalué) par next_step
2.La méthode NOTE crée l'instance
3.La méthode NOTE appelle `Anim.wait(1)` pour attendre 1 seconde
4.Pendant ce temps, next_step reçoit l'instance note et la met dans `maNote` (en réalité dans `Anim.Objects.maNote`)
5.La méthode `next_step` a le temps de se finir
6.La méthode Anim.Objects.WAIT appelle `Anim.next_step` pour passer à la suite