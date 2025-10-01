export {
  data,
  genres,
  mechanics,
  games,
  parents
}

let _mechanics
let _genres
let _games

async function data() {
  let m = await mechanics();
  let r = await genres();
  let g = await games();
  return m.concat(r).concat(g)
}

async function mechanics() {
  if (!_mechanics) {
    const response = await fetch('../../data/mechanics.json');
    const data = await response.json();
    _mechanics = data
  }
  return _mechanics
}

async function genres() {
  if (!_genres) {
    const response = await fetch('../../data/genres.json');
    const data = await response.json();
    _genres = data
  }
  return _genres
}

async function games() {
  if (!_games) {
    const response = await fetch('../../data/games.json');
    const data = await response.json();
    _games = data
  }
  return _games
}

function parents(e) {
  return (e.mechanics || []).concat(e.genres || [])
}