let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Write an API to select only title,actor and release_year of all movies

async function fetchAllMovies() {
  let query = 'SELECT id, title, release_year FROM movies';
  let response = await db.all(query, []);
  return { movies: response };
}

app.get('/movies', async (req, res) => {
  try {
    const results = await fetchAllMovies();
    if (results.movies.length === 0) {
      return res.status(404).json({ messgae: 'no movies found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.messgae });
  }
});

// Write an API to select id , title , actor , release_year from all movies by an actor..
async function fetchMoviesyActor(actor) {
  let query =
    'SELECT id, title, actor, release_year FROM movies WHERE actor = ?';
  let response = await db.all(query, [actor]);
  return { movies: response };
}

app.get('/movies/actor/:actor', async (req, res) => {
  let actor = req.params.actor;

  try {
    let results = await fetchMoviesyActor(actor);
    if (results.movies.length === 0) {
      return res.status(404).json({ messgae: 'no movie found with actor ' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.messgae });
  }
});

//  write an API to SELECT id, title, director and release_year from all movies by a director

async function fetchMoviesByDirector(director) {
  let query =
    'SELECT id, title, director, release_year from movies WHERE director = ?';
  let response = await db.all(query, [director]);
  return { movies: response };
}

app.get('/movies/director/:director', async (req, res) => {
  let director = req.params.director;
  try {
    let results = await fetchMoviesByDirector(director);
    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ messgae: 'no movie found for this director' + director });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.messgae });
  }
});

app.listen(PORT, () => console.log('server runniong on port 3000'));
 