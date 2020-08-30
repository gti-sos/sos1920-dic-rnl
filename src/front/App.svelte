<script>
	import Router from 'svelte-spa-router';

	import about from './about.svelte';
	import Home from './Home.svelte';

	import mercados from './mercadosAPI/App.svelte';
	import Editmercados from './mercadosAPI/EditMercados.svelte';
	import NotFound from './NotFound.svelte';
	import integrations from './integrations.svelte';
	//GRAFOS PROPIOS
	import MercadosGraph1 from './mercadosAPI/MercadosGraph1.svelte';
	import MercadosGraph2 from './mercadosAPI/MercadosGraph2.svelte';

	

	//INTEGRACIONES
	import IntegracionFernando from  './mercadosAPI/IntegrationGraph1.svelte';
	import Integracion2 from  './mercadosAPI/IntegrationGraph2.svelte';
	import Integracion3 from  './mercadosAPI/IntegrationGraph3.svelte';	
	import Integracion4 from  './mercadosAPI/IntegrationGraph4.svelte';
	import Integracion5 from  './mercadosAPI/ExternalIntegration1.svelte';
	import Integracion6 from  './mercadosAPI/ExternalIntegration2.svelte';	
	
	
	const routes = {
		"/": Home,
		"/mercados/:Region/:Country": Editmercados,
		"/mercadosAPI":mercados,
		"/MercadosGraph1":MercadosGraph1,
		"/MercadosGraph2":MercadosGraph2,
		"/integrations":integrations,
		"/IntegrationGraph1":IntegracionFernando,
		"/IntegrationGraph2":Integracion2,
		"/IntegrationGraph3":Integracion3,
		"/IntegrationGraph4":Integracion4,
		"/ExternalIntegration1":Integracion5,
		"/ExternalIntegration2":Integracion6,
		"/about": about,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>