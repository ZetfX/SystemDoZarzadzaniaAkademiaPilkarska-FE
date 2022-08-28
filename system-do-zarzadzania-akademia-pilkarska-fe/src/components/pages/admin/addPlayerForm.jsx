import "../../../App.scss";
import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import ReactDropdown from "react-dropdown";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../../loaders/FormLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const NAME_SURNAME_REGEX =
  "([A-ZĄĆĘŁŃÓŚŹŻ][-,a-ząćęłńóśTtUuWwYyZzŹźŻż. ']+[ ]*)+";
const PESEL_REGEX = "^[0-9]{11}$";
const TELEPHONE_NUMBER_REGEX =
  "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{3,5}$";
const EMAIL_REGEX = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
const API_GET_TRAINING_GROUPS = "/admin/allTrainingGroups/";

const API_CREATE_PLAYER = "/admin/createPlayer";
const API_EDIT_PLAYER = "/admin/editPlayer/";

const AddPlayerForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const genderComboBoxData = ["Mężczyna", "Kobieta"];
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const defaultGender = genderComboBoxData[0];
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

  const [gender, setGender] = useState(defaultGender);

  const [trainingGroup, setTrainingGroup] = useState({});
  const [trainingGroups, setTrainingGroups] = useState([]);

  const [dateOfBirth, setDateOfBirth] = useState();

  const [pesel, setPesel] = useState("");
  const [peselFocus, setPeselFocus] = useState(false);
  const [validPesel, setValidPesel] = useState(false);

  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [telephoneNumberFocus, setTelephoneNumberFocus] = useState(false);
  const [validTelephoneNumber, setValidTelephoneNumber] = useState(false);

  function replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, "g"), replace);
  }

  function maxDateOfBirth() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 5);
    return date;
  }

  const formatDate = (string) => {
    const dateStr = string;
    const dateStrFormat = replaceAll(dateStr, "-", "/");
    const dateParts = dateStrFormat.split("/");
    const date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return date;
  };
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      setName(props.player[0].user.name);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      setSurname(props.player[0].user.surname);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      setEmail(props.player[0].user.email);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      setTelephoneNumber(props.player[0].telephoneNumber);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      setGender(props.player[0].gender);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      const date = formatDate(props.player[0].dateOfBirth);

      setDateOfBirth(date);
    } else {
      setDateOfBirth(maxDateOfBirth());
    }
  }, []);
  useEffect(() => {
    if (props.player.length !== 0) {
      setPesel(props.player[0].pesel);
    }
  }, []);

  useEffect(() => {
    if (props.player.length !== 0) {
      const trainingGroupData = {
        value: props.player[0].trainingGroup?.id,
        label: props.player[0].trainingGroup?.groupName,
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

  useEffect(() => {
    const result = new RegExp(PESEL_REGEX).test(pesel);
    setValidPesel(result);
  }, [pesel]);

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
    const date = formatDate(props.player[0].dateOfBirth);
    var changedData = false;
    if (props.player[0].user.name !== name) {
      changedData = true;
    }
    if (props.player[0].user.surname !== surname) {
      changedData = true;
    }
    if (props.player[0].user.email !== email) {
      changedData = true;
    }
    if (props.player[0].telephoneNumber !== telephoneNumber) {
      changedData = true;
    }
    if (props.player[0].gender !== gender) {
      changedData = true;
    }
    if (date.getTime() !== dateOfBirth.getTime()) {
      changedData = true;
    }
    if (props.player[0].pesel !== pesel) {
      changedData = true;
    }
    if (props.player[0].trainingGroup?.id !== trainingGroup.value) {
      changedData = true;
    }
    return changedData;
  };

  const editPlayer = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);
        const playerId = props.player[0].id;
        const trainingGroupId =trainingGroup.value;
        const response = await axiosPrivate.put(
          API_EDIT_PLAYER + playerId,
          JSON.stringify({
            name,
            surname,
            email,
            gender,
            telephoneNumber,
            dateOfBirth,
            pesel,
            trainingGroupId,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano zawodnika");
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
        handleError("Nie można edytować zawodnika");
      }
    }
  };
  const addPlayer = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const trainingGroupId =trainingGroup.value;
      const response = await axiosPrivate.post(
        API_CREATE_PLAYER,
        JSON.stringify({
          name,
          surname,
          email,
          gender,
          telephoneNumber,
          dateOfBirth,
          pesel,
          academyId,
          trainingGroupId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano zawodnika");
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
        handleError("Nie można dodać zawodnika");
      }
    }
  };

  console.log(gender);
  return (
    <>
      {loading ? (
        <FormLoader />
      ) : (
        <>
          <div className="add-form">
            <h1 className="add-form-title">
              {props.isEdit ? "Edytuj " : "Dodaj"} zawodnika
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
              <label htmlFor="gender">Płeć</label>
              <ReactDropdown
                options={genderComboBoxData}
                placeholder="wybierz płeć"
                value={gender}
                onChange={(option) => setGender(option.value)}
              />
              <span>Wybierz płeć</span>
            </div>

            <div className="add-form-group">
              <label htmlFor="dateOfBirth">Data Urodzenia</label>
              <DatePicker
                selected={dateOfBirth}
                onChange={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
                dateFormat="dd-MM-yyyy"
                maxDate={maxDateOfBirth()}
              />
            </div>
            <div className="add-form-group">
              <label htmlFor="pesel">PESEL</label>
              <input
                type="text"
                name="pesel"
                placeholder="PESEL"
                autoComplete="off"
                onChange={(e) => setPesel(e.target.value)}
                value={pesel}
                required
                pattern={PESEL_REGEX}
                onBlur={(e) => setPeselFocus(true)}
                focused={peselFocus.toString()}
              ></input>
              <span>To nie jest prawidłowy numer PESEL</span>
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
                  !validTelephoneNumber ||
                  !validPesel
                    ? true
                    : false
                }
                onClick={props.isEdit ? editPlayer : addPlayer}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} zawodnika
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddPlayerForm;
