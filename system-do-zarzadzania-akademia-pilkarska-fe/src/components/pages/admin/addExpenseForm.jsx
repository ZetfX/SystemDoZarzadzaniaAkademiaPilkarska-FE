import "../../../App.scss";
import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../../loaders/FormLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ONLY_NUMBER_REGEX = "^[0-9]*$";
const MIN_LENGTH_REGEX = "^.{3,}$";

const API_CREATE_EXPENSE = "/admin/createExpense";
const API_EDIT_EXPENSE = "/admin/editExpense/";

const AddExpenseForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const titleRef = useRef();

  const [loading, setLoading] = useState(false);

  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseTitleFocus, setExpenseTitleFocus] = useState(false);
  const [validExpenseTitle, setValidExpenseTitle] = useState(false);

  const [expenseValue, setExpenseValue] = useState(0);
  const [expenseValueFocus, setExpenseValueFocus] = useState(false);
  const [validExpenseValue, setValidExpenseValue] = useState(false);

  const [dateOfExpense, setDateOfExpense] = useState(new Date());

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
    if (props.expense.length !== 0) {
      setExpenseTitle(props.expense[0].expenseTitle);
    }
  }, []);

  useEffect(() => {
    if (props.expense.length !== 0) {
      setExpenseValue(props.expense[0].expenseValue);
    }
  }, []);

  useEffect(() => {
    if (props.expense.length !== 0) {
      const date = formatDate(props.expense[0].dateOfExpense);
      setDateOfExpense(date);
    }
  }, []);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(expenseTitle);
    setValidExpenseTitle(result);
  }, [expenseTitle]);

  useEffect(() => {
    const result = new RegExp(ONLY_NUMBER_REGEX).test(expenseValue);
    setValidExpenseValue(result);
  }, [expenseValue]);

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
    const date = formatDate(props.expense[0].dateOfExpense);
    var changedData = false;
    if (props.expense[0].expenseTitle !== expenseTitle) {
      changedData = true;
    }
    if (props.expense[0].expenseValue !== expenseValue) {
      changedData = true;
    }
    if (date.getTime() !== dateOfExpense.getTime()) {
      changedData = true;
    }
    return changedData;
  };

  const editExpense = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);
        const expenseId = props.expense[0].id;
        const response = await axiosPrivate.put(
          API_EDIT_EXPENSE + expenseId,
          JSON.stringify({
            expenseTitle,
            expenseValue,
            dateOfExpense,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano wydatek");
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
        handleError("Nie można edytować wydatku");
      }
    }
  };
  const addIncome = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const response = await axiosPrivate.post(
        API_CREATE_EXPENSE,
        JSON.stringify({
          expenseTitle,
          expenseValue,
          dateOfExpense,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano wydatek");
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
        handleError("Nie można dodać wydatku");
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
              {props.isEdit ? "Edytuj " : "Dodaj"} wydatek
            </h1>
            <div className="add-form-group">
              <label htmlFor="name">Tytuł</label>
              <input
                type="text"
                name="title"
                placeholder="Tytuł"
                autoComplete="off"
                onChange={(e) => setExpenseTitle(e.target.value)}
                required
                value={expenseTitle}
                ref={titleRef}
                pattern={MIN_LENGTH_REGEX}
                onBlur={(e) => setExpenseTitleFocus(true)}
                focused={expenseTitleFocus.toString()}
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
                onChange={(e) => setExpenseValue(e.target.value)}
                value={expenseValue}
                required
                pattern={ONLY_NUMBER_REGEX}
                onBlur={(e) => setExpenseValueFocus(true)}
                focused={expenseValueFocus.toString()}
              ></input>
              <span>Musi zawierać same cyfry</span>
            </div>
            <div className="add-form-group">
              <label htmlFor="dateOfBirth">Data</label>
              <DatePicker
                selected={dateOfExpense}
                onChange={(e) => setDateOfExpense(e)}
                dateFormat="dd-MM-yyyy"
              />
            </div>
            <div className="add-form-button">
              <button
                className="btn"
                disabled={!validExpenseTitle || !validExpenseValue ? true : false}
                onClick={props.isEdit ? editExpense : addIncome}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} wydatek
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddExpenseForm;
