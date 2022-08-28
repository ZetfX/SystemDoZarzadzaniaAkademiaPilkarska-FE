import "../../../App.scss";
import { useRef, useState, useEffect } from "react";
import ReactDropdown from "react-dropdown";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../../loaders/FormLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const NAME_SURNAME_REGEX =
  "([A-ZĄĆĘŁŃÓŚŹŻ][-,a-ząćęłńóśTtUuWwYyZzŹźŻż. ']+[ ]*)+";
const PESEL_REGEX = "^[0-9]{11}$";
const TELEPHONE_NUMBER_REGEX =
  "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{3,6}$";
const EMAIL_REGEX = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

const API_CREATE_COACH = "/admin/createCoach";
const API_EDIT_COACH = "/admin/editCoach/";
const API_GET_TRAINING_GROUPS = "/admin/allTrainingGroups/";

const AddCoachForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const nameRef = useRef();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const [validName, setValidName] = useState(false);

  const [surname, setSurname] = useState("");
  const [surnameFocus, setSurnameFocus] = useState(false);
  const [validSurname, setValidSurname] = useState(false);

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [trainingGroup, setTrainingGroup] = useState({});
  const [trainingGroups, setTrainingGroups] = useState([]);

  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [telephoneNumberFocus, setTelephoneNumberFocus] = useState(false);
  const [validTelephoneNumber, setValidTelephoneNumber] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.coach.length !== 0) {
      setName(props.coach[0].user.name);
    }
  }, []);

  useEffect(() => {
    if (props.coach.length !== 0) {
      setSurname(props.coach[0].user.surname);
    }
  }, []);

  useEffect(() => {
    if (props.coach.length !== 0) {
      setEmail(props.coach[0].user.email);
    }
  }, []);

  useEffect(() => {
    if (props.coach.length !== 0) {
      setTelephoneNumber(props.coach[0].telephoneNumber);
    }
  }, []);

  useEffect(() => {
    if (props.coach.length !== 0) {
      const trainingGroupData = {
        value: props.coach[0].trainingGroup?.id,
        label: props.coach[0].trainingGroup?.groupName,

      };
      setTrainingGroup(trainingGroupData);
    }
  }, []);

  useEffect(() => {
    getAllAcademyTrainingGroups();
  }, []);

  useEffect(() => {
    const result = new RegExp(NAME_SURNAME_REGEX).test(name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = new RegExp(NAME_SURNAME_REGEX).test(surname);
    setValidSurname(result);
  }, [surname]);

  useEffect(() => {
    const result = new RegExp(EMAIL_REGEX).test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = new RegExp(TELEPHONE_NUMBER_REGEX).test(telephoneNumber);
    setValidTelephoneNumber(result);
  }, [telephoneNumber]);

  function handler(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  const handleError = (message) => {
    props.closeModal();
    setLoading(false);
    props.notifyError(message);
    document.removeEventListener("click", handler, true);
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

  const isDataChanged = () => {
    var changedData = false;
    if (props.coach[0].user.name !== name) {
      changedData = true;
    }
    if (props.coach[0].user.surname !== surname) {
      changedData = true;
    }
    if (props.coach[0].user.email !== email) {
      changedData = true;
    }
    if (props.coach[0].telephoneNumber !== telephoneNumber) {
      changedData = true;
    }
    if (props.coach[0].trainingGroup?.id !== trainingGroup.value) {
      changedData = true;
    }
    return changedData;
  };

  const editCoach = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);
        const coachId = props.coach[0].id;
        const trainingGroupId= trainingGroup.value;
        const response = await axiosPrivate.put(
          API_EDIT_COACH + coachId,
          JSON.stringify({
            name,
            surname,
            email,
            telephoneNumber,
            trainingGroupId,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano trenera");
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
      } else {
        handleError("Nie można edytować trenera");
      }
    }
  };
  const addCoach = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const trainingGroupId= trainingGroup.value;
      const response = await axiosPrivate.post(
        API_CREATE_COACH,
        JSON.stringify({
          name,
          surname,
          email,
          telephoneNumber,
          trainingGroupId,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano trenera");
      document.removeEventListener("click", handler, true);
    } catch (error) {
      if (!error?.response) {
        handleError("Brak odpowiedzi z serwera");
      } else if (error.response.status === 404) {
        handleError(error.response.data.message);
      } else if (error.response.status === 403) {
        navigate("/", { state: { from: location }, replace: true });
        setLoading(false);
      } else {
        handleError("Nie można dodać trenera");
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
              {props.isEdit ? "Edytuj " : "Dodaj"} trenera
            </h1>
            <div className="add-form-group">
              <label htmlFor="name">Imię</label>
              <input
                type="text"
                name="name"
                placeholder="imię"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
                ref={nameRef}
                pattern={NAME_SURNAME_REGEX}
                onBlur={(e) => setNameFocus(true)}
                focused={nameFocus.toString()}
              ></input>
              <span>Musi zawierać same litery, tylko jedną dużą</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="surname">Nazwisko</label>
              <input
                type="text"
                name="surname"
                placeholder="nazwisko"
                autoComplete="off"
                onChange={(e) => setSurname(e.target.value)}
                value={surname}
                required
                pattern={NAME_SURNAME_REGEX}
                onBlur={(e) => setSurnameFocus(true)}
                focused={surnameFocus.toString()}
              ></input>
              <span>Musi zawierać same litery, tylko jedną dużą</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                placeholder="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
                pattern={EMAIL_REGEX}
                onBlur={(e) => setEmailFocus(true)}
                focused={emailFocus.toString()}
              ></input>
              <span>To nie jest poprawny adres email</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="telephoneNumber">Numer Telefonu</label>
              <input
                type="text"
                name="telephoneNumber"
                placeholder="numer telefonu"
                autoComplete="off"
                onChange={(e) => setTelephoneNumber(e.target.value)}
                value={telephoneNumber}
                required
                pattern={TELEPHONE_NUMBER_REGEX}
                onBlur={(e) => setTelephoneNumberFocus(true)}
                focused={telephoneNumberFocus.toString()}
              ></input>
              <span>To nie jest prawidłowy numer telefonu </span>
            </div>
            <div className="add-form-group">
              <label htmlFor="trainingGroup">Grupa Treningowa</label>
              <ReactDropdown
                options={trainingGroups}
                placeholder="wybierz grupe treningową"
                value={trainingGroup}
                onChange={(option) => setTrainingGroup(option)}
              />
            </div>
            <div className="add-form-button">
              <button
                className="btn"
                disabled={
                  !validName ||
                  !validSurname ||
                  !validEmail ||
                  !validTelephoneNumber
                    ? true
                    : false
                }
                onClick={props.isEdit ? editCoach : addCoach}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} trenera
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddCoachForm;
