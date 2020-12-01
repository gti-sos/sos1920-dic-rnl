<script>

    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

</script>

<main>

    <h2>Trabajo de Diciembre</h2>
    <p></p>
    <h7>Mi nombre es Rubén Navarro López y esta es mi API realizada como trabajo para la asignatura SOS en el año 2020.
    </h7>
    <p></p>
    <h3>Video de la API: Mercados</h3>
    <li><a href="https://youtu.be/Sfa_tt1mhAk" rel="nofollow">Video Presentación API SOS1920-DIC-RNL</a></li>
    <p></p>
    <h5>Para entrar a mi repositorio de github haz click <a href="https://github.com/Jolaru21">aqui</a></h5>
    <p></p>
    <button type="button" onclick="window.location.href='#/'"> ATRAS</button>
</main>

<style>
    main {
        font-weight: bold;
        text-align: center;
    }


    a.button {
        -webkit-appearance: button;
        -moz-appearance: button;
        appearance: button;
        font-weight: bold;
        text-decoration: none;
        color: initial;
    }
</style>