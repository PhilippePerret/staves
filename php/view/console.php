<?php
  
?>
<section id="section_console">
  <textarea id="console"></textarea>
  <div class="buttons">
    <div id="current_step" class="fleft"></div>
    <input type="checkbox" id="cb_mode_pas_a_pas" onclick="$.proxy(Anim.def_mode_pas_a_pas, Anim, this.checked)()" />
    <label for="cb_mode_pas_a_pas">Mode pas à pas</label>
    <input id="btn_anim_start" type="button" value="&nbsp;>&nbsp;" onclick="$.proxy(Anim.start,Anim)()" />
  </div>
</section>