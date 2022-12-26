import React, { useContext, useEffect, useState, useCallback } from "react";
import "./Dashboard.css";
import SessionContext from "../../store/session-context";
import SearchParams from "./SearchParams/SearchParams";
import MovieBlock from "./MovieBlock/MovieBlock";
import Overlay from "./Overlay/Overlay";
import axios from "axios";
import Loader from "../Loader/Loader";

const Dashboard = (props) => {
  const ctx = useContext(SessionContext);
  console.log("ctx", ctx);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const [starredMovies, setStarredMovies] = useState([]);
  const [trendingPage, setTrendingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [genrePage, setGenrePage] = useState(1);
  const [genre, setGenre] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [search, setSearch] = useState("");
  const [starredPage, setStarredPage] = useState(1);
  const [starred, setStarred] = useState(false);
  const [trendingError, setTrendingError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [popularError, setPopularError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [topRatedError, setTopRatedError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [genreError, setGenreError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [searchError, setSearchError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [starredError, setStarredError] = useState({
    errorState: false,
    errorMsg: "",
  });
  const [trendingLoader, setTrendingLoader] = useState(false);
  const [popularLoader, setPopularLoader] = useState(false);
  const [topRatedLoader, setTopRatedLoader] = useState(false);
  const [genreLoader, setGenreLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const [starredLoader, setStarredLoader] = useState(false);

  const getTrendingMovies = useCallback(async () => {
    setTrendingLoader(true);
    const trendingResponse = await axios.post(
      "https://mern-movie-app.onrender.com/trending_movies",
      { page: trendingPage },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setTrendingLoader(false);
    if (trendingResponse.data.error) {
      if (trendingResponse.data.msg == "Can't fetch data") {
        setTrendingError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setTrendingError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { trending_movies_slice } = trendingResponse.data.data;
    if (trending_movies_slice.length == 0) {
      return;
    }
    console.log(trending_movies_slice);
    let temp = [...trendingMovies];
    temp.push(trending_movies_slice);
    setTrendingMovies(temp);
  }, [trendingPage]);

  const getPopularMovies = useCallback(async () => {
    setPopularLoader(true);
    const popularResponse = await axios.post(
      "https://mern-movie-app.onrender.com/popular",
      { page: popularPage },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setPopularLoader(false);
    if (popularResponse.data.error) {
      if (popularResponse.data.msg == "Can't fetch data") {
        setPopularError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setPopularError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { popular_movies } = popularResponse.data.data;
    if (popular_movies.length == 0) {
      return;
    }
    console.log(popular_movies);
    let temp = [...popularMovies];
    temp.push(popular_movies);
    setPopularMovies(temp);
  }, [popularPage]);

  const getTopRatedMovies = useCallback(async () => {
    setTopRatedLoader(true);
    const topRatedResponse = await axios.post(
      "https://mern-movie-app.onrender.com/top_rated",
      { page: topRatedPage },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setTopRatedLoader(false);
    if (topRatedResponse.data.error) {
      if (topRatedResponse.data.msg == "Can't fetch data") {
        setTopRatedError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setTopRatedError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { top_rated_movies } = topRatedResponse.data.data;
    if (top_rated_movies.length == 0) {
      return;
    }
    console.log(top_rated_movies);
    let temp = [...topRatedMovies];
    temp.push(top_rated_movies);
    setTopRatedMovies(temp);
  }, [topRatedPage]);

  const getGenreMovies = useCallback(async () => {
    setGenreLoader(true);
    const genreResponse = await axios.post(
      "https://mern-movie-app.onrender.com/genre",
      { page: genrePage, genre: genre },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setGenreLoader(false);
    if (genreResponse.data.error) {
      if (genreResponse.data.msg == "Can't fetch data") {
        setGenreError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setGenreError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { genre_movies } = genreResponse.data.data;
    if (genre_movies.length == 0) {
      return;
    }
    let temp = [...genreMovies];
    temp.push(genre_movies);
    setGenreMovies(temp);
  }, [genrePage, genre]);

  const getSearchMovies = useCallback(async () => {
    setSearchLoader(true);
    const searchResponse = await axios.post(
      "https://mern-movie-app.onrender.com/search",
      { page: searchPage, query: search },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setSearchLoader(false);
    if (searchResponse.data.error) {
      if (searchResponse.data.msg == "Can't fetch data") {
        setSearchError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setSearchError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { search_movies } = searchResponse.data.data;
    if (search_movies.length == 0) {
      return;
    }
    let temp = [...searchMovies];
    temp.push(search_movies);
    setSearchMovies(temp);
  }, [searchPage, search]);

  const getStarredMovies = useCallback(async () => {
    setStarredLoader(true);
    console.log("ctx", localStorage["movie_app_id"]);
    const starredResponse = await axios.post(
      "https://mern-movie-app.onrender.com/starred",
      { _id: ctx.appState.userDetails._id, page: starredPage },
      {
        headers: {
          _id: ctx.appState.userDetails._id,
          token: ctx.appState.userDetails.token,
        },
      }
    );
    setStarredLoader(false);
    if (starredResponse.data.error) {
      if (starredResponse.data.msg == "Can't fetch data") {
        setStarredError({
          errorState: true,
          errorMsg: "Unable to fetch data right now. Please try again later.",
        });
        return;
      } else {
        setStarredError({
          errorState: true,
          errorMsg: "Something went wrong, please refresh.",
        });
        return;
      }
    }
    const { starred_movies } = starredResponse.data.data;
    if (starred_movies.length == 0) {
      return;
    }
    let temp = [...starredMovies];
    temp.push(starred_movies);
    setStarredMovies(temp);
  }, [starredPage]);

  const moreMoviesHandler = async (heading) => {
    console.log(heading);
    if (heading == "Trending") {
      setTrendingPage(trendingPage + 1);
    }
    if (heading == "Popular") {
      setPopularPage(popularPage + 1);
    }
    if (heading == "Top-Rated") {
      setTopRatedPage(topRatedPage + 1);
    }
    if (heading == "Genre") {
      setGenrePage(genrePage + 1);
    }
    if (heading == "Search") {
      setSearchPage(searchPage + 1);
    }
    if (heading == "Starred") {
      setStarredPage(starredPage + 1);
    }
  };

  const changeGenreHandler = async (value) => {
    setGenre(value);
    setGenreMovies([]);
  };
  const submitQueryHandler = async (value) => {
    setSearch(value);
    setSearchMovies([]);
  };

  const closeOverlayHandler = () => {
    // ctx.setOverlay(false)
    // ctx.setError({
    //     errorState: false,
    //     errorMsg: ""
    // })
    // ctx.setMovieModal({
    //     movieModalState: false,
    //     movieId: ""
    // })
    ctx.setAppState((prevState) => {
      return {
        ...prevState,
        overlay: false,
        error: {
          errorState: false,
          errorMsg: "",
        },
        movieModal: {
          movieModalState: false,
          movieId: "",
        },
      };
    });
  };

  const unStarHandler = (id) => {
    if (!starredMovies[0]) {
      return;
    }
    const tempStarredMovies = starredMovies[0].filter((movie) => {
      return movie.id != id;
    });
    console.log(tempStarredMovies.length);
    setStarredMovies([tempStarredMovies]);
  };

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "dashboard") {
      getTrendingMovies();
    }
  }, [trendingPage]);

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "dashboard") {
      getPopularMovies();
    }
  }, [popularPage]);

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "dashboard") {
      getTopRatedMovies();
    }
  }, [topRatedPage]);

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "genre") {
      getGenreMovies();
    }
  }, [genrePage, genre]);

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "search") {
      getSearchMovies();
    }
  }, [search, searchPage]);

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx.appState.page == "starred") {
      getStarredMovies();
    }
  }, [starredPage, props.starred]);

  return (
    <div className="dashboard">
      <SearchParams
        onChangeGenre={changeGenreHandler}
        onSubmitQuery={submitQueryHandler}
      />
      {ctx.appState.page == "dashboard" && (
        <div className="dashboard-blocks">
          {trendingError.errorState && (
            <MovieBlock
              heading="Trending"
              movies={trendingMovies}
              onMoreMovies={moreMoviesHandler}
              error={trendingError}
              loader={trendingLoader}
            />
          )}
          {!trendingError.errorState && (
            <MovieBlock
              heading="Trending"
              movies={trendingMovies}
              onMoreMovies={moreMoviesHandler}
              error={trendingError}
              loader={trendingLoader}
            />
          )}
          {popularError.errorState && (
            <MovieBlock
              heading="Popular"
              movies={popularMovies}
              onMoreMovies={moreMoviesHandler}
              error={popularError}
              loader={popularLoader}
            />
          )}
          {!popularError.errorState && (
            <MovieBlock
              heading="Popular"
              movies={popularMovies}
              onMoreMovies={moreMoviesHandler}
              error={popularError}
              loader={popularLoader}
            />
          )}
          {topRatedError.errorState && (
            <MovieBlock
              heading="Top-Rated"
              movies={topRatedMovies}
              onMoreMovies={moreMoviesHandler}
              error={topRatedError}
              loader={topRatedLoader}
            />
          )}
          {!topRatedError.errorState && (
            <MovieBlock
              heading="Top-Rated"
              movies={topRatedMovies}
              onMoreMovies={moreMoviesHandler}
              error={topRatedError}
              loader={topRatedLoader}
            />
          )}
        </div>
      )}
      {ctx.appState.page == "genre" && (
        <div className="dashboard-blocks">
          {genreError.errorState && (
            <MovieBlock
              heading="Genre"
              movies={genreMovies}
              onMoreMovies={moreMoviesHandler}
              error={genreError}
              loader={genreLoader}
            />
          )}
          {!genreError.errorState && (
            <MovieBlock
              heading="Genre"
              movies={genreMovies}
              onMoreMovies={moreMoviesHandler}
              error={genreError}
              loader={genreLoader}
            />
          )}
        </div>
      )}
      {ctx.appState.page == "search" && (
        <div className="dashboard-blocks">
          {searchError.errorState && (
            <MovieBlock
              heading="Search"
              movies={searchMovies}
              onMoreMovies={moreMoviesHandler}
              error={searchError}
              loader={searchLoader}
            />
          )}
          {!searchError.errorState && (
            <MovieBlock
              heading="Search"
              movies={searchMovies}
              onMoreMovies={moreMoviesHandler}
              error={searchError}
              loader={searchLoader}
            />
          )}
        </div>
      )}
      {ctx.appState.page == "starred" && (
        <div className="dashboard-blocks">
          {starredError.errorState && (
            <MovieBlock
              heading="Starred"
              movies={starredMovies}
              onMoreMovies={moreMoviesHandler}
              error={starredError}
              loader={starredLoader}
            />
          )}
          {!starredError.errorState && (
            <MovieBlock
              heading="Starred"
              movies={starredMovies}
              onMoreMovies={moreMoviesHandler}
              error={starredError}
              loader={starredLoader}
            />
          )}
        </div>
      )}
      {ctx.appState.overlay && (
        <Overlay
          onCloseOverlay={closeOverlayHandler}
          onUnStar={unStarHandler}
        />
      )}
    </div>
  );
};

export default Dashboard;
