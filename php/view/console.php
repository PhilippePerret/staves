<?php
  
?>
<section id="section_console">
  <textarea id="console"></textarea>
  <div class="buttons">
    <input type="checkbox" id="cb_mode_pas_a_pas" onclick="$.proxy(Anim.def_mode_pas_a_pas, Anim, this.checked)()" />
    <label for="cb_mode_pas_a_pas">Mode pas à pas</label>
    <input id="btn_anim_start" type="button" value="Start" onclick="$.proxy(Anim.start,Anim)()" />
    <div id="current_step" class="left"></div>
  </div>
</section>