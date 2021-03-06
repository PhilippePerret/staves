<?php
header('Content-Type: text/json'); 

/*------------------------------------------------------------------------

  Script Ajax recevant la requête et appelant le script éponyme ruby
  qui va la traiter.

  @note: se souvenir que pour appeler un fichier PHP par ajax, il faut 
  utiliser url:'http://localhost etc.' (ou l'url on line) et non pas le
  simple nom du script courant.

------------------------------------------------------------------------*/
// Appeler le script ajax ruby
$data = addslashes(json_encode($_POST['data']));
try {
  $returned = exec("./ruby/ajax.rb \"${data}\"");
} catch (Exception $e) {
  $returned = json_encode( array('message' => "ERREUR : $e", 'ok' => false));
}

echo $returned;
?>