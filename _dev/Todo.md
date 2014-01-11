* Gestion des notes conjointes
  > Dans Staff, mémoriser les notes en fonction de l'offset courant :
  Staff.notes = {
    <offset> : [<liste des notes>]
  }
  > Au moment de placer une note (real_left ?), on regarde si une note
  conjointe se trouve déjà à cet endroit-là (seulement en dessous). Si c'est
  le cas, on la pousse vers la droite de la taille de la note (-> prefs.note_size)
  > Si une note conjointe se trouve au-dessus, c'est la note au-dessus qu'on
  repositionne.
  
* Poursuivre les essais avec le premier prélude
  > pour les harmonies et cadences, détecter les nombres et les
    mettre en plus petit (vérifier s'ils sont suivis de "e" comme dans "7e")

* Documenter la façon de récupérer un texte d'une note (ou autre, mais le système n'est implémenté que pour les notes pour le moment)
    <note>.texte[<cle>] où <cle> peut être 'regular', 'harmony', 'chord_mark'


-# Voir ce qui se passe mal en MODE_FLASH sur le premier prélude
    

