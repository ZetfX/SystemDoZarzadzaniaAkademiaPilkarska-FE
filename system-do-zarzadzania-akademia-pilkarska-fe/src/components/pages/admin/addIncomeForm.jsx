import "../../../App.scss";
import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../../loaders/FormLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ONLY_NUMBER_REGEX = "^[0-9]*$";
const MIN_LENGTH_REGEX = "^.{3,}$";

const API_CREATE_INCOME = "/admin/createIncome";
const API_EDIT_INCOME = "/admin/editIncome/";

const AddIncomeForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const titleRef = useRef();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);
  const [validTitle, setValidTitle] = useState(false);

  const [value, setValue] = useState(0);
  const [valueFocus, setValueFocus] = useState(false);
  const [validValue, setValidValue] = useState(false);

  const [dateOfIncome, setDateOfIncome] = useState(new Date());

  function replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, "g"), replace);
  }

  const formatDate = (string) => {
    const dateStr = string;
    const dateStrFormat = replaceAll(dateStr, "-", "/");
    const dateParts = dateStrFormat.split("/");
    const date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return date;
  };
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.income.length !== 0) {
      setTitle(props.income[0].title);
    }
  }, []);

  useEffect(() => {
    if (props.income.length !== 0) {
      setValue(props.income[0].value);
    }
  }, []);

  useEffect(() => {
    if (props.income.length !== 0) {
      const date = formatDate(props.income[0].dateOfIncome);
      setDateOfIncome(date);
    }
  }, []);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(title);
    setValidTitle(result);
  }, [title]);

  useEffect(() => {
    const result = new RegExp(ONLY_NUMBER_REGEX).test(value);
    setValidValue(result);
  }, [value]);

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
    const date = formatDate(props.income[0].dateOfIncome);
    var changedData = false;
    if (props.income[0].title !== title) {
      changedData = true;
    }
    if (props.income[0].value !== value) {
      changedData = true;
    }
    if (date.getTime() !== dateOfIncome.getTime()) {
      changedData = true;
    }
    return changedData;
  };

  const editIncome = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);
        const incomeId = props.income[0].id;
        const response = await axiosPrivate.put(
          API_EDIT_INCOME + incomeId,
          JSON.stringify({
            incomeTitle: title,
            incomeValue: value,
            dateOfIncome,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano przychód");
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
        handleError("Nie można edytować przychodu");
      }
    }
  };
  const addIncome = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const response = await axiosPrivate.post(
        API_CREATE_INCOME,
        JSON.stringify({
          incomeTitle:title,
          incomeValue:value,
          dateOfIncome,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano przychód");
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
        handleError("Nie można dodać przychodu");
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
              {props.isEdit ? "Edytuj " : "Dodaj"} przychód
            </h1>
            <div className="add-form-group">
              <label htmlFor="name">Tytuł</label>
              <input
                type="text"
                name="title"
                placeholder="Tytuł"
                autoComplete="off"
                onChange={(e) => setTitle(e.target.value)}
                required
                value={title}
                ref={titleRef}
                pattern={MIN_LENGTH_REGEX}
                onBlur={(e) => setTitleFocus(true)}
                focused={titleFocus.toString()}
              ></input>
              <span>Musi mieć minimum 3 znaki długości</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="value">Wartość</label>
              <input
                type="text"
                name="value"
                placeholder="wartość"
                autoComplete="off"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                required
                pattern={ONLY_NUMBER_REGEX}
                onBlur={(e) => setValueFocus(true)}
                focused={valueFocus.toString()}
              ></input>
              <span>Musi zawierać same cyfry</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="dateOfBirth">Data</label>
              <DatePicker
                selected={dateOfIncome}
                onChange={(e) => setDateOfIncome(e)}
                dateFormat="dd-MM-yyyy"
              />
            </div>
            <div className="add-form-button">
              <button
                className="btn"
                disabled={!validTitle || !validValue ? true : false}
                onClick={props.isEdit ? editIncome : addIncome}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} przychód
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddIncomeForm;
