/***
 * SMTP servers = simple mail transfer protocol
 * how smtp servers works
 *  1. writing the email ( composing the letter)
 * 2. sending to SMTP server ( dropping at the post office )
 * 3. routing the email ( post office will route the email to the destination)
 * 4. recipient email serv ( destination post office)
 * 5. emai; deliver ( mailbox deliver)
 *
 * nodemailer
 */

const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const User = require("../models/userModel");
const { validatePayment, validateBooking, validateMongoId } = require("../middlewares/validationMiddleware");
const { paymentLimiter } = require("../middlewares/rateLimitMiddleware");
const EmailHelper = require("../utils/emailHelper");

router.post("/make-payment", paymentLimiter, authMiddleware, ...validatePayment, async (req, res) => {
  try {
    const { token, amount } = req.body;
    
    // Create a PaymentIntent with modern Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Movie Ticket Booking",
      metadata: {
        integration_check: "accept_a_payment",
      },
    });

    const transactionId = paymentIntent.id;
    res.send({
      success: true,
      message: "Payment Intent Created Successfully",
      data: {
        transactionId: transactionId,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/book-show", authMiddleware, ...validateBooking, async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    
    // Get detailed show information for email
    const show = await Show.findById(req.body.show)
      .populate("movie")
      .populate("theatre");
    
    const user = await User.findById(req.body.user);
    
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, {
      bookedSeats: updatedBookedSeats,
    });

    // Send booking confirmation email
    try {
      const emailData = {
        customerName: user.name,
        bookingId: newBooking._id,
        movieTitle: show.movie.title,
        theatreName: show.theatre.name,
        showDate: new Date(show.date).toLocaleDateString(),
        showTime: show.time,
        seats: req.body.seats,
        totalAmount: (req.body.totalPrice / 100).toFixed(2), // Convert from cents
        transactionId: req.body.transactionId || 'N/A'
      };
      
      await EmailHelper("booking-confirmation.html", user.email, emailData);
    } catch (emailError) {
      console.log("Email sending failed:", emailError);
      // Don't fail the booking if email fails
    }

    res.send({
      success: true,
      message: "Booking Successful",
      data: newBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/get-all-bookings/:userId", authMiddleware, ...validateMongoId('userId'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });
    res.send({
      success: true,
      message: "All bookings fetched",
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
