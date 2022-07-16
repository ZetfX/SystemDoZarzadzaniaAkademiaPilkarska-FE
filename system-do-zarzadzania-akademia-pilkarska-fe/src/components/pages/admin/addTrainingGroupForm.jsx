import "../../../App.scss";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FormLoader from "../../loaders/FormLoader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ONLY_NUMBER_REGEX = "^[0-9]*$";
const MIN_LENGTH_REGEX = "^.{3,}$";
const API_CREATE_TRAINING_GROUP = "/admin/createTrainingGroup/";
const API_EDIT_TRAINING_GROUP = "/admin/editTrainingGroup/";
const MONTHLY_SUBSCRIPTION_TITLE = "skladka";

const AddTrainingGroupForm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const academyId = JSON.parse(localStorage.getItem("user")).academy.id;
  const axiosPrivate = useAxiosPrivate();

  const groupNameRef = useRef();

  const [loading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameFocus, setGroupNameFocus] = useState(false);
  const [validGroupName, setValidGroupName] = useState(false);

  const [monthlySubscription, setMonthlySubscription] = useState(0);
  const [monthlySubscriptionFocus, setMonthlySubscriptionFocus] = useState(false);
  const [validMonthlySubscription, setValidMonthlySubscription] = useState(false);

  useEffect(() => {
    groupNameRef.current.focus();
  }, []);

  useEffect(() => {
    if (props.trainingGroup.length !== 0) {
      setGroupName(props.trainingGroup[0].groupName);
    }
  }, []);

  useEffect(() => {
    if (props.trainingGroup.length !== 0) {
      setMonthlySubscription(props.trainingGroup[0].monthlySubscription.value);
    }
  }, []);

  useEffect(() => {
    const result = new RegExp(ONLY_NUMBER_REGEX).test(monthlySubscription);
    setValidMonthlySubscription(result);
  }, [monthlySubscription]);

  useEffect(() => {
    const result = new RegExp(MIN_LENGTH_REGEX).test(groupName);
    setValidGroupName(result);
  }, [groupName]);

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
    if (props.trainingGroup[0].groupName !== groupName) {
      changedData = true;
    }
    if (props.trainingGroup[0].monthlySubscription.value !== monthlySubscription) {
      changedData = true;
    }

    return changedData;
  };

  const editTrainingGroup = async (e) => {
    try {
      const changedData = isDataChanged();
      if (changedData) {
        e.preventDefault();
        document.addEventListener("click", handler, true);
        setLoading(true);

        const trainingGroupId = props.trainingGroup[0].id;
        const response = await axiosPrivate.put(
          API_EDIT_TRAINING_GROUP + trainingGroupId,
          JSON.stringify({
            groupName,
            monthlySubscriptionTitle:MONTHLY_SUBSCRIPTION_TITLE,
            monthlySubscriptionValue: monthlySubscription,
          })
        );
        props.reloadData();
        setLoading(false);
        props.notifySuccess("Pomyślnie edytowano grupę treningową");
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
        handleError("Nie można edytować grupy treningowej");
      }
    }
  };
  const addTrainingGroup = async (e) => {
    try {
      e.preventDefault();
      document.addEventListener("click", handler, true);
      setLoading(true);
      const response = await axiosPrivate.post(
        API_CREATE_TRAINING_GROUP,
        JSON.stringify({
          groupName,
          monthlySubscriptionTitle:MONTHLY_SUBSCRIPTION_TITLE,
          monthlySubscriptionValue: monthlySubscription,
          academyId,
        })
      );
      props.reloadData();
      setLoading(false);
      props.notifySuccess("Pomyślnie dodano grupę treningową");
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
        handleError("Nie można dodać grupy treningowej");
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
              {props.isEdit ? "Edytuj " : "Dodaj"} grupę treningową
            </h1>
            <div className="add-form-group">
              <label htmlFor="name">Nazwa</label>
              <input
                type="text"
                name="name"
                placeholder="nazwa grupy"
                autoComplete="off"
                onChange={(e) => setGroupName(e.target.value)}
                required
                pattern={MIN_LENGTH_REGEX}
                value={groupName}
                ref={groupNameRef}
                onBlur={(e) => setGroupNameFocus(true)}
                focused={groupNameFocus.toString()}
              ></input>
              <span>Nazwa musi się składać z minimum 3 znaków </span>
            </div>
            <div className="add-form-group">
              <label htmlFor="monthlySubscription">Opłata Miesięczna (w zł)</label>
              <input
                type="text"
                name="monthlySubscription"
                placeholder="opłata miesięczna"
                autoComplete="off"
                onChange={(e) => setMonthlySubscription(e.target.value)}
                value={monthlySubscription}
                required
                pattern={ONLY_NUMBER_REGEX}
                onBlur={(e) => setMonthlySubscriptionFocus(true)}
                focused={monthlySubscriptionFocus.toString()}
              ></input>
              <span>To nie jest prawidłowa wartość </span>
            </div>

            <div className="add-form-button">
              <button
                className="btn"
                disabled={
                  !validGroupName || !validMonthlySubscription ? true : false
                }
                onClick={props.isEdit ? editTrainingGroup : addTrainingGroup}
              >
                {props.isEdit ? "Edytuj" : "Dodaj"} grupę treningową
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default AddTrainingGroupForm;
