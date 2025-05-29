import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getShowById } from "../../api/shows";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout"; // Stripe Checkout
import { bookShow, makePayment } from "../../api/booking";
import toast from "react-hot-toast";
import { showErrorToasts, extractErrorFromResponse } from "../../utils/errorHandler";

const BookShow = () => {
  // Redux state and hooks
  const { user } = useSelector((state) => state.users); // Extracting user from Redux state
  const dispatch = useDispatch(); // Redux dispatch function
  const [show, setShow] = useState(); // State for holding show details
  const [selectedSeats, setSelectedSeats] = useState([]); // State for managing selected seats
  const [isBooking, setIsBooking] = useState(false); // State for booking button loading
  const params = useParams(); // Extracting URL parameters
  const navigate = useNavigate(); // Navigation hook
  // Function to fetch show data by ID
  const getData = async () => {
    try {
      dispatch(ShowLoading()); // Dispatching action to show loading state
      const response = await getShowById({ showId: params.id }); // API call to fetch show details
      if (response.success) {
        setShow(response.data); // Setting state with fetched show data
        console.log(response.data); // Logging show data to console      } else {
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Failed to load show details");
        }
      }dispatch(HideLoading()); // Dispatching action to hide loading state
    } catch (err) {
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading()); // Hiding loading state on error
    }
  };

  // Function to generate seat layout dynamically
  const getSeats = () => {
    let columns = 12; // Number of columns for seating arrangement
    let totalSeats = show.totalSeats;
    let rows = Math.ceil(totalSeats / columns);    return (
      <div className="seat-layout-container">
        <div className="screen-area">
          <div className="screen-label">
            Screen this side - you will be watching in this direction
          </div>
          <div className="screen-display"></div>
        </div>
        
        <div className="seating-area">
          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-seat available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat booked"></div>
              <span>Booked</span>
            </div>
          </div>
            <div className="seats-grid">
            {Array.from(Array(rows).keys()).map((row) =>
              Array.from(Array(columns).keys()).map((column) => {
                let seatNumber = row * columns + column + 1;
                let seatClass = "seat-btn";
                
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += " selected";
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += " booked";
                }
                
                if (seatNumber <= totalSeats) {
                  return (
                    <button
                      key={seatNumber}
                      className={seatClass}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter(
                              (curSeatNumber) => curSeatNumber !== seatNumber
                            )
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      {seatNumber}
                    </button>
                  );
                }
                return null;
              })
            )}
          </div>
        </div>
        
        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <div className="summary-content">
              <div className="selected-info">
                <span className="summary-label">Selected Seats:</span>
                <span className="summary-value">{selectedSeats.join(", ")}</span>
              </div>
              <div className="price-info">
                <span className="summary-label">Total Price:</span>
                <span className="summary-value total-price">
                  ₹{selectedSeats.length * show.ticketPrice}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };  // Effect hook to fetch data on component mount
  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onToken = async (token) => {
    console.log(token);
    setIsBooking(true);
    try {
      dispatch(ShowLoading());
      const response = await makePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );      if (response.success) {
        toast.success(response.message);
        // Use the transactionId from the PaymentIntent response
        book(response.data.transactionId);      } else {
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Payment failed");
        }
      }
      dispatch(HideLoading());    } catch (err) {
      console.log(err);
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading());
    } finally {
      setIsBooking(false);
    }
  };
  const book = async (transactionId) => {
    try {
      const response = await bookShow({
        show: show._id,
        transactionId,
        seats: selectedSeats,
        user: user._id,
        totalPrice: selectedSeats.length * show.ticketPrice * 100, // Add total price for validation
      });
      if (response.success) {
        toast.success(response.message);
        navigate("/profile");      } else {
        if (response.errors && Array.isArray(response.errors)) {
          showErrorToasts(response.errors);
        } else {
          showErrorToasts(response.message || "Booking failed");
        }
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      const extractedErrors = extractErrorFromResponse(err);
      showErrorToasts(extractedErrors);
      dispatch(HideLoading());
    }
  };
  return (
    <div className="book-show-container">
      {show && (
        <div className="booking-layout">
          {/* Movie and Show Info Header */}
          <div className="show-info-header">
            <div className="movie-details-section">
              <h1 className="movie-title-main">{show.movie.title}</h1>
              <p className="theatre-info">
                <strong>{show.theatre.name}</strong> • {show.theatre.address}
              </p>
            </div>
            
            <div className="show-timing-section">
              <div className="timing-card">
                <div className="timing-item">
                  <span className="timing-label">Show:</span>
                  <span className="timing-value">{show.name}</span>
                </div>
                <div className="timing-item">
                  <span className="timing-label">Date & Time:</span>
                  <span className="timing-value">
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </span>
                </div>
                <div className="timing-item">
                  <span className="timing-label">Ticket Price:</span>
                  <span className="timing-value price">₹{show.ticketPrice}</span>
                </div>
                <div className="timing-item">
                  <span className="timing-label">Available:</span>
                  <span className="timing-value">
                    {show.totalSeats - show.bookedSeats.length} of {show.totalSeats} seats
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Selection Section */}
          <div className="seat-selection-section">
            <Card className="seat-selection-card">
              {getSeats()}
              
              {selectedSeats.length > 0 && (
                <div className="payment-section">
                  <StripeCheckout
                    token={onToken}
                    billingAddress
                    amount={selectedSeats.length * show.ticketPrice * 100}
                    stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
                  >                    <Button 
                      type="primary" 
                      className="pay-now-btn" 
                      size="large" 
                      block
                      loading={isBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? "Processing Payment..." : `Pay ₹${selectedSeats.length * show.ticketPrice} Now`}
                    </Button>
                  </StripeCheckout>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookShow;
