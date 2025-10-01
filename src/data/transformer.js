export {
	transform
}
import {
	parents
} from './loader.js'
import {
	rgbTripleToCss,
	base_colors,
	mixRGB
} from '../ui/ui.js'

// assign colors to mechanics/genres/games
function assignColors(db) {
	// mechanics/genres/games colors
	const colors = {}

	const parentless = db.filter(m => parents(m).length === 0);
	parentless.forEach((m, i) => {
		m.color = rgbTripleToCss(base_colors[m.id])
		colors[m.id] = m.color
	});

	function computeColor(m) {
		if (m.color) return m.color;
		const parentColors = parents(m).map(p => computeColor(db.find(x => x.id === p)));
		const rgb = mixRGB(parentColors);
		m.color = rgbTripleToCss(rgb);
		colors[m.id] = m.color
		return m.color;
	}

	db.forEach(m => {
		computeColor(m);
	});

	return colors;
}

// assign inherited mechanics to mechanics/genres/games
function computeMechanics(db, mechanics, e, inherited) {
	if (e in inherited) return inherited[e];
	let result = [e]
	parents(db.find(x => x.id === e)).forEach(m => {
		let xx = computeMechanics(db, mechanics, m, inherited)
		result.push(...xx)
	});
	const mechs = new Set(mechanics.map(d => d["id"]));
	result = new Set(result.filter(id => mechs.has(id)));

	inherited[e] = result
	return inherited[e]
}

function transform(data, mechanics, genres, games) {
	const colors = assignColors(data)

	// graph elements, nodes and edges
	const elements = [];
	// store these elements to be omitted when games disconnected
	const temp_elements = [];
	// create compound game groups
	const gameGroups = {};
	// all transitively inherited mechanics for mechanics/genres/games
	const inherited = {}

	data.forEach(e => computeMechanics(data, mechanics, e.id, inherited));
	games.forEach(g => {
		const groupId = "§" + g.genres.sort().join(",") + g.mechanics.sort().join(",");
		if (!gameGroups[groupId]) gameGroups[groupId] = {
			id: groupId,
			mechanics: g.mechanics,
			genres: g.genres,
			inher: Array.from(inherited[g.id]),
			list: []
		};
		gameGroups[groupId].list.push(g);
		colors[groupId] = g.color
	});

	// mechanics nodes
	mechanics.forEach(m => {
		elements.push({
			data: {
				id: m.id,
				label: m.id,
				type: "mechanic",
				mechanics: Array.from(inherited[m.id]),
				description: m.description,
				color: colors[m.id]
			}
		});
		(m.mechanics || []).forEach(p => elements.push({
			data: {
				target: m.id,
				source: p,
				type: "mechanic-mechanic",
				color: colors[p]
			}
		}));
	});

	// genres nodes
	genres.forEach(g => {
		elements.push({
			data: {
				id: g.id,
				label: g.id,
				type: "genre",
				mechanics: Array.from(inherited[g.id]),
				description: g.description,
				color: colors[g.id]
			}
		});
		(g.genres || []).forEach(p => elements.push({
			data: {
				target: g.id,
				source: p,
				type: "genre-genre",
				color: colors[p]
			}
		}));
		(g.mechanics || []).forEach(m => elements.push({
			data: {
				target: g.id,
				source: m,
				type: "genre-mechanic",
				color: colors[m]
			}
		}));
	});

	// games nodes
	games.forEach(g => {
		elements.push({
			data: {
				id: g.id,
				label: g.id,
				type: "game",
				mechanics: Array.from(inherited[g.id]),
				color: colors[g.id],
				icon: g.icon,
				url: g.url,
				year: g.year,
				rating: g.rating,
				difficulty: g.difficulty,
				difficulty_extra: g.difficulty_extra,
				difficulty_comment: g.difficulty_comment,
				duration: g.duration,
				duration_extra: g.duration_extra,
				duration_comment: g.duration_comment,
				casual: g.casual == "TRUE",
				unlimited: g.unlimited == "TRUE",
				story: g.story == "TRUE",
				art: g.art == "TRUE"
			}
		});
	});

	// compound game groups nodes
	Object.values(gameGroups).forEach(g => {
		elements.push({
			data: {
				id: g.id,
				label: g.id,
				type: "gamegroup",
				mechanics: g.inher,
				list: g.list,
				color: colors[g.id]
			}
		});
		(g.genres || []).forEach(p => temp_elements.push({
			data: {
				target: g.id,
				source: p,
				type: "group-genre",
				color: colors[p]
			}
		}));
		(g.mechanics || []).forEach(m => temp_elements.push({
			data: {
				target: g.id,
				source: m,
				type: "group-mechanic",
				color: colors[m]
			}
		}));
		(g.list || []).forEach(m => temp_elements.push({
			data: {
				target: m.id,
				source: g.id,
				type: "group-game",
				color: colors[g.id]
			}
		}));
		temp_elements.forEach(p => elements.push(p));
	});

	return [elements, temp_elements];
}