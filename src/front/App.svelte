<script>
	import Router from 'svelte-spa-router';

	import Home from './Home.svelte';

	import mercados from './mercadosAPI/App.svelte';

	import Editmercados from './mercadosAPI/EditMercados.svelte';

	import NotFound from './NotFound.svelte';
	
	const routes = {
		"/": Home,
		"/mercados/:Region/:Country": Editmercados,
		"/mercadosAPI":mercados,
		"*": NotFound
	};
</script>

<main>
	<Router {routes} />
</main>