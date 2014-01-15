<?php
  
?>
<section id="tools">
  
  <select id="animations" onchange="$.proxy(Anim.load, Anim, this.value)()"></select>
  
  <input id="btn_save_anim" type="button" value="Sauver" onclick="$.proxy(Anim.save, Anim)()" />
  <input id="btn_reload_anim" type="button" value="Reload" onclick="$.proxy(Anim.reload, Anim)()" />
  
  <div>
    <input type="button" value="Sauver comme…" onclick="$.proxy(Anim.save_as, Anim)()" />
    <input type="text" id="animation_name" style="width:200px;" onfocus="this.select()" />
    <input type="button" value="MANUEL" onclick="aide()" />
  </div>
</section>

<!-- La règle à mesurer, draggable -->
<div id="regle"></div>