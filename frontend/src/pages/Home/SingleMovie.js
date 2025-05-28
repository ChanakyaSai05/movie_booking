import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../../api/movie";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { Input, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAllTheatresByMovie } from "../../api/shows";

const SingleMovie = () => {
  const params = useParams();
  const [movie, setMovie] = useState();
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDate = (e) => {
    setDate(moment(e.target.value).format("YYYY-MM-DD"));
    navigate(`/movie/${params.id}?date=${e.target.value}`);
  };
  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      }
      dispatch(HideLoading());
    } catch (error) {
      console.log(error);
      dispatch(HideLoading());
    }
  }, [dispatch, params.id]);

  const getAllTheatres = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresByMovie({ movie: params.id, date });
      if (response.success) {
        setTheatres(response.data);
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      dispatch(HideLoading());
    }
  }, [dispatch, params.id, date]);
  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getAllTheatres();
  }, [getAllTheatres]);
  return (
    <div className="single-movie-container">
      {movie && (
        <div className="movie-details-card">
          <div className="movie-header">
            <div className="movie-poster-large">
              <img alt="Movie Poster" src={movie.poster} className="poster-img" />
            </div>
            <div className="movie-info-section">
              <h1 className="movie-title-large">{movie.title}</h1>
              <div className="movie-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Language:</span>
                  <span className="metadata-value">{movie.language}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Genre:</span>
                  <span className="metadata-value">{movie.genre}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Release Date:</span>
                  <span className="metadata-value">{moment(movie.date).format("MMM Do YYYY")}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Duration:</span>
                  <span className="metadata-value">{movie.duration} Minutes</span>
                </div>
              </div>
              
              <div className="date-picker-section">
                <label className="date-label">Choose the date:</label>
                <Input
                  type="date"
                  className="date-input"
                  prefix={<CalendarOutlined />}
                  onChange={handleDate}
                  value={date}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      )}        {theatres.length === 0 && (
          <div className="no-theatres-message">
            <h2 className="no-theatres-title">
              Currently, no theatres available for this movie!
            </h2>
          </div>
        )}

        {theatres.length > 0 && (
          <div className="theatres-section">
            <h2 className="section-title">Available Theatres</h2>
            <div className="theatres-list">
              {theatres.map((theatre) => {
                return (
                  <div key={theatre._id} className="theatre-card">
                    <Row gutter={24} align="middle">
                      <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                        <div className="theatre-info">
                          <h3 className="theatre-name">{theatre.name}</h3>
                          <p className="theatre-address">{theatre.address}</p>
                        </div>
                      </Col>
                      <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                        <div className="shows-container">
                          <div className="shows-grid">
                            {theatre.shows
                              .sort(
                                (a, b) =>
                                  moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                              )
                              .map((singleShow) => {
                                return (
                                  <button
                                    key={singleShow._id}
                                    className="show-time-btn"
                                    onClick={() => {
                                      navigate(`/book-show/${singleShow._id}`);
                                    }}
                                  >
                                    {moment(singleShow.time, "HH:mm").format(
                                      "hh:mm A"
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </div>
          </div>        )}
    </div>
  );
};

export default SingleMovie;
