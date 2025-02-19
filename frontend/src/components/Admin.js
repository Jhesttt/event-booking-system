import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "./Admin.module.css";
import CouncilsAndOrganizations from "./CouncilsAndOrganizations";
import EventTable from "./EventTable";
import AddUserModal from "./AddUserModal";
import EventTableapproved from "./EventTableapproved";
import logo from "../assets/urslogo.png";
import {
  House,
  Building2,
  CalendarPlus,
  CalendarCheck,
  Users,
  User,
  FilePenLine,
} from "lucide-react";
import AdminPanel from "./AdminPanel";
import EventHistory from "./EventHistory";
import ReportForm from "./ReportForm";
import { FaHistory } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import logout from "../assets/logout.svg";
import { FaBars } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import UserEdit from "./UserEdit";




const Admin = () => {
  const [showAddCouncilForm, setShowAddCouncilForm] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Events");
  const [events, setEvents] = useState([]);
  const [councils, setCouncils] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobile, setMobile] = useState("")
  const navigate = useNavigate();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const modalRef = useRef(null); //Pang approve
  const dialogRef = useRef(); //Pang delete
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenMenu = () => {
    setMobile("mobile")
  }

  const handleCloseMenu = () => {
    setMobile("")
  }

  useEffect(() => {
    if (activeComponent === "Events") {
      const fetchEvents = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/events");
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [activeComponent]);
  // Fetch councils from the backend API when 'councils' is selected
  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/councils");
        const data = await response.json();

        if (response.ok) {
          setCouncils(data); // Set councils state with fetched data
        } else {
          console.error("Failed to fetch councils:", data.message);
        }
      } catch (error) {
        console.error("Error fetching councils:", error);
      }
    };

    if (activeComponent === "Councils") {
      fetchCouncils();
    }
  }, [activeComponent]);
  // Fetch users from the backend API when 'users' is selected
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();

        if (response.ok) {
          setUsers(data); // Set Users state with fetched data
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (activeComponent === "Users") {
      fetchUsers();
    }
  }, [activeComponent]);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (user) => {
    // You can implement the logic for opening an edit modal or populating an edit form with user data.
    console.log("Edit user:", user);
    // Open your edit modal or perform any necessary actions.
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events") // Update URL to point to the correct port
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  //user delete button
  const handleDeleteUser = (user) => {
    // Show a confirmation dialog before proceeding with the deletion
    const isConfirmed = window.confirm(
      `Do you really want to delete the account of user: ${user.username}? This action cannot be undone.`
    );

    if (isConfirmed) {
      console.log("User to be deleted:", user.username);

      // Send DELETE request to the backend with the username
      fetch(`http://localhost:5000/users-delete/${user.username}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log(`User ${user.username} deleted successfully`);
            // Remove the deleted user from the UI by filtering it out from the users array
            setUsers((prevUsers) =>
              prevUsers.filter((u) => u.username !== user.username)
            );
          } else {
            alert("Failed to delete user");
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("An error occurred while deleting the user");
        });
    } else {
      console.log("User deletion canceled");
    }
  };

  const openDeleteModal = (eventId, organization) => {
    setSelectedEvent({ eventId, organization });
    dialogRef.current.showModal();
  };

  // para sa delete button
  const handleDelete = async (eventId) => {
    console.log('Attempting to delete event with ID:', eventId);

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
        // Step 1: Fetch the organization from the event
        const orgResponse = await fetch(`http://localhost:5000/api/events/${eventId}/organization`);
        const orgData = await orgResponse.json();

        if (!orgResponse.ok || !orgData.organization) {
            console.error('Failed to fetch organization:', orgData.message);
            alert('Failed to fetch organization for event.');
            return;
        }

        const organization = orgData.organization; // Extract organization name
        console.log(`Organization found: ${organization}`);

        // Step 2: Delete the event
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseBody = await response.json();
        console.log('Response body:', responseBody);

        if (response.ok) {
            // Step 3: Notify the organization about the deletion
            console.log(`Notifying organization: ${organization}`);
            await sendEventNotification(organization, eventId); // Send email notification

            alert('Event deleted successfully');
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId)); // Remove event from UI
        } else {
            console.error('Delete failed:', responseBody);
            alert(`Failed to delete event: ${responseBody.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
    }
};


// Function to send notification to the organization
const sendEventNotification = async (organization, eventId) => {
    try {
        const response = await fetch('http://localhost:5000/api/send-event-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ organization, eventId }),
        });

        const responseBody = await response.json();
        console.log('Notification Response:', responseBody);
        if (response.ok) {
            console.log('Notification sent to organization email');
        } else {
            console.error('Failed to send notification:', responseBody.message);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


  const openApproveModal = (eventId) => {
    setSelectedEventId(eventId);
    modalRef.current?.showModal(); // Open the modal
  };

  const closeApproveModal = () => {
    modalRef.current?.close(); // Close the modal
    setSelectedEventId(null);
  };

  const handleConfirm = async (eventId) => {
    console.log('Attempting to approve event with ID:', eventId);

    const confirmed = window.confirm('Are you sure you want to approve this event?');
    if (!confirmed) return;

    try {
        // Fetch the organization first
        const orgResponse = await fetch(`http://localhost:5000/api/fetchpendingapproved/${eventId}`);
        const orgData = await orgResponse.json();

        if (!orgResponse.ok) {
            console.error('Error fetching organization:', orgData.message);
            alert(`Error fetching organization: ${orgData.message}`);
            return;
        }

        const organization = orgData.organization;
        console.log('Fetched organization:', organization);

        // Approve the event
        const response = await fetch(`http://localhost:5000/api/events/approve/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseBody = await response.json();
        console.log('Response body:', responseBody);

        if (response.ok) {
            console.log('Approve response:', responseBody);

            // Send approval notification
            console.log(`Notifying organization: ${organization}`);
            await sendApprovedNotification(organization, eventId);

            alert('Event approved successfully and email sent!');
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } else {
            console.error('Approval failed:', responseBody);
            alert(`Failed to approve event: ${responseBody.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error approving event:', error);
        alert('Error approving event');
    }
};


// Function to send email notification to the organization
const sendApprovedNotification = async (organization, eventId) => {
    try {
        const response = await fetch('http://localhost:5000/api/send-approved-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ organization, eventId }),
        });

        const responseBody = await response.json();
        console.log('Notification Response:', responseBody);
        if (response.ok) {
            console.log('Notification sent to organization email');
        } else {
            console.error('Failed to send notification:', responseBody.message);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


  const handleLogout = () => {
    sessionStorage.clear();

    navigate("/login", { replace: true });
  };
  const handleViewDocument = (documentName) => {
    // Construct the URL for the document in the 'uploads' folder
    const fullDocumentUrl = `http://localhost:5000/uploads/${documentName}`;

    // Log the URL for debugging
    console.log("Document URL:", fullDocumentUrl);

    // Set the document and show modal
    setSelectedDocument(fullDocumentUrl);
    setSelectedDocumentName(documentName);
    setShowDocumentModal(true);
  };
  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
    setSelectedDocumentName(null); // Reset the document name when closing
  };
  const handleViewImage = (imageName) => {
    // Construct the URL for the image in the 'uploads' folder
    const fullImageUrl = `http://localhost:5000/uploads/${imageName}`;

    // Log the URL for debugging
    console.log("Image URL:", fullImageUrl);

    // Set the image and show modal
    setSelectedDocument(fullImageUrl); // Reusing the same state for simplicity
    setSelectedDocumentName(imageName); // Reusing the same state for image name
    setShowDocumentModal(true);
  };
  const handleButtonHover = (event, isHovering) => {
    if (isHovering) {

    } else {

    }
  };

  // Function to render the selected content in the main content area
  const renderContent = () => {
    switch (activeComponent) {
      case "Events":
        return (
          <div className={styles.adminContainer}>
            <div className={styles.eventtablecontainer}>
              <EventTable
                events={events}
                openApproveModal={openApproveModal}
                openDeleteModal={openDeleteModal}
                handleViewDocument={handleViewDocument}
                handleViewImage={handleViewImage}
                handleConfirm={handleConfirm}
                handleDelete={handleDelete}
                handleButtonHover={handleButtonHover}
              />
            </div>
            {/* Document Modal */}
            {showDocumentModal && (
              <div
                className={styles.modalBackdrop}
                onClick={handleCloseDocumentModal}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>{selectedDocumentName}</h3>{" "}
                  {/* Display the document name */}
                  {selectedDocumentName?.endsWith(".pdf") ? (
                    <Worker
                      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                    >
                      <Viewer fileUrl={selectedDocument} />
                    </Worker>
                  ) : (
                    <img
                      src={selectedDocument}
                      alt={selectedDocumentName}
                      className={{ width: "100%", height: "auto" }}
                    />
                  )}
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseDocumentModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            <dialog ref={modalRef} className={styles.modal}>
              <div className={styles.modalBox}>
                <FaRegCheckCircle className={styles.modalIcon} />
                <p>Are you sure you want to approve this event?</p>
                <div className={styles.modalButtons}>
                  <button onClick={closeApproveModal}>Cancel</button>
                  <button onClick={handleConfirm}>Confirm</button>
                </div>
              </div>
            </dialog>
            <dialog ref={dialogRef} className={styles.modal}>
              <div className={styles.modalBox}>
                <FaRegTimesCircle className={`${styles.modalIcon} ${styles.deleteIcon}`} />
                <p>Are you sure you want to delete this event?</p>
                <div className={`${styles.modalButtons} ${styles.deleteBtn}`}>
                  <button onClick={() => dialogRef.current.close()}>Cancel</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </dialog>
          </div>
        );
      case "ApproveEvents":
        return <EventTableapproved />;
      case "Councils":
        return (
          <div>
            {/* Your other Admin content */}
            <CouncilsAndOrganizations
              councils={councils}
              setCouncils={setCouncils}
              showAddCouncilForm={showAddCouncilForm}
              setShowAddCouncilForm={setShowAddCouncilForm}
            />
          </div>
        );
        case "Users":
          return (
            <div className={styles.usersCont}>
              <h2>Users</h2>
              <p>Create and manage accounts.</p>
        
              {/* Search Bar */}
              <div className={styles.searchContainer}>
                <div className={styles.searchWrap}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchBar}
                  />
                  <FaSearch className={styles.searchIcon} />
                </div>
                <button className={styles.addCouncilButton} onClick={() => setIsModalOpen(true)}>
                  <FaPlus /><span>Create New User</span>
                </button>
              </div>
        
              <div>
                <AddUserModal
                  isOpen={isModalOpen}
                  closeModal={() => setIsModalOpen(false)}
                  addUser={handleAddUser}
                />
              </div>
        
              {/* User Edit Modal */}
              {isEditModalOpen && (
                <UserEdit
                  isOpen={isEditModalOpen}
                  closeModal={() => setIsEditModalOpen(false)}
                  userData={currentUser}
                />
              )}
        
              <div className={styles.sectionBox}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeader}>
                      <th className={styles.tableCell}>Name</th>
                      <th className={styles.tableCell}>Organization</th>
                      <th className={styles.tableCell}>Username</th>
                      <th className={styles.tableCell}>Email</th>
                      <th className={styles.tableCell}>Password</th>
                      <th className={styles.tableCell}>Action</th>
                    </tr>
                  </thead>
        
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{user.name}</td>
                          <td className={styles.tableCell}>{user.organizationz}</td>
                          <td className={styles.tableCell}>{user.username}</td>
                          <td className={styles.tableCell}>{user.email}</td>
                          <td className={styles.tableCell}>{user.password}</td>
                          <td className={styles.tableCell}>
                            <div className={styles.actions}>
                            <button
  className={styles.editButton}
  onClick={() => {
    console.log("Editing user:", user); // 🟢 Debugging
    setCurrentUser(user); // ✅ Pass selected user
    setIsEditModalOpen(true); // ✅ Open modal
  }}
>
  <FaPen className={styles.pen} />
</button>


                              <button className={styles.deleteButton} onClick={() => handleDeleteUser(user)}>
                                <FaTrash className={styles.trash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className={styles.noEvents}>
                          No users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );

      case "Reports":
        return (
          <div className={styles.queriesCont}>
            <h2>Queries</h2>
            <p>Review user queries, feedbacks, or reports.</p>
            <AdminPanel />
          </div>
        );
      case "History":
        return (
          <EventHistory />
        );
      default:
        return (
          <div className={styles.adminContainer}>
            <div className={styles.eventtablecontainer}>
              <EventTable
                events={events}
                handleViewDocument={handleViewDocument}
                handleViewImage={handleViewImage}
                handleConfirm={handleConfirm}
                handleDelete={handleDelete}
                handleButtonHover={handleButtonHover}
              />
            </div>
            {/* Document Modal */}
            {showDocumentModal && (
              <div
                className={styles.modalBackdrop}
                onClick={handleCloseDocumentModal}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>{selectedDocumentName}</h3>{" "}
                  {/* Display the document name */}
                  {selectedDocumentName?.endsWith(".pdf") ? (
                    <Worker
                      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                    >
                      <Viewer fileUrl={selectedDocument} />
                    </Worker>
                  ) : (
                    <img
                      src={selectedDocument}
                      alt={selectedDocumentName}
                      className={{ width: "100%", height: "auto" }}
                    />
                  )}
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseDocumentModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
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
        <FaBars className={styles.menuBtn} onClick={handleOpenMenu} />

        <button className={styles.logoutButton} onClick={handleLogout}>
          <img src={logout} className={styles.logoutIcon} />
          <p>Logout</p>
        </button>
      </nav>

      {/* Sidebar and main content */}
      <div className={styles.main}>
        {/* Sidebar */}
        <div className={`${styles.sidenavOverlay} ${styles[mobile]}`} onClick={handleCloseMenu}>
          <aside className={styles.sidebar}>
            <div className={styles.logoMobileCont}>
              <img src={logo} alt="Logo" className={styles.logoMobile} />
              <div className={styles.titleflex}>
                <h1 className={styles.title}>
                  University of Rizal System
                </h1>
                <h1 className={styles.subtitle}>Event Booking System</h1>
              </div>
            </div>
            <ul className={styles.sidebarList}>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "Events" ? styles.activeSidebarItem : ""
                  }`}
                onClick={() => setActiveComponent("Events")}
              >
                <CalendarPlus size={20} color="#f2f8ff" />
                <span>Event Requests</span>
              </li>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "ApproveEvents"
                  ? styles.activeSidebarItem
                  : ""
                  }`}
                onClick={() => setActiveComponent("ApproveEvents")}
              >
                <CalendarCheck size={20} color="#f2f8ff" />
                <span>Upcoming Events</span>
              </li>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "Councils" ? styles.activeSidebarItem : ""
                  }`}
                onClick={() => setActiveComponent("Councils")}
              >
                <Users size={20} color="#f2f8ff" />
                <span>Councils and Organizations</span>
              </li>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "Users" ? styles.activeSidebarItem : ""
                  }`}
                onClick={() => setActiveComponent("Users")}
              >
                <User size={20} color="#f2f8ff" />
                <span>Users</span>
              </li>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "Reports" ? styles.activeSidebarItem : ""
                  }`}
                onClick={() => setActiveComponent("Reports")}
              >
                <FilePenLine size={20} color="#f2f8ff" />
                <span>Reports</span>
              </li>
              <li
                className={`${styles.sidebarItem} ${activeComponent === "History" ? styles.activeSidebarItem : ""
                  }`}
                onClick={() => setActiveComponent("History")}
              >
                <FaHistory size={20} color="#f2f8ff" />
                <span>History</span>
              </li>
            </ul>
          </aside>

        </div>
        {/* Main Content Area */}
        <main className={styles.content}>{renderContent()}</main>
      </div>
    </div>
  );
};

export default Admin;
