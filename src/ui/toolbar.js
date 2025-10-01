export {
	buttonEventHandlers
}
import {
	toggleConnect,
	layoutget,
	setFilter
} from '../graph/graph.js'

function buttonEventHandlers(cy) {

	document.querySelectorAll('.toolbar button').forEach(btn => {
		btn.addEventListener('click', () => {
			btn.classList.toggle('active');
		});
	});

	// toggle game node connection
	document.getElementById('toggleLayout').addEventListener('click', () => {
		let connect = toggleConnect();
		if (!connect) {
			cy.remove('edge[type = "group-mechanic"]');
			cy.remove('edge[type = "group-genre"]');
			cy.remove('edge[type = "group-game"]');
		}
		layoutget().run();
	});

	// attach genre click handlers
	document.querySelectorAll('.toolbar button[data-target]').forEach(btn => {
		btn.addEventListener('click', () => {
			let id = btn.dataset.target;
			setFilter(id)
		});
	});
}