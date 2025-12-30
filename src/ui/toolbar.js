export {
	buttonEventHandlers,
	resetToolbar
}
import {
	setDisconnect,
	setTime,
	setGraph,
	layoutget_run,
	setFilter
} from '../graph/graph.js'

function resetToolbar() {
	document.querySelectorAll('.toolbar button').forEach(btn => {
		btn.classList.remove('active');
	});
	document.getElementById('setGraph').classList.add('active');
	setGraph();
	layoutget_run();
}

let disconnect = false

function buttonEventHandlers(cy) {

	document.getElementById('setGraph').classList.add('active');

	document.querySelectorAll('.toolbar button').forEach(btn => {
		btn.addEventListener('click', () => {
			btn.classList.toggle('active');
		});
	});

	document.getElementById('setDisconnect').addEventListener('click', () => {
		setDisconnect();
		document.getElementById('setTime').classList.remove('active');
		document.getElementById('setGraph').classList.remove('active');
		document.getElementById('setDisconnect').classList.add('active');
		layoutget_run();
	});

	document.getElementById('setGraph').addEventListener('click', () => {
		setGraph();
		document.getElementById('setTime').classList.remove('active');
		document.getElementById('setGraph').classList.add('active');
		document.getElementById('setDisconnect').classList.remove('active');
		layoutget_run();
	});

	document.getElementById('setTime').addEventListener('click', () => {
		setTime();
		document.getElementById('setTime').classList.add('active');
		document.getElementById('setGraph').classList.remove('active');
		document.getElementById('setDisconnect').classList.remove('active');
		layoutget_run();
	});

	document.querySelectorAll('.toolbar button[data-target]').forEach(btn => {
		btn.addEventListener('click', () => {
			let id = btn.dataset.target;
			setFilter(id)
		});
	});
}