<?php
  
?>
<section id="tools">
  
  <select id="animation" onchange="$.proxy(Anim.load, Anim, this.value)()"></select>
  
  <input id="btn_save_anim" type="button" value="Sauver l'animation" onclick="$.proxy(Anim.save, Anim)()" />
  
  <div>
    <input type="button" value="Sauver comme…" onclick="$.proxy(Anim.save_as, Anim)()" />
    <input type="text" id="animation_name" style="width:200px;" onfocus="this.select()" />
    <input type="button" value="Aide" onclick="aide()" />
  </div>
</section>