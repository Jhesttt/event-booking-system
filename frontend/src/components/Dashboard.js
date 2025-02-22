// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import { Building2, CalendarPlus } from "lucide-react";
import axios from "axios";
import styles from "./Dashboard.module.css";
import CustomCalendar from "./CustomCalendar";
import logo from "../assets/urslogo.png";
import logout from "../assets/logout.svg";
import EventModal from "./EventModal";
import Slideshow from "./Slideshow";
import CouncilDisplayedit from "./CouncilDisplayedit";
import ReportForm from "./ReportForm";
import eventsVector from "../assets/Events-pana.svg";
import reportVector from "../assets/report.svg";
import { toast } from "sonner";

const Dashboard = () => {
  const loggedInUser = { id: 1 };
  const navigate = useNavigate();
  const userDetails = {
    username: "exampleUser",
    loggedInTime: new Date().toLocaleString(),
  };

  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState("New Booking");
  const [newSidebarSelection, setNewSidebarSelection] =
    useState("Dashboard Overview");
  const [organization, setOrganization] = useState('');
  const [eventData, setEventData] = useState({
    fromHour: "",
    fromMinute: "00",
    fromAmPm: "", // No default AM/PM
    toHour: "",
    toMinute: "00",
    toAmPm: "", // No default AM/PM
    venue: "",
    name: "",
    organization: "",
    fromDate: "",
    toDate: "",
    duration: "",
    document: null,
    poster: null,
  });



  useEffect(() => {
    const storedOrganization = localStorage.getItem("userOrganization");
    if (storedOrganization) {
      setOrganization(storedOrganization);
    }
  }, []);

  useEffect(() => {
    setEventData((prev) => ({
      ...prev,
      organization: organization, // Update eventData with the organization
    }));
  }, [organization]);

  useEffect(() => {
    setEventData((prev) => ({
      ...prev,
      venue: "Court", // Update eventData with the organization
    }));
  }, []);



  const handleLogout = () => {
    sessionStorage.clear();

    navigate("/login", { replace: true });
  };

  const renderSidebarContent = () => {
    switch (selectedSidebar) {
      case "New Booking":
        return <p>Form to create a new booking.</p>;
      case "Events":
        return (
          <div>
            <p>Upcoming events information.</p>
            <button
              className={styles.addEventButton}
              onClick={() => setModalOpen(true)}
            >
              Add Event
            </button>
          </div>
        );
      case "Report":
        return (
          <div>
            <ReportForm userId={loggedInUser.id} />{" "}
            {/* Pass userId to the ReportForm */}
          </div>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const convertTo24Hour = (time, ampm) => {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (ampm === "PM" && hours !== 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  };

  const convertDatabaseDateToFormattedDate = (date) => {
    const newDate = new Date(date); // Convert to JavaScript Date object
    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = newDate.getFullYear();
    return `${year}/${month}/${day}`;
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    // Ensure all time values are selected before proceeding
    if (
      eventData.fromHour &&
      eventData.fromMinute &&
      eventData.fromAmPm &&
      eventData.toHour &&
      eventData.toMinute &&
      eventData.toAmPm
    ) {
      const userFrom = convertTo24Hour(
        eventData.fromHour + ":" + eventData.fromMinute,
        eventData.fromAmPm
      );
      const userTo = convertTo24Hour(
        eventData.toHour + ":" + eventData.toMinute,
        eventData.toAmPm
      );

      const minTime = { hours: 7, minutes: 0 };  // 7:00 AM
      const maxTime = { hours: 17, minutes: 0 }; // 5:00 PM

      const userFromDate = new Date(eventData.fromDate);
      const userToDate = eventData.toDate ? new Date(eventData.toDate) : null;

      const isTwoDayEvent = userToDate && (userToDate.getDate() === userFromDate.getDate() + 1);

      if (userToDate) {
        let currentDate = new Date(userFromDate);
        while (currentDate <= userToDate) {
          if (currentDate.getDay() === 6) { // 6 = Saturday
            // Allow only if it's a single-day event on Saturday
            if (!(userFromDate.getTime() === userToDate.getTime())) {
              toast.error("Events cannot span across a Saturday.", { duration: 4000 });
              return;
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      // **New Validation: If event starts on a Saturday, it must end on the same Saturday**
      if (userFromDate.getDay() === 6) { // 6 = Saturday
        if (!userToDate || userToDate.getTime() !== userFromDate.getTime()) {
          toast.error("Events starting on Saturday must also end on Saturday.", { duration: 4000 });
          return;
        }
      }

      // Validation: Ensure `toDate` is not earlier than `fromDate`
      if (userToDate && userToDate < userFromDate) {
        toast.error("`To Date` cannot be earlier than `From Date`.", { duration: 4000 });
        return;
      }

      // Validate the time range
      if (
        userFrom.hours < minTime.hours ||
        (userFrom.hours === minTime.hours && userFrom.minutes < minTime.minutes)
      ) {
        toast.error("Start time must be 7:00 AM or later.", { duration: 4000 });
        return;
      }

      if (
        userTo.hours > maxTime.hours ||
        (userTo.hours === maxTime.hours && userTo.minutes > maxTime.minutes)
      ) {
        toast.error("End time must be 5:00 PM or earlier.", { duration: 4000 });
        return;
      }

      if (
        !isTwoDayEvent &&
        (userTo.hours < userFrom.hours ||
          (userTo.hours === userFrom.hours && userTo.minutes < userFrom.minutes))
      ) {
        toast.error("End time cannot be earlier than start time unless it's a two-day event.", {
          duration: 4000,
        });
        return;
      }

      // Format the start and end times into a readable string
      const fromTime = `${String(eventData.fromHour).padStart(2, "0")}:${String(
        eventData.fromMinute
      ).padStart(2, "0")} ${eventData.fromAmPm || "AM"}`;
      const toTime = `${String(eventData.toHour).padStart(2, "0")}:${String(
        eventData.toMinute
      ).padStart(2, "0")} ${eventData.toAmPm || "AM"}`;

      const duration = `${fromTime} to ${toTime}`;
      console.log("Event Duration:", duration);

      try {
        console.log("Checking for overlapping events...");

        // Fetch all approved events from the server
        const response = await axios.get("https://event-booking-system-ckik.onrender.com/api/approved");
        const approvedEvents = response.data;

        // Validate for conflicts
        for (let event of approvedEvents) {
          const savedStartDate = new Date(event.date);
          const savedEndDate = event.datefrom ? new Date(event.datefrom) : savedStartDate;

          if (event.venue === eventData.venue) {
            if (
              userFromDate <= savedEndDate &&
              (!userToDate || userToDate >= savedStartDate)
            ) {
              console.log("Date conflict found with event:", event);

              const [savedFrom, savedTo] = event.duration.split(' to ');
              const savedFromTime = convertTo24Hour(savedFrom.split(' ')[0] + ":" + savedFrom.split(' ')[1], savedFrom.split(' ')[2]);
              const savedToTime = convertTo24Hour(savedTo.split(' ')[0] + ":" + savedTo.split(' ')[1], savedTo.split(' ')[2]);

              if (
                (userFrom.hours < savedToTime.hours ||
                  (userFrom.hours === savedToTime.hours &&
                    userFrom.minutes < savedToTime.minutes)) &&
                (userTo.hours > savedFromTime.hours ||
                  (userTo.hours === savedFromTime.hours &&
                    userTo.minutes > savedFromTime.minutes))
              ) {
                const errorMessage =
                  "The selected time overlaps with an existing event at the same venue.";
                console.error(errorMessage, event);
                toast.error(errorMessage, { duration: 4000 });
                return;
              }
            }
          }
        }

        console.log("No conflicts found. Proceeding to save event...");

        const formData = new FormData();
        formData.append("venue", eventData.venue);
        formData.append("name", eventData.name);
        formData.append("organization", eventData.organization);
        formData.append("date", eventData.fromDate);

        if (eventData.toDate) {
          formData.append("datefrom", eventData.toDate);
        }

        formData.append("duration", duration);
        formData.append("document", eventData.document);
        formData.append("poster", eventData.poster);

        try {
          const postResponse = await axios.post(
            "https://event-booking-system-ckik.onrender.com/api/events",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (postResponse.status === 200) {
            console.log("Event successfully saved to the database:", postResponse.data);
            toast.success("Event successfully added", { duration: 4000 });
            setError(null);
            setModalOpen(false);
          }
        } catch (postError) {
          console.error("Error saving event to database:", postError);
          toast.error("Error saving event.", { duration: 4000 });
        }
      } catch (fetchError) {
        console.error("Error during validation:", fetchError);
        toast.error("Failed to validate event details", { duration: 4000 });
      }
    } else {
      console.warn("Incomplete time fields provided by the user.");
      toast.error("Please fill in all time fields correctly", { duration: 4000 });
    }
  };




  return (
    <div>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <div className={styles.titleflex}>
            <h1 className={styles.title}>
              University of Rizal System - Antipolo Campus
            </h1>
            <h1 className={styles.subtitle}>Event Booking System</h1>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <img src={logout} className={styles.logoutIcon} />
          <p>Logout</p>
        </button>
      </nav>
      <div className={styles.container}>
        <div className={styles.SecondContainer}>
          <div className={styles.heroSection}>
            <div className={styles.welcomeCont}>
              <div className={styles.headers}>
                <h1>URSAC Event Booking System</h1>
                <p>Easily book and manage events at URS Antipolo Campus. Plan gatherings, reserve venues, and track schedules in one place.</p>
              </div>
              <button
                className={styles.getStartedBtn}
                onClick={() => {
                  const element = document.getElementById('book');
                  const yOffset = -150; // Adjust this value to control the offset
                  const yPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                  window.scrollTo({ top: yPosition, behavior: 'smooth' });
                }}
              >
                Get Started
              </button>
            </div>
            {/* <div className={styles.ssCont}> */}
            <Slideshow />
            {/* </div> */}
          </div>
          <div className={styles.calendar}>
            <h1>Campus Calendar</h1>
            <CustomCalendar />
          </div>
          <div className={styles.bookingCont} id="book">
            <div className={styles.bookingContent}>
              <h1 className={styles.bookingHead}>
                Book your organization events with ease!
              </h1>
              <p className={styles.bookingSubhead}>
                Simplify event reservations in just a few clicks. The event
                should be at least 2 weeks ahead from today.
              </p>
              <div className={styles.buttonFlex}>
                <button
                  className={styles.addEventButton}
                  onClick={() => setModalOpen(true)}
                >
                  Add Event
                </button>
              </div>
            </div>
            <div className={styles.illustrationCont}>
              <img
                src={eventsVector}
                alt="eventVector"
                className={styles.eventVector}
              />
            </div>
          </div>
          <div className={styles.reportCont}>
            <div className={styles.reportIllustration}>
              <img src={reportVector} alt="" className={styles.eventVector} />
            </div>
            <div className={styles.reportContent}>
              <h1 className={styles.bookingHead}>
                Got any inquiries?
              </h1>
              <p className={styles.bookingSubhead}>
                Send us a message including your organization name and we'll respond through your email.
              </p>
              <ReportForm userId={loggedInUser.id} />
            </div>
          </div>
          {/* <div className={styles.venueBooklistContainer}>
            <h2 className={styles.header}>
              <CalendarPlus size={20} color="#063970" /> Venue Booklist
            </h2>
            <div className={styles.sidebarLayout}>
              <div className={styles.sidebarContainer}>
                <div className={styles.sidebarr}>
                  {["Events", "Report"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedSidebar(item)}
                      className={{
                        ...styles.sidebarButton,
                        backgroundColor:
                          selectedSidebar === item ? "#0e4296" : "transparent",
                        color: selectedSidebar === item ? "#fff" : "#0e4296",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className={styles.sidebarContent}>
                  <h3>{selectedSidebar}</h3>
                  {renderSidebarContent()}
                  <img src={eventsVector} alt="eventVector" className={styles.eventVector} />
                </div>
              </div>
            </div>
          </div> */}

          {/* News and Information Section (on the right) */}
          <div className={styles.layoutContainer}>
            <CouncilDisplayedit />
          </div>

          {/* Merged Vision and Mission Section */}
          <div className={styles.mergedSection}>
            <h3 className={styles.vgmoHeader}>Vision</h3>
            <p className={styles.vgmo}>
              The leading University in human resource development, knowledge
              and technology generation, and environmental stewardship.
            </p>
            <h3 className={styles.vgmoHeader}>Mission</h3>
            <p className={styles.vgmo}>
              The University of Rizal System is committed to nurture and produce
              upright and competent graduates and empowered community through
              relevant and sustainable higher professional and technical
              instruction, research, extension, and production services.
            </p>
            <h3 className={styles.vgmoHeader}>Core Values</h3>
            <p>R – Responsiveness</p>
            <p>I – Integrity</p>
            <p>S – Service</p>
            <p>E – Excellence</p>
            <p className={styles.vgmo}>S – Social Responsibility</p>
            <h3 className={styles.vgmoHeader}>Quality Policy</h3>
            <p className={styles.vgmo}>
              The University of Rizal System commits to deliver excellent
              products and services to ensure total stakeholders’ satisfaction
              in instruction, research, extension, production and dynamic
              administrative support and to continuously improve its Quality
              Management System processes to satisfy all applicable
              requirements.
            </p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} University of Rizal Sytem Antipolo
          Campus<br></br> All rights reserved.
        </p>
      </footer>
      {/* Event Modal */}
      <EventModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        eventData={eventData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleModalSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Dashboard;
