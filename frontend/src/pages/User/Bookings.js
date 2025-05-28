import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getAllBookings } from "../../api/booking";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);  useEffect(() => {
    const fetchBookings = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getAllBookings(user._id);
        if (response.success) {
          setBookings(response.data);
          console.log(response.data);
        } else {
          toast.error(response.message);
        }
        dispatch(HideLoading());
      } catch (err) {
        toast.error(err.message);
        dispatch(HideLoading());
      }
    };
    
    if (user?._id) {
      fetchBookings();
    }
  }, [dispatch, user]);
  return (
    <div className="bookings-container">
      <div className="page-header">
        <h2 className="page-title">My Bookings</h2>
        <p className="page-subtitle">Track all your movie bookings</p>
      </div>
      
      {bookings && bookings.length > 0 && (
        <Row gutter={[24, 24]} className="bookings-grid">          {bookings.map((booking) => {
            return (
              <Col key={booking._id} xs={24} sm={12} lg={8}>
                <Card className="booking-card">
                  <div className="booking-content">
                    <div className="movie-poster-small">
                      <img
                        src={booking.show.movie.poster}
                        alt="Movie Poster"
                        className="poster-img-small"
                      />
                    </div>
                    <div className="booking-details">
                      <h3 className="movie-title-booking">{booking.show.movie.title}</h3>
                      <div className="booking-info">
                        <div className="info-item">
                          <span className="info-label">Theatre:</span>
                          <span className="info-value">{booking.show.theatre.name}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Seats:</span>
                          <span className="info-value">{booking.seats.join(", ")}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Date & Time:</span>
                          <span className="info-value">
                            {moment(booking.show.date).format("MMM Do YYYY")}{" "}
                            {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Amount:</span>
                          <span className="info-value amount">
                            ₹{booking.seats.length * booking.show.ticketPrice}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Booking ID:</span>
                          <span className="info-value booking-id">{booking.transactionId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}        </Row>
      )}

      {!bookings.length && (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3 className="empty-title">No bookings yet!</h3>
            <p className="empty-subtitle">Start exploring amazing movies and book your first show</p>
            <Link to="/">
              <Button type="primary" size="large" className="start-booking-btn">
                Start Booking
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default Bookings;
