const Booking = require("../models/Booking");

// Skapar en ny bokning
const createBooking = async (req, res) => {
  const { service, date, time, name, email, phone } = req.body;
  try {
    const booking = await Booking.create({
      service,
      date,
      time,
      name,
      email,
      phone,
      user: req.user._id, // Lägger till användar-ID från inloggningen
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hämtar alla bokningar för admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Uppdaterar status på bokning
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Bokning hittades inte" });
    }

    booking.status = req.body.status;  // Uppdaterar bokningens status
    await booking.save();

    res.json({ message: "Bokningsstatus uppdaterad", booking });
  } catch (error) {
    res.status(500).json({ message: "Kunde inte uppdatera bokningsstatus" });
  }
};




// Hämtar användarens egna bokningar
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

module.exports = { createBooking, getAllBookings, getUserBookings, updateBookingStatus };
