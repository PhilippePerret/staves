# Application Staves

Cette application permet de faire des animations autour des notes de musique, à fin pédagogique.

* [Animation](#animation)
* [Les notes](#notes)
* [Les accords](#chords)
* [Les portées](#staves)


<a name="animation"></a>
##Création d'une animation

###Table des matières

* [Introduction](#intro_animation)
* [Faire une pause](#pause_animation)
* [Écrire un texte général](#texte_animation)
* ["Nettoyer" l'animation (tout effacer)](#clean_animation)

<a name="intro_animation"></a>
###Introduction

Une animation est composée de `pas` (step). Chaque pas exécute une action. Ces pas se définissent dans la console (ie dans le code) en passant à la ligne. **Chaque ligne représente donc un pas.**

Ces pas peuvent&nbsp;:
* Construire une note (et l'afficher)
* Construire une portée
* Écrire un texte associé à un objet (note, portée, barre, etc.)
* Déplacer un objet quelconque (surtout les notes, les portées ne se déplacent pas)

<a name="pause_animation"></a>
###Faire une pause dans l'animation.

On utilise la méthode `WAIT` pour faire une pause, avec en argument le nombre de secondes (qui peut être un flottant, pour des temps très courts)&nbsp;:

    WAIT(<nombre de secondes>)
  
Par exemple, pour attendre 4 secondes&nbsp;:

    maNote=NOTE(a3)
    WAIT(4)                 // 4 secondes avant de construire l'accord
    monAccord('c3 eb3 g3')
  
*Note&nbsp;: C'est un “pas” comme les autres, donc il doit être mis sur une ligne seule comme toute étape.*

<a name="texte_animation"></a>
###Écrire un texte général

Pour écrire un texte en rapport avec l'animation (en haut à gauche), on utilise la méthode `WRITE`&nbsp;:

WRITE(<le texte à écrire>)
  
  Par exemple&nbsp;:
  
  WRITE("Ce qu'il faut remarquer à ce moment-là.")
  
*Noter que les objets tels que les notes ont également leur propre méthode textuelle, qui permet d'aligner le textes directement à ces notes, accords, etc.*

<a name="clean_animation"></a>
###Nettoyer l'animation

“Nettoyer l'animation” signifie supprimer tous les éléments affiché. On peut ou non demander que les portées restent en place, though.

Le pas à utiliser est :

    CLEAR(<avec les portées>)
  
… `<avec les portées>` est FALSE par défaut, donc il faut ajouter `true` pour effacer aussi les portées&nbsp;:
    
    CLEAR(true) // efface aussi les portées
    
    


---------------------------------------------------------------------
<a name="notes"></a>
##Les Notes

###Table des matières

*[Désignation des notes](#designation_notes)
*[Constantes notes](#constantes_notes)
*[Créer une note](#creation_note)
*[Déplacer une note](#move_note)
*[Détruire d'une note](#note_remove)

<a name="designation_notes"></a>
###Désignation des notes

Les notes doivent être désignées par :

    <nom note><alteration><octave>

* On désigne le `nom des notes` par une seule lettre, anglaise, de "a" (la) à "g" (sol).
* L'altération est soit rien (note naturelle), soit un signe (cf. ci-dessous "b", "d", "x", ou "t").
* Vient ensuite l'octave, un nombre, négatif si nécessaire (*mais pour le moment, on va seulement jusqu'à l'octave 0, les autres ne sont pas gérés*).

####Marque des altérations

La valeur `<alteration>` ci-dessus peut être :
  
* `b` pour bémol
* `t` (comme "ton") pour double bémol
* `d` pour dièse
* `x` pour double-dièse

<a name="constantes_notes"></a>
###Constantes notes

De l'octave 0 (qui n'existe pas en français) à l'octave 7 il existe des constantes pour chaque note avec l'altération bémol ("b") et dièze ("d").

Les deux formules suivantes sont donc possible :

no=NOTE(ad5)
no=NOTE('ad5')

Note: Attention à ne pas donner à une variable note le nom d'une de ces constantes. Par exemple, si on fait :

    a5=NOTE(a5)

Cela génèrera une erreur de constante déjà définie.

On peut utiliser plutôt&nbsp;:

    na5=NOTE(a5)

<a name="creation_note"></a>
###Créer une note

    <variable name>=NOTE(<note>)
  
* `<variable>` peut avoir le nom qu'on veut, HORMIS un nom de constante, comme `a5`.
* La `<note>` peut être soit un string soit une constante (cf. [Désignation des notes](#designation_notes))
* Une telle séquence (un pas) ne doit pas comporter d'espaces.

<a name="move_note"></a>
###Déplacer une note

Pour déplacer une note, on utilise le pas&nbsp;:

    <nom variable note>.moveTo(<nouvelle note>[,<params>])
    
Exemple&nbsp;:

    maNote=NOTE(a4) // crée la note LA 4
    maNote.moveTo(g4) // descend la note vers SOL4

*Ne mettre aucune espace dans ce code.*

*Noter que la note de destination devra vraiment la nouvelle valeur de la note. Si la note "a4" se déplace vers "a3", cette note deviendra "a3" dans ses données.*
<a name="note_remove"></a>
###Détruire d'une note

Pour détruire la note (la supprimer de l'affichage, utiliser :

    <nom variable note>.remove()
  

---------------------------------------------------------------------

<a name="chords"></a>
##Les Accords

###Table des matières
*[Création d'un accord](#chord_creation)
*[Référence aux notes de l'accord](#chord_ref_note)
*[Destruction d'un accord](#chord_remove)

<a name="chord_creation"></a>
###Création d'un accord

On crée un accord avec : 

    monAccord=CHORD('<note1> <note2>... <noteN>')
  
… où chaque note doit correspondre à la définition normale.

Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
   
<a name="chord_ref_note"></a> 
###Référence aux notes de l'accord

On fait appel aux notes de l'accord par :

    <nom accord>[<indice note>]
  
… où `<indice note>` est l'indice 1-start.
  
Par exemple&nbsp;:

    accDom=CHORD('c3 eb3 g3')
    accDom[1].moveTo('c4')
    // Prends la première note (c3) et la déplace en c4.
  
<a name="chord_remove"></a>
###Destruction d'un accord

Pour détruire l'accord, utiliser&nbsp;:

    <nom variable accord>.remove()

<a name="staves"></a>
##Les portées

###Table des matières

*[Créer une portée](#create_staff)
*[Activer une portée](#active_staff)

<a name="create_staff"></a>
###Créer une portée

Pour afficher une portée, utiliser le pas&nbsp;:

    NEW_STAFF(<clé>)

… où `<cle>` peut être `SOL`, `FA`, `UT3`, `UT4`.
  
Par exemple&nbsp;:
  
    NEW_STAFF(SOL)
  
… qui affichera une portée en clé de sol en dessous de la dernière portée.

*Noter que cette portée deviendra la portée active, c'est-à-dire celle où seront placées les objets définis par la suite.*

<a name="active_staff"></a>
###Activer une portée

Activer une portée signifie que tous les pas suivants la viseront. Par exemple, les notes se déposent toujours sur la portée active.

    ACTIVE_STAFF(<indice de la portee>)
  
… où `<indice de la portee>` est son rang dans l'affichage, en partant de 1 et du haut. Donc la portée la plus en haut s'active par :
    
    ACTIVE_STAFF(1)