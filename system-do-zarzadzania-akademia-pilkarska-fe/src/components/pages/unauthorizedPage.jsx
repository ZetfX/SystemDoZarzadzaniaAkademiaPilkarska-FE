import { useNavigate } from "react-router-dom";
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div>
      <div>Unauthorized Page</div>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};
export default UnauthorizedPage;
