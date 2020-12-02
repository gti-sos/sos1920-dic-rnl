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
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	let mercados = [];
	let newMercado = {
		Country: "",
		Region: "",
		Population: "",
		Internet_pop: "",
		Revenues: ""
	};

	let countries = [];
	let regions = [];
	let currentCountry = "-";
	let currentRegion = "-";

	let numberOfElements = 0;
	let offset = 0;
	let currentPage = 1;
	let moreData = true;
	let pageButton = true;

	onMount(getMercado);
	onMount(getCountryRegion);

	async function getCountryRegion() {
		const res = await fetch("/api/v1/mercados");

		if (res.ok) {
			const json = await res.json();

			countries = json.map((d) => {
				return d.Country;
			});
			countries = Array.from(new Set(countries));


			regions = json.map((d) => {
				return d.Region;
			});
			regions = Array.from(new Set(regions));

			console.log("Contados " + countries.length + " paises y " + regions.length + " regiones distintos.");

		} else {
			errorResponse(res)
		}
	}

	async function getMercado() {

		console.log("Recibiendo mercados...");
		const res = await fetch("/api/v1/mercados?offset=" + numberOfElements * offset + "&limit=" + numberOfElements);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			mercados = json;
			console.log("Received " + mercados.length + " mercados.");

			if (mercados.length != numberOfElements) {
				moreData = false
			} else {

				const next = await fetch("/api/v1/mercados?offset=" + numberOfElements * (offset + 1) + "&limit=" + numberOfElements);
				console.log("La variable NEXT tiene el estado: " + next.status)
				const jsonNext = await next.json();
				if (jsonNext.length == 0 || next.status == 404) {
					moreData = false;
				}
				else {
					moreData = true;
				}
			}
		}
		else {
			errorResponse(res)
		}
	}

	async function ReloadTable() {
		const res = await fetch("/api/v1/mercados/loadInitialData")
		responseAlert("Se han recuperado los valores iniciales de la tabla de mercados")
		location.reload();
	}

	async function insertMercado() {

		console.log("Inserting mercados..." + JSON.stringify(newMercado));

		if (newMercado.Country == ""
			|| newMercado.Country == null
			|| newMercado.Region == ""
			|| newMercado.Region == null) {

			responseWarning("Se debe incluir el nombre del país y la region obligatoriamente");
		} else {
			const res = await fetch("/api/v1/mercados", {
				method: "POST",
				body: JSON.stringify(newMercado),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
				if (res.ok) {
					getMercado();
					responseAlert("Datos de " + newMercado.Country + " añadidos correctamente")
					location.reload();
				} else {
					errorResponse(res)
				}

			});
		}
	}


	async function deleteMercado(Region, Country) {
		console.log("Deleting mercados..." + JSON.stringify(Region) + + JSON.stringify(Country));

		const res = await fetch("/api/v1/mercados/" + Region + "/" + Country, {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok) {
				getMercado();
				getCountryRegion();
				responseAlert("El país se ha borrado correctamente")
			}
			else {
				errorResponse(res);
			}
		});
	}

	async function deleteMercadoCompleto() {
		console.log("Deleting all mercados data...");
		const res = await fetch("/api/v1/mercados/", {
			method: "DELETE"
		}).then(function (res) {
			if (res.ok) {
				const json = res.json();
				mercados = json;
				responseAlert("Todos los países se han borrado correctamente")
			} else {
				responseError("¡Error, La tabla ya está vacia!");

			}
		});
		location.reload();

	}


	async function search(Region, Country) {
		let offset = 0;
		console.log("Searching data: " + Region + " and " + Country);
		var url = "/api/v1/mercados";

		if (Region != "-" && Country != "-") {
			url = url + "?Region=" + Region + "&Country=" + Country;
		} else if (Region != "-" && Country == "-") {
			url = url + "?Region=" + Region;
		} else if (Region == "-" && Country != "-") {
			url = url + "?Country=" + Country;
		} else if (Region == "-" && Country == "-") {
			url = url + "?";
		}

		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			mercados = json;
			console.log("Received " + mercados.length + " mercados.");
			pageButton = false

			if (Region != "-" && Country != "-") {
				if (mercados.length != 0) {
					responseAlert("Busqueda de " + Region + " en el país " + Country + " realizada correctamente")
				} 

			} else if (Region != "-" && Country == "-") {
				responseAlert("Busqueda de " + Region + " realizada correctamente")
			} else if (Region == "-" && Country == "-") {
				responseAlert("Busqueda de todos los paises realizada correctamente")
			} else if (Region == "-" && Country != "-") {
				responseAlert("Busqueda en el país " + Country + " realizada correctamente")
			}
		}
		else {
				errorResponse(res)
			}
	}
	function addOffset(increment) {
		offset += increment;
		currentPage += increment;
		getMercado();
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

	function errorResponse(res) {
		var status = res.status
		switch (status) {
			case 400:
				responseError("Codigo de error: " + status + '\n' + ".Los datos introducidos no son validos");
				break;
			case 404:
				responseError("Codigo de error: " + status + '\n' +".No se ha encontrado el país en la región seleccionada. Vuelve a intentarlo");
				break;
			case 405:
				responseError("Codigo de error: " + status + '\n' + ".Metodo no permitido");
				break;
			case 420:
				responseError("Codigo de error: " + status + '\n' + ".Región y País ya existentes, editelo o cambie de país.");
				break;

			default:
				if (status != 420 && status != 400  && status != 404 && status != 405) {
					responseError("Codigo de error: " + status + '\n' + ".Error de desconocido por el sistema")
					break;

				} else {
					break;
				}

		}
	}


</script>

<main style="font-weight: bold;">
	<div role="alert" id="div_alert" style="display: none;">
	</div>
	{#await mercados}
		Loading mercados...
	{:then mercados}

		<FormGroup > 
			<Label for="selectRegion"> Búsqueda por Región </Label>
			<Input type="select" name="selectRegion" id="selectRegion" bind:value="{currentRegion}">
				{#each regions as region}
				<option>{region}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>
				
		<FormGroup>
			<Label for="selectCountry"> Busqueda por País </Label>
			<Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
				{#each countries as country}
				<option>{country}</option>
				{/each}
				<option>-</option>
			</Input>
		</FormGroup>

		<Button outline  style= "font-weight: bold;" color="secondary" on:click="{search(currentRegion, currentCountry)}" class="button-search" > <i class="fas fa-search"></i> Buscar </Button>
		
		<h4>Los datos ingresados en la tabla no deben contener espacio. Por ejemplo United States, debería ser United_States</h4>

		<Table bordered class = "borde-tabla">
			<thead> 
				<tr class = "borde-tabla">
					<th class = "borde-tabla" >Región</th>
					<th class = "borde-tabla">Pais</th>
					<th class = "borde-tabla">Población</th>
					<th class = "borde-tabla">Usuarios en internet</th>
					<th class = "borde-tabla">Ingresos (M(€))</th>
					<th class = "borde-tabla">Acciones</th>

				</tr>
			</thead>
			<tbody >
				<tr>
					<td class = "borde-tabla"><input  placeholder="Ej. Europe" bind:value="{newMercado.Region}"></td>
					<td class = "borde-tabla"><input  placeholder="Ej. Spain" bind:value="{newMercado.Country}" ></td>
					<td class = "borde-tabla"><input type="number" placeholder="Ej. 1111.11" bind:value="{newMercado.Population}"></td>
					<td class = "borde-tabla"><input type="number" placeholder="Ej. 11.11" bind:value="{newMercado.Internet_pop}"></td>
					<td class = "borde-tabla"><input type="number" placeholder="Ej. 1111.11" bind:value="{newMercado.Revenues}"></td>
					<td class = "borde-tabla"> <Button outline  style= "font-weight: bold;" color="primary" on:click={insertMercado} > Insertar</Button> </td>
				</tr>
				{#each mercados as mercados}
					<tr>
						<td class = "borde-tabla">
							<a href="#/mercados/{mercados.Region}/{mercados.Country}">{mercados.Region}</a>
						</td>
						<td class = "borde-tabla">{mercados.Country}</td>
						<td class = "borde-tabla">{mercados.Population}</td>
						<td class = "borde-tabla">{mercados.Internet_pop}</td>
						<td class = "borde-tabla">{mercados.Revenues}</td>
						<td class = "borde-tabla"><Button outline  style= "font-weight: bold;" color="danger" on:click="{deleteMercado(mercados.Region,mercados.Country)}">  <i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
 
	{#if pageButton == true}
	<Pagination style="float:right;" ariaLabel="Cambiar de página">


		<PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
		  <PaginationLink previous href="#/mercadosAPI" on:click="{() => addOffset(-1)}" />
		</PaginationItem>
		
		{#if currentPage != 1}
		<PaginationItem>
			<PaginationLink href="#/mercadosAPI" on:click="{() => addOffset(-1)}" >{currentPage - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/mercadosAPI" >{currentPage}</PaginationLink>
		</PaginationItem>

		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/mercadosAPI" on:click="{() => addOffset(1)}">{currentPage + 1}</PaginationLink>
		</PaginationItem>
		{/if}

		<PaginationItem class="{moreData ? '' : 'disabled'}">
		  <PaginationLink next href="#/mercadosAPI" on:click="{() => addOffset(1)}"/>
		</PaginationItem>

	</Pagination>
	{/if}

	<Button outline  style= "font-weight: bold;" color="primary" on:click="{ReloadTable}"> <i class="fas fa-search"></i> Recargar datos originales </Button>
	
	<Button outline  style= "font-weight: bold;" on:click={deleteMercadoCompleto}   color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
	<p></p>
	<button type="button"  onclick="window.location.href='#/'"> ATRAS</button>
	


</main>
<style>
	.borde-tabla{
   		border: 1px solid #000;
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