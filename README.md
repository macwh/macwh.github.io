# Puzzle Game Reviews & Classification

A classification of videogame puzzle games emerging from the reviewing efforts of the [The Clueless Adventurer Puzzle Trove](https://store.steampowered.com/curator/43326007-The-Clueless-Adventurer-Puzzle-Trove/) Steam curator. This channel reviews games whose progress is mainly through (deductive or inductive) puzzles, although they may have action, adventure or simulation elements. Rated from 1 to 20⭐, difficulty from 1 to 5💡, and estimated full completion time🏅.

Raw data is [here](/data), and it can be visualized in an interactive graph [here](https://macwh.github.io/).

This exercise is of course very open to interpretation and always a work-in-progress.

It is organized in 3 levels, that together form a directed acyclic graph:

- Core *mechanics* identify basic gameplay concepts
	- they are hierarchical, possibly with multiple inheritance (e.g., build "Contraptions" inherits both "Solution Construction" and "Physics Simulation")
	- the roots are "Logical / Reasoning" / "Exploration / Observation" / "Reflex / Action" / "Management / Systems", general mechanics that broadly map to Puzzle / Adventure / Action / Simulation sub-genres.

- Sub-*genres* that group together mechanics into well-established classes
    - they inherit both other sub-genres and mechanics (e.g, "Puzzle adventure" is a specialization of sub-genre "Graphic Adventure" that additionally has the "Diegetic Puzzles" mechanic)

- Specific classified *games*, now counting ~150, that are assigned sub-genres and mechanics
    - creating a sub-genre for each mechanic combination would be unfeasible
    - so a game belongs to sub-genres plus additional mechanics (e.g., "FEZ" is a "Adventure puzzle platformer" that additionally has the "Perspective Shift" mechanic)

