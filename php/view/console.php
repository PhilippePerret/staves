<?php
  
?>
<section id="section_console">
  <textarea id="console" TABINDEX="1" onchange="$.proxy(Console.onchange_code, Console)()"></textarea>
  <div id="console_last_step"></div>
  <!-- Juste pour gérer la tabulation -->
  <input type="button" id="nothing" style="opacity:0;" TABINDEX="2"></textarea>
</section>