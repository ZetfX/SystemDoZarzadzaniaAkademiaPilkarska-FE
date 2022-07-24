import "../../App.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "../loaders/PageLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import AddEventForm from "./addEventForm";

import timeGridPlugin from '@fullcalendar/timegrid'

const API_ALL_EVENTS = "/admin-coach/allEvents/";
const API_GET_EVENT_BY_ID = "/admin-coach/getEventById/"
const API_ALL_EVENTS_BY_TRAINING_GROUP = "/admin-coach/allEventsByTrainingGroup/"

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const errorRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [events, setEvents] = useState([])

  const [selectedEvent, setSelectedEvent] = useState({});

  const [selectedDate, setSelectedDate] = useState();

  const [showModal, setShowModal] = useState(false);
  const [blur, setBlur] = useState(false);
  const user =JSON.parse(localStorage.getItem("user"))
  const userRole= user.role;
  const academyId = user.academy.id;
  const controller = new AbortController();

  useEffect(() => {
    let isMounted = true;
    if(userRole ==="COACH" || userRole ==="CASUAL_USER"){
      getAllAcademyEventsByTrainingGroup(isMounted, controller)
    }
    else{
    getAllAcademyEvents(isMounted, controller);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const reloadData = () => {
    let isMounted = true;
    if(userRole ==="COACH" || userRole ==="CASUAL_USER"){
      getAllAcademyEventsByTrainingGroup(isMounted, controller)
    }
    else{
    getAllAcademyEvents(isMounted, controller);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setBlur(false);
  };
  const notifyError = (text) => {
    toast.error(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };
  const notifySuccess = (text) => {
    toast.success(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const getAllAcademyEvents = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_ALL_EVENTS + academyId, {
        signal: controller.signal,
      });
      const data = response?.data?.events;
      const modifiedData = data.map((result) => ({
        id : result.id,
        title: result.eventTitle,
        start: result.eventStart,
        end: result.eventEnd,

      }));
      isMounted && setEvents(modifiedData);
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        setErrMsg(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        setErrMsg("Nie można pobrać wydarzeń");
      }
      errorRef.current.focus();
    }
  };

  const getAllAcademyEventsByTrainingGroup = async (isMounted, controller) => {
    try {
      const response = await axiosPrivate.get(API_ALL_EVENTS_BY_TRAINING_GROUP +user.id, {
        signal: controller.signal,
      });
      const data = response?.data?.events;
      const modifiedData = data.map((result) => ({
        id : result.id,
        title: result.eventTitle,
        start: result.eventStart,
        end: result.eventEnd,

      }));
      isMounted && setEvents(modifiedData);
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        setErrMsg(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        setErrMsg("Nie można pobrać wydarzeń");
      }
      errorRef.current.focus();
    }
  };
 

  const handleDateClick = (e) => {
    if(userRole === "CASUAL_USER")
    {
      return
    }
    document.getElementById("fc-container").style.pointerEvents = "none";
    setSelectedDate(e.date);
    setShowModal(true);
    setBlur(true);
    setIsEdit(false);

    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleEventClick = async (e) => {
    document.getElementById("fc-container").style.pointerEvents = "none";
    const eventId =e.event._def.publicId
    const response = await axiosPrivate.get(API_GET_EVENT_BY_ID + eventId);
    const data = response?.data
    console.log(data);
    setSelectedEvent(data)

    setShowModal(true);
    setBlur(true);
    setIsEdit(true);
    document
      .getElementById("main")
      .addEventListener("click", handleOutsideClick);
  };

  const handleOutsideClick = (e) => {
    setShowModal(false);
    setBlur(false);
    document
      .getElementById("main")
      .removeEventListener("click", handleOutsideClick);
    setSelectedEvent([]);
    document.getElementById("fc-container").style.pointerEvents = "auto";
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="modal-wrapper">
            {showModal && (
              <AddEventForm
                reloadData={reloadData}
                closeModal={closeModal}
                notifyError={notifyError}
                notifySuccess={notifySuccess}
                isEdit={isEdit}
                event={selectedEvent}
                date={selectedDate}
              />
            )}
          </div>
          <div
            id="main"
            className={blur ? "main-container-blur" : "main-container"}
          >
            <div id="fc-container" className="fc-container">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                locale={plLocale}
                initialView="timeGridWeek"
                height={850}
                events={events}
                headerToolbar ={{
                  left:'prev,next today',
                  center:'title',
                  right: 'timeGridWeek,dayGridMonth'
                }}
                dateClick={handleDateClick}
                eventClick={(e) =>handleEventClick(e)}
              />
            </div>
          </div>
          <div>
            <ToastContainer />
          </div>
        </>
      )}
      ;
    </>
  );
};

export default Events;
