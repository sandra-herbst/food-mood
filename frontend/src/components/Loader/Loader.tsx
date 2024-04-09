import "./Loader.scss";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <>
      <div className="loaderContainer" />
      <Spinner animation="border" variant="secondary" />
    </>
  );
};

export default Loader;
