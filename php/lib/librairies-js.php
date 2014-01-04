<?php
// Chargement des librairies générales

  $libs = array(
    'required'  => array('jquery', 'jquery-ui'),
    'optional'  => array('ajax_php', 'couleur', 'Edit', 'flash', 'L', 'mouse', 'Number', 'selection', 'String-extensions', 'texte', 'time', 'ui_basic', 'utils')
      // @note :  la librairie 'ajax_send' est utile aux tests, mais elle est remplacée
      //          dans l'application par sa propre librairie.
    );
	echo "\n";
  foreach($libs as $dos => $liblist){
    foreach($liblist as $lib){
      echo "\t\t".'<script type="text/javascript" charset="utf-8" src="../lib/javascript/'."$dos/$lib".'.js"></script>'."\n";
    }
  }
  
  traite_dossier('./javascript/required/', 'js');
  traite_dossier('./javascript/', 'js', 'required');

?>