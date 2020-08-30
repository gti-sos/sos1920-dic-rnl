<script>
    import Button from "sveltestrap/src/Button.svelte";
    import { pop } from "svelte-spa-router";

    const URL_BASE = "api/v1/mercados";

    async function loadGraph() {

        const resData = await fetch(URL_BASE);
        let MyData = await resData.json();

        let regions = Array.from(MyData.map((d) => { return d.Region + " " + d.Country; }));
        let population = Array.from(MyData.map((d) => { return parseFloat(d.Population); }));
        let internet_pop = Array.from(MyData.map((d) => { return parseFloat(d.Internet_pop); }));
        let revenues = Array.from(MyData.map((d) => { return parseFloat(d.Revenues); }));


        const url = "/api/v2/crime-rate-stats/";
        console.log("fetch a " + url);
        const resData_1 = await fetch(url);
        let MyData_1 = await resData_1.json();
        let cr = Array.from(new Set(MyData_1.map((d) => { return parseInt(d.cr_rate); })));
        console.log("Datos grupo 11:");
        let tamaño = MyData.length;
        let c= cr.slice(0,parseInt(tamaño));
        console.log(c);


        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Tasa de Crimenes'
            },
            xAxis: {
                categories: regions
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Valores"
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Ingresos',
                data: revenues

            }, {
                name: 'Tasa de crimenes',
                data: c
            }]
        });

    }




</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" defer></script>
    <script src="https://code.highcharts.com/modules/series-label.js" defer></script>
    <script src="https://code.highcharts.com/modules/exporting.js" defer></script>
    <script src="https://code.highcharts.com/modules/export-data.js" defer></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}" defer></script>
</svelte:head>

<main>
    <h2>Integraciones con la API del grupo 11 mezclados con mi API. </h2>
    <h5>Los datos no guardan relación alguna. </h5>
    <button type="button" onclick="window.location.href='#/'"> ATRAS</button>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Se muestran los datos de la API del grupo 11.
        </p>
    </figure>
    <button type="button" onclick="window.location.href='#/'"> ATRAS</button>



</main>


<style>
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    #container {
        height: 400px;
    }

    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #EBEBEB;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }

    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }

    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }

    .highcharts-data-table td,
    .highcharts-data-table th,
    .highcharts-data-table caption {
        padding: 0.5em;
    }

    .highcharts-data-table thead tr,
    .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }

    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }

    main {
        font-weight: bold;
    }
</style>