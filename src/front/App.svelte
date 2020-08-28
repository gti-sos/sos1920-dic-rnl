<script>
	import Router from 'svelte-spa-router';

	import about from './about.svelte';
	import Home from './Home.svelte';

	import mercados from './mercadosAPI/App.svelte';
	import Editmercados from './mercadosAPI/EditMercados.svelte';
	import MercadosGraph1 from './mercadosAPI/MercadosGraph1.svelte';
	import MercadosGraph2 from './mercadosAPI/MercadosGraph2.svelte';

	import NotFound from './NotFound.svelte';

	//INTEGRACIONES
	import IntegracionFernando from  './mercadosAPI/IntegrationGraph1.svelte';
	
	
	
	const routes = {
		"/": Home,
		"/mercados/:Region/:Country": Editmercados,
		"/mercadosAPI":mercados,
		"/MercadosGraph1":MercadosGraph1,
		"/MercadosGraph2":MercadosGraph2,
		"/IntegrationGraph1":IntegracionFernando,
		"/about": about,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>