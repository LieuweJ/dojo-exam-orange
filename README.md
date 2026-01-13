## README

What started as an assignment to build a single “Four in a Row” game
evolved into an exploration of how far a clean, well-structured game engine could be pushed
within the same constraints.

### What

- **A single, reusable game engine** capable of supporting multiple board games
- Currently supports three games:
    - **Orange In A Row** [see docs why it is clearly superior to Four In A Row](./docs/orange-in-a-row.md)
    - **Tic-Tac-Dojo** [see docs why it is clearly superior to Tic-Tac-Toe](./docs/tic-tac-dojo.md)
    - **Scacchi con Dojo** [see docs why it is clearly superior to chess](./docs/scacchi-con-dojo.md)

### Features

- Games are composed at runtime after the user selects a game
- Orange In A Row and Tic-Tac-Dojo share the same core logic, differing only in UI presentation
- Scacchi con Dojo includes:
    - Full support for chess rules (castling, promotion, en passant)
    - Deep cloning of players, pieces, and board state to safely simulate moves and detect
      “check” and “checkmate”
- 100% test coverage
- Runs containerized in Docker

### Technical details

- Designed and built using object-oriented programming (OOP)
- Core game logic is decoupled using interfaces (e.g. “ask next move”, “calculate win”),
  allowing each game to provide its own implementation
- Applies a selection of well-established Gang of Four 24 design patterns, including:
  Dependency Injection, Strategy, Command, Factory, Decorator/Adapter, and
  Chain of Responsibility
- Favors composition over inheritance where appropriate

### Time spent

- Building Orange In A Row (Dockerized): ±15 hours
- Adding Tic-Tac-Dojo: ±20 hours
- Adding Scacchi con Dojo (Chess): ±40 hours
- **Total**: ±75–80 hours

# Useful commands in this project:

- `npm run help` - see useful commands.
- `npm run test` - run all tests.
- `npm run coverage` - run all tests and generate a coverage report.
- `npm run compile` - compile the TypeScript code to JavaScript (output goes to `/dist`).
- `npm run kata` - run the kata (executes `main.js`).
- `npm run update-kata` - compile latest code and run the kata (executes `main.js`).
- `npm run docker:build` - build a new docker continer.
- `npm run docker:run` - run the docker container.
