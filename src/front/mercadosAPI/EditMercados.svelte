<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";


    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";


    export let params = {};
    let mercado = {};
    let updatedRegion = "XXXX";
    let updatedCountry = "XXXX";
    let updatedPopulation = 1111.1;
    let updatedInternet_pop = 1111.1;
    let updatedRevenues = 1111.1;
    let errorMsg = "";

    onMount(getMercados);

    async function getMercados() {

        console.log("Fetching mercados...");
        const res = await fetch("/api/v1/mercados/" + params.Region + "/" + params.Country);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            mercado = json;
            updatedRegion = mercado.Region;
            updatedCountry = mercado.Country;
            updatedPopulation = mercado.Population;
            updatedInternet_pop = mercado.Internet_pop;
            updatedRevenues = mercado.Revenues;
            console.log("Received mercados.");
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }


    async function updateMercado() {

        console.log("Updating mercados..." + JSON.stringify(params.Region));

        const res = await fetch("/api/v1/mercados/" + params.Region + "/" + params.Country, {
            method: "PUT",
            body: JSON.stringify({
                Region: params.Region,
                Country: params.Country,
                Population: updatedPopulation,
                Internet_pop: updatedInternet_pop,
                Revenues: updatedRevenues
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getMercados();
            if (res.ok) {
                responseAlert("Los datos de " + params.Region + " en el pais " + params.Country + " han sido actualizados correctamente")
            } else if (res.status == 404) {
                errorAlert("Se ha intentado borrar un elemento inexistente.");
            }

        });
    }



    function responseAlert(msg) {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "text-align:center; position: fixed; margin-left:650px; color:black;border-width:3px; border-color:green; top: 50px; top: 30%; width: 30%;";
        alert_element.className = "alert alert-dismissible in alert-success";
        alert_element.innerHTML = "<strong>¡Exito!</strong> " + msg;

        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function responseWarning(msg) {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "text-align:center; position: fixed; margin-left:650px; color:black; border-width:3px;border-color:black; top: 50px; top: 30%; width: 30%;";
        alert_element.className = "alert alert-dismissible in alert-success";
        alert_element.style.backgroundColor = "yellow";
        alert_element.innerHTML = "<strong>¡Cuidado!</strong> " + msg;

        setTimeout(() => {
            clearAlert();
        }, 3000);
    }
    function responseError(msg) {
        clearAlert();
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "text-align:center; position: fixed; margin-left:650px; color:white; border-width:3px; border-color:black; top: 50px; top: 30%; width: 30%;";
        alert_element.className = "alert alert-dismissible in alert-success";
        alert_element.style.backgroundColor = "red";
        alert_element.innerHTML = " " + msg;

        setTimeout(() => {
            clearAlert();
        }, 3000);
    }


    function clearAlert() {
        var alert_element = document.getElementById("div_alert");
        alert_element.style = "display: none; ";
        alert_element.className = "alert alert-dismissible in";
        alert_element.innerHTML = "";
    }


    function errorResponse(res, msg) {
        var status = res.status
        switch (status) {
            case 400:
                responseError("Codigo de error: " + status + '\n' + ".Los datos introduccidos no son validos");
                break;
            case 401:
                responseError("Codigo de error: " + status + '\n' + ".No tiene permisos para realizar esta accion");
                break;
            case 404:
                responseError("Codigo de error: " + status + '\n' + ".Página no encontrada");
                break;
            case 405:
                responseError("Codigo de error: " + status + '\n' + ".Metodo no permitido");
                break;
            case 409:
                responseError("Codigo de error: " + status + '\n' + ".Conflicto con la operacion");
                break;
            case 420:
                responseError("Codigo de error: " + status + '\n' + ".Región y País ya existentes, editelo o cambie de país.");
                break;

            default:
                if (status != 420 && status != 400 && status != 401 && status != 404 && status != 405 && status != 409 && status != 200 && status != 2001) {
                    responseError("Codigo de error: " + status + '\n' + ".Error de desconocido por el sistema")
                    break;

                } else {
                    break;
                }

        }
    }

</script>
<main style= "font-weight: bold;">

    <div role="alert" id="div_alert" style="display: none;">
    </div>
    <h3>Editar Mercados <strong>{mercado.Region} {mercado.Country}</strong></h3>
    {#await mercado}
        Loading mercado...
    {:then mercado}
        <Table bordered style = "border: black 2px solid;" >
            <thead>
                <tr>
                    <th>Region</th>
					<th>Pais</th>
					<th>Poblacion</th>
					<th>Usuarios de internet</th>
					<th>Ingresos (M(€))</th>
					<th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedRegion}</td>
                    <td>{updatedCountry}</td>
                    <td><input type="number" bind:value="{updatedPopulation}"></td>
                    <td><input type="number" bind:value="{updatedInternet_pop}"></td>
                    <td><input type="number" bind:value="{updatedRevenues}"></td>
                    <td> <Button outline  style= "font-weight: bold;" color="primary" on:click={updateMercado}> <i class="fas fa-pencil-alt"> <i class="fas fa-pencil-alt"> </i> Actualizar</Button> </td>
                </tr>
        </tbody>
        </Table>
    {/await}
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    <Button outline  style= "font-weight: bold;" color="secondary" on:click="{pop}">Atras</Button>
</main>

<style>
main Table thead tr th{
    border: 1px solid #000;
}
tr{
    border: 1px solid #000;
}
td{
    border: 1px solid #000;
}

</style>