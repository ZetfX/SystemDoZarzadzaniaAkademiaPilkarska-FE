import "../../App.scss";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../loaders/FormLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const NAME_REGEX = "([A-ZĄĆĘŁŃÓŚŹŻ][-,a-ząćęłńóśTtUuWwYyZzŹźŻż. ']+[ ]*)+";
const MIN_LENGTH_REGEX = "^.{3,}$";
const ZIP_CODE_REGEX = "^[0-9]{2}-[0-9]{3}$";

const API_CREATE_TRAINING_GROUP = "/admin-coach/createObject/";
const API_EDIT_OBJECT = "/admin-coach/editObject/";

const AddObjectForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const placeNameRef = useRef();

  const [loading, setLoading] = useState(false);

  const [placeName, setPlaceName] = useState("");
  const [placeNameFocus, setPlaceNameFocus] = useState(false);
  const [validPlaceName, setValidPlaceName] = useState(false);

  const [street, setStreet] = useState("");
  const [streetFocus, setStreetFocus] = useState(false);
  const [validStreet, setValidStreet] = useState(false);

  const [city, setCity] = useState("");
  const [cityFocus, setCityFocus] = useState(false);
  const [validCity, setValidCity] = useState(false);

  const [zipCode, setZipCode] = useState("");
  const [zipCodeFocus, setzipCodeFocus] = useState(false);
  const [validZipCode, setValidZipCode] = useState(false);

  useEffect(() => {
    placeNameRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.object.length !== 0) {
      setPlaceName(props.object[0].placeName);
    }
  }, []);

  useEffect(() => {
    if (props.object.length !== 0) {
      setStreet(props.object[0].street);
    }
  }, []);

  useEffect(() => {
    if (props.object.length !== 0) {
      setCity(props.object[0].city);
    }
  }, []);

  useEffect(() => {
    if (props.object.length !== 0) {
      setZipCode(props.object[0].zipCode);
    }
  }, []);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(placeName);
    setValidPlaceName(result);
  }, [placeName]);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(street);
    setValidStreet(result);
  }, [street]);

  useEffect(() => {
    const result = new RegExp(NAME_REGEX).test(city);
    setValidCity(result);
  }, [city]);

  useEffect(() => {
    const result = new RegExp(ZIP_CODE_REGEX).test(zipCode);
    setValidZipCode(result);
  }, [zipCode]);

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

  const isDataChanged = () => {
    var changedData = false;
    if (props.object[0].groupName !== placeName) {
      changedData = true;
    }
    if (props.object[0].street !== street) {
      changedData = true;
    }
    if (props.object[0].city !== city) {
      changedData = true;
    }
    if (props.object[0].zipCode !== zipCode) {
      changedData = true;
    }

    return changedData;
  };

  const editObject = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);

        const objectId = props.object[0].id;
        const response = await axiosPrivate.put(
          API_EDIT_OBJECT + objectId,
          JSON.stringify({
            placeName,
            street,
            city,
            zipCode,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano obiekt");
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
        handleError("Nie można edytować obiektu");
      }
    }
  };
  const addObject = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const response = await axiosPrivate.post(
        API_CREATE_TRAINING_GROUP,
        JSON.stringify({
          placeName,
          street,
          city,
          zipCode,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano obiekt");
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
        handleError("Nie można dodać obiektu");
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
              {props.isEdit ? "Edytuj " : "Dodaj"} obiekt
            </h1>
            <div className="add-form-group">
              <label htmlFor="name">Nazwa obiektu</label>
              <input
                type="text"
                name="name"
                placeholder="nazwa obiektu"
                autoComplete="off"
                onChange={(e) => setPlaceName(e.target.value)}
                required
                pattern={MIN_LENGTH_REGEX}
                value={placeName}
                ref={placeNameRef}
                onBlur={(e) => setPlaceNameFocus(true)}
                focused={placeNameFocus.toString()}
              ></input>
              <span>Nazwa musi się składać z minimum 3 znaków</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="street">Ulica</label>
              <input
                type="text"
                name="street"
                placeholder="ulica"
                autoComplete="off"
                onChange={(e) => setStreet(e.target.value)}
                value={street}
                required
                pattern={MIN_LENGTH_REGEX}
                onBlur={(e) => setStreetFocus(true)}
                focused={streetFocus.toString()}
              ></input>
              <span>Nazwa musi się składać z minimum 3 znaków</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="city">Miasto</label>
              <input
                type="text"
                name="city"
                placeholder="miasto"
                autoComplete="off"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                required
                pattern={NAME_REGEX}
                onBlur={(e) => setCityFocus(true)}
                focused={cityFocus.toString()}
              ></input>
              <span>
                Nazwa musi skladać się z samych liter i zawierać jedną duża
                literę na początku
              </span>
            </div>
            <div className="add-form-group">
              <label htmlFor="zipCode">Kod pocztowy</label>
              <input
                type="text"
                name="zipCode"
                placeholder="kod pocztowy"
                autoComplete="off"
                onChange={(e) => setZipCode(e.target.value)}
                value={zipCode}
                required
                pattern={ZIP_CODE_REGEX}
                onBlur={(e) => setzipCodeFocus(true)}
                focused={zipCodeFocus.toString()}
              ></input>
              <span>To nie jest prawidłowy kod pocztowy</span>
            </div>
            <div className="add-form-button">
              <button
                className="btn"
                disabled={
                  !validPlaceName || !validStreet || !validCity || !validZipCode
                    ? true
                    : false
                }
                onClick={props.isEdit ? editObject : addObject}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} obiekt
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddObjectForm;
