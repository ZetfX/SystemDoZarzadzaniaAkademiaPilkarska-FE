import "../../App.scss";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../loaders/FormLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ReactDropdown from "react-dropdown";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";

const MIN_LENGTH_REGEX = "^.{3,}$";

const API_CREATE_EVENT = "/admin-coach/createEvent/";
const API_EDIT_EVENT = "/admin-coach/editEvent/";
const API_GET_TRAINING_GROUPS = "/admin/allTrainingGroups/";
const API_GET_OBJECTS = "/admin-coach/allObjects/";
const API_DELETE_EVENT ="/admin-coach/deleteEvent/"
const API_GET_COACH_TRAINING_GROUP = "/coach/myTrainingGroup/";


const AddEventForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

    return date;
  }

  function parseToHalfHours(date) {
    if (date.getMinutes() < 30) {
      date.setMinutes(30);
    } else {
      const hour = date.getHours();
      date.setHours(hour + 1);
      date.setMinutes(0);
    }
    return date;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const academyId = user.academy.id;
  const userId = user.id;
  const axiosPrivate = useAxiosPrivate();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const titleRef = useRef();

  const [loading, setLoading] = useState(false);

  const [eventTitle, setTitle] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);
  const [validTitle, setValidTitle] = useState(false);

  const [organizer, setOrganizer] = useState("");

  const [eventDate, setEventDate] = useState({});

  const [eventStartTime, setEventStartTime] = useState(
    parseToHalfHours(new Date())
  );

  const [eventEndTime, setEventEndTime] = useState(
    parseToHalfHours(addHours(1))
  );

  const [object, setObject] = useState({});
  const [objects, setObjects] = useState([]);

  const [trainingGroup, setTrainingGroup] = useState({});
  const [trainingGroups, setTrainingGroups] = useState([]);

  const [validStartTime, setValidStartTime] = useState(true);
  const [validEndTime, setValidEndTime] = useState(true);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    setTitle(props?.event?.eventTitle);
  }, []);

  useEffect(() => {
    if (props?.event?.eventDate) {
      const parsedDate = new Date(props?.event?.eventDate);
      setEventDate(parsedDate);
    } else if (props.date) {
      setEventDate(props.date);
    }
  }, []);

  useEffect(() => {
    if (props?.event?.eventStart) {
      const parsedTime = new Date(props?.event?.eventStart);
      setEventStartTime(parsedTime);
    }
  }, []);

  useEffect(() => {
    if (props?.event?.eventEnd) {
      const parsedTime = new Date(props?.event?.eventEnd);
      setEventEndTime(parsedTime);
    }
  }, []);

  useEffect(() => {
    if (props?.event?.trainingGroup) {
      const trainingGroupData = {
        value: props?.event?.trainingGroup?.id,
        label: props?.event?.trainingGroup?.groupName,
      };
      setTrainingGroup(trainingGroupData);
    }
  }, []);

  useEffect(() => {
    if (props?.event?.organizer) {
      setOrganizer(
        props?.event?.organizer?.name + " " + props?.event?.organizer?.surname
      );
    }
  }, []);

  useEffect(() => {
    if (props?.event?.object) {
      const object = props?.event?.object;
      const objectData = {
        value: object?.id,
        label:
          object?.placeName +
          ", " +
          object?.street +
          " " +
          object?.zipCode +
          ", " +
          object?.city,
      };
      setObject(objectData);
    }
  }, []);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(eventTitle);
    setValidTitle(result);
  }, [eventTitle]);

  function handler(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  useEffect(() => {
    if(user.role ==="ADMIN"){
    getAllAcademyTrainingGroups();
    } 
    if(user.role === "COACH"){
      getCoachTrainingGroup();
    }
    
    
    
  }, []);

  useEffect(() => {
    getAllAcademyObjects();
  }, []);

  const getAllAcademyObjects = async () => {
    try {
      const response = await axiosPrivate.get(API_GET_OBJECTS + academyId);
      const data = response?.data?.objects;
      const modifiedData = data.map((result) => ({
        value: result.id,
        label:
          result.placeName +
          ", " +
          result.street +
          " " +
          result.zipCode +
          ", " +
          result.city,
      }));
      setObjects(modifiedData);
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        handleError("Nie można pobrać grup treningowych");
      }
    }
  };

  const getCoachTrainingGroup = async () => {
    try {

      const response = await axiosPrivate.get(
        API_GET_COACH_TRAINING_GROUP + userId
      );
      const data = response?.data.trainingGroup;
      setTrainingGroup(data);

    
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        handleError("Nie można pobrać grup treningowych");
      }
    }
  };

  const getAllAcademyTrainingGroups = async () => {
    try {
      const response = await axiosPrivate.get(
        API_GET_TRAINING_GROUPS + academyId
      );
      const data = response?.data?.trainingGroups;
      const modifiedData = data.map((result) => ({
        value: result.id,
        label: result.groupName,
      }));
      setTrainingGroups(modifiedData);
      setTimeout(function () {
        setLoading(false);
      }, 300);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
      } else {
        handleError("Nie można pobrać grup treningowych");
      }
    }
  };

  const handleError = (message) => {
    props.closeModal();
    setLoading(false);
    props.notifyError(message);
    document.removeEventListener("click", handler, true);
  };

  const isDataChanged = () => {
    var changedData = false;
    if (props?.event?.groupName !== eventTitle) {
      changedData = true;
    }
    if (props?.event?.startTime !== eventStartTime) {
      changedData = true;
    }
    if (props?.event?.endTime !== eventEndTime) {
      changedData = true;
    }
    if (props?.event?.trainingGroup?.id !== trainingGroup.value) {
      changedData = true;
    }

    if (props?.event?.object?.id !== object.value) {
      changedData = true;
    }

    return changedData;
  };

  const editEvent = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);


        const trainingGroupId = trainingGroup.value;
        const eventId = props?.event?.id;
        const objectId = object.value;
        const startTime = eventStartTime.getTime();
        const endTime = eventEndTime.getTime();
        const response = await axiosPrivate.put(
          API_EDIT_EVENT + eventId,
          JSON.stringify({
            eventDate,
            eventTitle,
            startTime,
            endTime,
            trainingGroupId,
            objectId
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano wydarzenie");
        document.removeEventListener("click", handler, true);
      } else {
        props.closeModal();
      }
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
        setLoading(false);
      } else if (error.response.status === 400) {
        handleError(error.response.data.message);
      }
      else {
        handleError("Nie można edytować wydarzenia");
      }
    }
  };
  const addEvent = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);

      const trainingGroupId = trainingGroup.value;
      const objectId = object.value;
      const startTime = eventStartTime.getTime();
      const endTime = eventEndTime.getTime();
      const response = await axiosPrivate.post(
        API_CREATE_EVENT,
        JSON.stringify({
          eventTitle,
          eventDate,
          startTime,
          endTime,
          trainingGroupId,
          objectId,
          organizerId: userId,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano wydarzenie");
      document.removeEventListener("click", handler, true);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
        setLoading(false);
      } else if (error.response.status === 400) {
        handleError(error.response.data.message);
      } else {
        handleError("Nie można dodać wydarzenia");
      }
    }
  };
  

  const deleteEvent = async (e) => {
    
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);

     const eventId= props?.event?.id
      const response = await axiosPrivate.delete(
        API_DELETE_EVENT + eventId
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie usunięto wydarzenie");
      document.removeEventListener("click", handler, true);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
        setLoading(false);
      } else if (error.response.status === 400) {
        handleError(error.response.data.message);
      } else {
        handleError("Nie można usunąć wydarzenia");
      }
    }
  };

  
  return (
    <>
      {loading ? (
        <FormLoader />
      ) : (
        <>
          <div className="add-form">
            <h1 className="add-form-title">
              {user.id === props?.event?.organizer?.id ? props.isEdit ? "Edytuj wydarzenie " : "Dodaj wydarzenie" : "Szczegóły wydarzenia"} 
            </h1>

            <label htmlFor="organizer" hidden={props?.isEdit ? "" : "hidden"}>
              Organizator: {organizer}{" "}
            </label>
            <div className="add-form-group">
              <label htmlFor="title">Tytuł wydarzenia</label>
              <input
                type="text"
                name="title"
                placeholder="tytuł wydarzenia"
                autoComplete="off"
                onChange={(e) => setTitle(e.target.value)}
                required
                pattern={MIN_LENGTH_REGEX}
                value={eventTitle}
                ref={titleRef}
                readOnly={
                  props?.isEdit
                    ? user.id === props?.event?.organizer?.id
                      ? ""
                      : "readonly"
                    : ""
                }
                onBlur={(e) => setTitleFocus(true)}
                focused={titleFocus.toString()}
              ></input>
              <span>Nazwa musi się składać z minimum 3 znaków</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="eventDate">
                Data wydarzenia : {eventDate.toLocaleString("pl-PL", options)}
              </label>

              <span>Nazwa musi się składać z minimum 3 znaków</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="startTime">Czas rozpoczęcia</label>
              <div className="time-picker">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopTimePicker
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    value={eventStartTime}
                    onChange={(newValue) => {
                      setEventStartTime(newValue);
                      if (newValue.getMinutes() % 30 !== 0) {
                        setValidStartTime(false);
                      } else {
                        setValidStartTime(true);
                      }
                    }}
                    ampm={false}
                    disabled={
                      props?.isEdit
                        ? user.id === props?.event?.organizer?.id
                          ? false
                          : true
                        : false
                    }
                    closeOnSelect={true}
                    minutesStep={30}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={
                          !validStartTime
                            ? "Wybrany czas musi być połowką godziny lub pełną godziną"
                            : null
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="add-form-group">
              <label htmlFor="endTime">Czas zakończenia</label>
              <div className="time-picker">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopTimePicker
                    value={eventEndTime}
                    onChange={(newValue) => {
                      setEventEndTime(newValue);
                      if (newValue.getMinutes() % 30 !== 0) {
                        setValidEndTime(false);
                      } else {
                        setValidEndTime(true);
                      }
                    }}
                    ampm={false}
                    closeOnSelect={true}
                    minutesStep={30}
                    disabled={
                      props?.isEdit
                        ? user.id === props?.event?.organizer?.id
                          ? false
                          : true
                        : false
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={
                          !validEndTime
                            ? "Wybrany czas musi być połowką godziny lub pełną godziną"
                            : null
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="add-form-group">
              <label htmlFor="trainingGroup">Grupa Treningowa: {user.role === "ADMIN" ? "" : trainingGroup.groupName } </label>
              {user.role === "ADMIN" &&
              <ReactDropdown
                disabled={
                  props?.isEdit
                    ? user.id === props?.event?.organizer?.id
                      ? false
                      : true
                    : false
                }
                options={trainingGroups}
                placeholder="wybierz grupe treningową"
                value={trainingGroup}
                onChange={(option) => setTrainingGroup(option)}
              />
            }
            </div>
            <div className="add-form-group">
              <label htmlFor="object">Obiekt</label>
              <ReactDropdown
                options={objects}
                placeholder="wybierz obiekt"
                value={object}
                onChange={(option) => setObject(option)}
                disabled={
                  props?.isEdit
                    ? user.id === props?.event?.organizer?.id
                      ? false
                      : true
                    : false
                }
              />
            </div>
            <div className="add-form-button">
              <button
                className="btn"
                hidden={props?.isEdit ? user.id === props?.event?.organizer?.id ? "" : "hidden" : ""}
                disabled={
                  !validTitle ||
                  !validStartTime ||
                  !validEndTime ||
                  Object.keys(trainingGroup).length === 0 ||
                  Object.keys(object).length === 0
                    ? true
                    : false
                }
                onClick={props.isEdit ? editEvent : addEvent}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} wydarzenie
              </button>
              <button className="btn" hidden={props?.isEdit && user.id === props?.event?.organizer?.id ? "" : "hidden"} onClick={deleteEvent}>
                Usuń wydarzenie
              </button>
            </div>
           
             
    
          </div>
        </>
      )}
    </>
  );
};
export default AddEventForm;
