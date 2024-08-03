import { useEffect, useState } from "react";
import StarRating from "./StarRating.js";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const key = "a13e151a";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState("");

//====================================
// Handle Select Id Function
//====================================
function handleSelectId(id){
  setSelectedId((SID) => SID === id ? null : id );
}

//====================================
// close movie details Function
//====================================

function handleCloseDetails(){
  setSelectedId(null);
}



//====================================
// Handle Watched Movie
//====================================

function handleWatchedMovie(movie){
  setWatched((watched) => watched.find(el => el.imdbID === movie.imdbID ) ? watched : [...watched, movie]);
  
}
//====================================
// Handle Delete Movie form watch list
//====================================

function handleDeleteMovie(id){
 setWatched((watched) => watched.filter(movie => movie.imdbID !== id));
}


//===========================
// Effect Start
//===========================


  


  ///////////////////////

  useEffect(
    function () {
      const controller = new AbortController();

      setIsLoading(true);
      async function fetchMovies() {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`
          , {signal : controller.signal}
        );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies.");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found.");

          setMovies(data.Search);    
          setIsLoading(false);
          setErrorMessage("");
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if(query){
        fetchMovies();
      }else{
        setErrorMessage("Search new movie. 😍");
        setIsLoading(false);
        setMovies([]);
      }

        return function(){
          controller.abort();
        }

    },
    [query]
  );
  
  //=========================
  // Effect END
  //===========================



  return (
    <>
      <NavBar query={query} setQuery={setQuery}>
        <NumResults movies={movies}  />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : movies.length !== 0 ? <MovieList movies={movies} /> : <ErrorMessage />} */}
          {isLoading && <Loader />}
          {errorMessage && <ErrorMessage message={errorMessage} />}
          {!isLoading && !errorMessage && <MovieList onSelectId={handleSelectId} movies={movies} />}
        </Box>
        <Box>
          {selectedId ? 
           <MovieDetails watched={watched} onWatchedMovie={handleWatchedMovie} onCloseDetails={handleCloseDetails} selectedId={selectedId}/> 
          : 
          <>
          <WatchedSummery watched={watched} />
          <WatchedMoviesList watched={watched} onDeleteWatchedMovie={handleDeleteMovie}/>
          </>
          }
         </Box>
      </Main>
    </>
  );
}

//==============================
// Main
//==============================

function Main({ children}) {
  return (
    <main className="main">
      {children}
    </main>
  );
}

//==============================
// Navigation Bar
//==============================
function NavBar({ children, query , setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
}
//================================
// Movie Details Component
//================================

function MovieDetails({selectedId, onCloseDetails, onWatchedMovie, watched}){
const [movie, setMovie] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [userRating, setUserRating] = useState(0);

const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
console.log(isWatched);

const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;
console.log(watchedUserRating);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;

  useEffect(function(){
    if(!title) return;
      document.title = `Movie | ${title}`;
      return function(){
        document.title = "usePopcorn";
      }
  }, [title]) ;

  useEffect(function(){
    const callBack =  function(e){
      if(e.code === "Escape"){
        onCloseDetails();
      }
    }
    document.addEventListener("keydown", callBack);

    return function(){
      document.removeEventListener("keydown", callBack);
    }
}, [onCloseDetails]);


  function handleAddMovie(){
    const addNewWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    }
    onWatchedMovie(addNewWatchedMovie);
    onCloseDetails();
  }


  // useEffect to fetch movies details by ID
  useEffect(function(){
      async function getMovieDetails(){
        try{
          setIsLoading(true);
          const res = await fetch(`http://www.omdbapi.com/?apikey=${key}&i=${selectedId}` );
          const data = await res.json();
          setMovie(data); 
          setIsLoading(false);
        }catch(error){
          console.log(error.message);
        }finally{
          setIsLoading(false);

        }
    }
    getMovieDetails();
  
  }, [selectedId]);


  return (
    <div className="details">
      {isLoading ? <ErrorMessage  /> :
      <>
          <header>
          <button className="btn-back" onClick={onCloseDetails}>&larr;</button>
            <img  src={poster} alt={`post of the ${movie} movie`}/>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}  </p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating} IMDB rating </p>
            </div>

          </header>

          <section>
          <div className="rating">
           { !isWatched ? 
           <>
              <StarRating maxRating={10} size={24}  defaultRating={imdbRating} onSetRating={setUserRating}/>
              
            {
              userRating > 0 &&
              <button onClick={handleAddMovie} className="btn-add">+ add to list</button>
            }
            </>
            : <p>You already rated this movie {watchedUserRating} 🌟</p>
          }
          </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
        }

      </div>
  );
}

//================================
// Error Message
//================================
function ErrorMessage({ message = "Loading..." }) {
  return <p className="loader">{message}</p>;
}

//================================
// Loader
//===============================
function Loader() {
  return <p className="loader">Loading....</p>;
}
//================================
// Logo 
//===============================
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}


//================================
// Search
//==============================
function Search({query, setQuery}) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen ? children : null}
    </div>
  );
}

function MovieList({ movies, onSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectId={onSelectId}  movie={movie} key={movies.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectId }) {
  return (
    <li onClick={() => onSelectId(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched , onDeleteWatchedMovie}) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatchedMovie={onDeleteWatchedMovie} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie ,onDeleteWatchedMovie}) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDeleteWatchedMovie(movie.imdbID)}>X</button>
    </li>
  );
}
