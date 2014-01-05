# Application Staves

Cette application permet de faire des animations autour des notes de musique, à fin pédagogique.

<a name="designation_notes"></a>
##Désignation des notes

Les notes doivent être désignées par :

    <nom note><altération><octave>

* On désigne le `nom des notes` par une seule lettre, anglaise, de "a" (la) à "g" (sol).
* L'altération est soit rien (note naturelle), soit "b" pour bémol soit "d" (ou "#") pour dièse.
* Vient ensuite l'octave, un nombre, négatif si nécessaire.

###Constantes notes

De l'octave 0 (qui n'existe pas en français) à l'octave 7 il existe des constantes pour chaque note avec l'altération bémol ("b") et dièze ("d").

Les deux formules suivantes sont donc possible :

no=NOTE(ad5)
no=NOTE('ad5')

##Création d'une animation

##Création d'une note

<variable name>=NOTE(<note>)
  
La `<note>` peut être soit un string soit une constante (cf. [Désignation des notes](#designation_notes))

* Une séquence ne doit pas comporter d'espaces, sauf dans un texte.  