<script>

import Button from "sveltestrap/src/Button.svelte";
import  {pop} from "svelte-spa-router";

</script>

<main>
	
    <h2>Trabajo de septiembre</h2>
    <p></p>
    <h7>Mi nombre es Rubén Navarro López y esta es mi API realizada como trabajo para la asignatura SOS en el año 2020.</h7>
    <p></p>
    <h3>Video de la API: Mercados</h3>
    <li><a href="https://youtube.com" rel="nofollow">https://youtube.com</a> (Para entrar a mi repositorio de github haz click <a href="https://github.com/Jolaru21"></a>aqui)</li>
    <p></p>
    <Button outline  style= "font-weight: bold;" color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>

<style>
main{
    font-weight: bold;
}
</style>