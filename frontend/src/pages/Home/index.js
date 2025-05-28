import { useEffect, useState } from "react";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movie";
import { Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import toast from "react-hot-toast";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getAllMovies();
        if (response.success) {
          setMovies(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(HideLoading());
      }
    };
    
    fetchData();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">Discover Amazing Movies</h1>
        <p className="home-subtitle">Book your favorite shows with ease</p>
      </div>
      
      <div className="search-section">
        <Row className="justify-content-center w-100">
          <Col xs={{ span: 22 }} lg={{ span: 12 }}>
            <Input
              placeholder="Search for movies..."
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              className="search-input"
              size="large"
            />
          </Col>
        </Row>
      </div>

      <div className="movies-grid">
        <Row
          className="justify-content-center"
          gutter={{ xs: 16, sm: 24, md: 32, lg: 40 }}
        >
          {movies &&
            movies
              .filter((movie) =>
                movie.title.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((movie) => (
                <Col
                  className="mb-4"
                  key={movie._id}
                  xs={24} sm={12} md={8} lg={6}
                >
                  <div className="movie-card">
                    <div className="movie-poster-container">
                      <img
                        src={movie.poster}
                        className="movie-poster"
                        alt="Movie Poster"
                        onClick={() => {
                          navigate(
                            `/movie/${movie._id}?date=${moment().format(
                              "YYYY-MM-DD"
                            )}`
                          );
                        }}
                      />
                    </div>
                    <div className="movie-info">
                      <h3
                        className="movie-title"
                        onClick={() => {
                          navigate(
                            `/movie/${movie._id}?date=${moment().format(
                              "YYYY-MM-DD"
                            )}`
                          );
                        }}
                      >
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
