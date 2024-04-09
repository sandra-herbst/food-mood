import { FormEvent, useEffect, useState } from "react";
import "./Login.scss";
import { Container, Form, FloatingLabel } from "react-bootstrap";
import FmButton from "../../components/FmButton/FmButton";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import authService from "../../services/authService";
import Loader from "../../components/Loader/Loader";
import { CustomResponseError } from "../../models/error";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [hintVisible, setHintVisible] = useState(
    !!location.state?.expiredToken
  );
  const [errorMessageText, setErrorMessageText] = useState(
    location.state?.expiredToken ? "Session expired" : ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Validate login credentials and either login user or display error message
   * @param e formEvent, which triggered validation
   */
  const validateInput = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    authService
      .login(mail, password)
      .then((response) => {
        setIsLoading(false);
        sessionStorage.setItem("UserId", response.userId.toString());
        sessionStorage.setItem("Token", JSON.stringify(response.tokenData));
        setHintVisible(false);
        navigate("/");
      })
      .catch((err: CustomResponseError) => {
        setIsLoading(false);
        if (err.status === 401) {
          setErrorMessageText("email or password are invalid");
        } else {
          setErrorMessageText(err.message);
        }
        setHintVisible(true);
      });
  };

  useEffect(() => {
    if (sessionStorage.getItem("Token")) {
      return navigate("/");
    }
  }, []);

  return (
    <Container>
      {isLoading && <Loader />}
      <div className="Login contentWrapper">
        <div className="logoWrapper">
          <img src={"/images/logo.svg"} alt={"FoodMood Logo"} />
        </div>
        <h2 className="slogan">Are you in the mood for food?</h2>
        <Form
          className="formContainer"
          onSubmit={(event) => {
            validateInput(event);
          }}
        >
          <div className="formWrapper">
            <div className="formControls">
              <FloatingLabel
                controlId="login.InputMail"
                label="Email"
                className="mailInput"
              >
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={mail}
                  onChange={(event) => setMail(event.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="login.InputPassword"
                label="Password"
                className="passwordInput"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FloatingLabel>
              <ErrorMessage errorText={errorMessageText} show={hintVisible} />
            </div>
            <div className="loginBtnWrapper">
              <FmButton btnType={"submit"} color={"primary"}>
                Login
              </FmButton>
            </div>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
