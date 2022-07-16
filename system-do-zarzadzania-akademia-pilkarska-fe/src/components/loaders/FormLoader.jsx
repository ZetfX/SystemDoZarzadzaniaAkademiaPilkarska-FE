import React from "react";

 const FormLoader = () =>  {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
      <label htmlFor="text">Proszę czekać</label>
    </div>
  );
}
export default FormLoader;