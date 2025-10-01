import {
  data,
  mechanics,
  games,
  genres,
  parents
} from './data/loader.js'
import {
  transform
} from './data/transformer.js'
import {
  doUI
} from './ui/ui.js'
import {
  initGraph
} from './graph/graph.js'
import {
  buttonEventHandlers
} from './ui/toolbar.js'

let db = await data()
let [elems, temps] = transform(db, await mechanics(), await genres(), await games())
const cy = initGraph(elems, temps);
buttonEventHandlers(cy)
doUI();