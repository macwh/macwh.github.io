export {
    initGraph,
    layoutget,
    toggleConnect,
    applyFilters,
    setFilter,
    assignHandlers
}
import {
  resetToolbar
} from '../ui/toolbar.js'

let cy
let connect = true
let temp_elements;

function toggleConnect() {
    connect = !connect
    return connect
}

function initGraph(elements, temps) {
    temp_elements = temps
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [{
            selector: 'node',
            style: {
                'background-color': 'data(color)',
                'color': '#DDDDDD',
                'text-wrap': 'wrap',
                'text-valign': 'center',
                'text-halign': 'center',
                'label': 'data(label)',
                'font-size': 10
            }
        }, {
            selector: 'node[type="mechanic"]',
            style: {
                'shape': 'round-rectangle',
                'width': 80,
                'height': 80,
                'text-max-width': '60px',
                'font-size': 12
            }
        }, {
            selector: 'node[type="genre"]',
            style: {
                'shape': 'octagon',
                'width': 120,
                'height': 120,
                'text-max-width': '120px',
                'font-size': 18
            }
        }, {
            selector: 'node[type="gamegroup"]',
            style: {
                'width': 30,
                'height': 30,
                'label': '',
                'shape': 'ellipse'
            }
        }, {
            selector: 'node[type="game"]',
            style: {
                'background-image': 'data(icon)',
                'background-fit': 'cover',
                'background-clip': 'node',
                'width': 50,
                'height': 50,
                'label': '',
                'shape': 'roundrectangle'
            }
        }, {
            selector: 'edge',
            style: {
                'width': 2,
                'opacity': 0.75,
                'line-color': 'data(color)',
                'target-arrow-color': 'data(color)',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
            }
        }, {
            selector: '.faded',
            style: {
                'opacity': 0.1,
                'text-opacity': 0.05
            }
        }],
        wheelSensitivity: 0.2
    });
    cy.userZoomingEnabled(true);
    cy.userPanningEnabled(true);
    assignHandlers();
    layoutget().run();
    return cy;
}

let filters = []
let sel_ids = []

function setFilter(id) {
    let filter
    if (id == "Top") {
        filter = '[rating >= 19]'
    } else if (id == "Negative") {
        filter = '[rating != ""][rating < 10]'
    } else if (id == "Positive") {
        filter = '[rating >= 10]'
    } else if (id == "Hardest") {
        filter = '[difficulty >= 4]'
    } else if (id == "Classic") {
        filter = '[year <= 2005]'
    } else if (id == "Casual") {
        filter = '[?casual]'
    } else if (id == "Story") {
        filter = '[?story]'
    } else if (id == "Unlimited") {
        filter = '[?unlimited]'
    } else if (id == "Art") {
        filter = '[?art]'
    }
    if (filter) {
        if (filters.includes(filter))
            filters = filters.filter(i => i !== filter);
        else
            filters.push(filter);
    } else {
        if (sel_ids.includes(id))
            sel_ids = sel_ids.filter(i => i !== id);
        else
            sel_ids.push(id);
    }
    applyFilters()
}

function applyFilters() {
    let sel = cy.nodes()
    if (sel_ids.length != 0) {
        sel_ids.forEach(f => {
            let node = cy.nodes(`node[id ='${f}']`)
            sel = sel.intersect(node.union(node.successors()).union(node.predecessors()));
        });

    }

    if (filters.length != 0) {
        let filter = ""
        filters.forEach(f => {
            filter = filter + f;
        });
        sel = sel.filter(filter);
    }

    let connected = sel.union(sel.successors()).union(sel.predecessors());
    cy.elements().addClass('faded');
    connected.removeClass('faded');

}

function layoutget() {
    // set layout
    cytoscape.use(cytoscapeCoseBilkent);

    return cy.layout({
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 1000,
        randomize: true,
        nodeRepulsion: 5000,
        idealEdgeLength: 200,
        gravity: 0.1,
        nestingFactor: 0.5,
        avoidOverlap: true,
        padding: 80,

        stop: () => {
            if (!connect) {
                // add hidden elements to be considered in selections
                temp_elements.forEach(p => cy.add(p));
            }
            // set proper visibility for connections
            cy.edges('[type="group-genre"]').forEach(ele => {
                ele.style('visibility', connect ? 'visible' : 'hidden');
            });
            cy.edges('[type="group-mechanic"]').forEach(ele => {
                ele.style('visibility', connect ? 'visible' : 'hidden');
            });
            cy.edges('[type="group-game"]').forEach(ele => {
                ele.style('visibility', connect ? 'visible' : 'hidden');
            });
            cy.elements('[type="gamegroup"]').forEach(ele => {
                ele.style('visibility', connect ? 'visible' : 'hidden');
            });
        }
    });
}

function assignHandlers() {

    // create tooltip
    const tooltip = document.getElementById('tooltip');

    // show tooltip and highlight nodes
    cy.on('mouseover', 'node', evt => {
        let node = evt.target;
        let connected = node.union(node.successors()).union(node.predecessors());
        cy.elements().addClass('faded');
        connected.removeClass('faded');
    });

    let currentTip = null;

    // move tooltip
    cy.on('mousemove', 'node', evt => {
        tooltip.style.left = evt.originalEvent.pageX + 10 + 'px';
        tooltip.style.top = evt.originalEvent.pageY + 10 + 'px';
    });

    // hide tooltip and remove highlights
    cy.on('mouseout', 'node', evt => {
        tooltip.style.display = 'none';
        applyFilters();
    });

    cy.on('mouseover', 'node', evt => {
        const node = evt.target;

        // Get node position in Cytoscape container coordinates
        const pos = node.renderedPosition();

        // Get container offset relative to page
        const rect = cy.container().getBoundingClientRect();

        // Calculate page coordinates
        const x = rect.left + pos.x;
        const y = rect.top + pos.y;

        // Temporary div at correct position
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        document.body.appendChild(div);

        let tipdiv
        if (node.data('type') == "game") {
            let duration_str = ""
            if (node.data('duration')) {
                duration_str = `${node.data('duration')}h⏱`
                let extra = ""
                if (node.data('duration_extra') && node.data('duration_comment')) 
                    extra = `(+${node.data('duration_extra')}h⏱ ${node.data('duration_comment')})`
                else if (node.data('duration_extra'))
                    extra = `(+${node.data('duration_extra')}h⏱)`
                else if (node.data('duration_comment'))
                    extra = `(${node.data('duration_comment')})`
                if (extra)
                    duration_str = duration_str + " " + extra
            }
            let difficulty_str = ""
            if (node.data('difficulty')) {
                difficulty_str = `${node.data('difficulty')}/5💡`
                let extra = ""
                if (node.data('difficulty_extra') && node.data('difficulty_comment')) 
                    extra = `(${node.data('difficulty_extra')}/5💡 ${node.data('difficulty_comment')})`
                else if (node.data('difficulty_extra'))
                    extra = `(${node.data('difficulty_extra')}/5💡)`
                else if (node.data('difficulty_comment'))
                    extra = `(${node.data('difficulty_comment')})`
                if (extra)
                    difficulty_str = difficulty_str + " " + extra
            }
            let rating_str = ""
            if (node.data('rating')) {
                rating_str = `${node.data('rating')}/20⭐️`
            }
            tipdiv = `
        <div style="display:flex; align-items:center; gap:10px; max-width:250px; white-space:normal; flex-wrap:wrap;">
          <img src="${node.data('icon')}" style="width:32px; height:32px;">
          <span style="max-width:200px;">${node.data('label')} (${node.data('year')})</span>
          <span style="width:100%;">${rating_str} ${difficulty_str} ${duration_str}</span>
          <span style="max-width:250px;">${node.data('mechanics').join(' 🔺 ')}</span>
        </div>
      `
        } else if (node.data('type') == "gamegroup") {
            tipdiv = `
        <div style="display:flex; align-items:center; gap:10px; max-width:250px; white-space:normal; flex-wrap:wrap;">
          <span style="max-width:250px;">${node.data('mechanics').join(' 🔺 ')}</span>
        </div>
      `
        } else if (node.data('type') == "genre") {
            tipdiv = `
        <div style="display:flex; align-items:center; gap:10px; max-width:250px; white-space:normal; flex-wrap:wrap;">
          <span style="max-width:200px;">🏷 ${node.data('label')}</span>
          <span style="max-width:250px;">${node.data('description')}</span>
          <span style="max-width:250px;">${node.data('mechanics').join(' 🔺 ')}</span>
        </div>
      `
        } else if (node.data('type') == "mechanic") {
            tipdiv = `
        <div style="display:flex; align-items:center; gap:10px; max-width:250px; white-space:normal; flex-wrap:wrap;">
          <span style="max-width:200px;">⚙️ ${node.data('label')}</span>
          <span style="max-width:250px;">${node.data('description')}</span>
          <span style="max-width:250px;">${node.data('mechanics').join(' 🔺 ')}</span>
        </div>
      `
        }

        const tip = tippy(div, {
            content: tipdiv,
            allowHTML: true,
            placement: 'top',
            trigger: 'manual',
            animation: 'scale',
            onHidden(instance) {
                div.remove();
            }
        });


        tip.show();
        currentTip = tip;
    });

    // Hide tooltip when mouse leaves the graph container
    cy.on('mouseout', 'node', evt => {
        if (currentTip) {
            currentTip.destroy();
            currentTip = null;
        }
    });

    // add review links to games
    cy.ready(() => {
        cy.on('tap', 'node[type="game"]', (evt) => {
            const url = evt.target.data('url');
            if (url) window.open(url, '_blank');
        });

        cy.on('tap', function (event) {
            if (event.target === cy) {
                filters = [];
                sel_ids = [];
                tooltip.style.display = 'none';
                applyFilters();
                resetToolbar();
            }
        });
    });
}