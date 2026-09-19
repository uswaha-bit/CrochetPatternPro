import { useLogin } from "./useLogin";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser, setUser } from "./loginSlice";
import toast from "react-hot-toast";
import Container from "../../ui/Container";
import Header from "../../ui/Header";
import {
  FieldsContainer,
  Container as Cont,
  Title,
  InputsContainer,
  InputWrapper,
  Label,
  Input,
  ButtonsContainer,
  Button,
  BottomLink,
  StyledLink,
} from "../../ui/LoginSignupStyles";
import { useUser } from "../userDashboard/useUser";

function Login() {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPwdFocused, setIsPwdFocused] = useState(false);
  const { login, isLoading } = useLogin();
  const { isLoading: userIsLaoding, refetch } = useUser();
  const { register, handleSubmit, reset, formState, watch } = useForm({
    mode: "onTouched",
  });
  const email = watch("email");
  const password = watch("password");
  const hasEmailContent = email?.length > 0;
  const hasPwdContent = password?.length > 0;
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Editor", path: "/editor" },
  ];

  const { errors } = formState;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  function onError(errors) {
    if (errors.message) {
      const firstTwoWords = errors.message.split(" ").slice(0, 3).join(" ");
      toast.error(firstTwoWords, { id: "loginToast" });
    }
  }

  function onSubmit(data) {
    if (
      !data.email ||
      !data.password ||
      !validateEmail(data.email) ||
      !validatePassword(data.password)
    )
      return;
    login(data, {
      onSuccess: (response) => {
        reset();
        queryClient.invalidateQueries({ queryKey: ["token"] });
        dispatch(loginUser(response));
        refetch()
          .then((response) => {
            console.log(response);
            if (response.data) {
              // dispatch(setUser(response.data)); // Dispatch the user data to Redux
            } else {
              dispatch(logoutUser());
            }
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
          });
        toast.dismiss("loginToast");
        toast.success("login successful", { id: "loginSuccess" });
      },
      onError: (error) => {
        //console.log(error.message);
        onError(error);
      },
    });
  }
  return (
    <Container>
      <Header navItems={navItems} />

      <Cont>
        <FieldsContainer onSubmit={handleSubmit(onSubmit, onError)}>
          <Title>Login to your account</Title>
          <InputsContainer>
            <InputWrapper>
              <Label
                $isFocused={isEmailFocused}
                $hasContent={hasEmailContent}
                $hasError={!!errors.email}
              >
                Email
              </Label>
              <Input
                type="email"
                {...register("email", {
                  required: "email is required",
                  validate: (value) => validateEmail(value) || "Invalid email",
                })}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                $hasError={!!errors.email}
              />
              {/* {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}  */}
            </InputWrapper>

            <InputWrapper>
              <Label
                $isFocused={isPwdFocused}
                $hasContent={hasPwdContent}
                $hasError={!!errors.password}
              >
                Password
              </Label>
              <Input
                type="password"
                {...register("password", {
                  required: "password is required",
                  validate: (value) =>
                    validatePassword(value) ||
                    "Password must be at least 8 characters",
                })}
                onFocus={() => setIsPwdFocused(true)}
                onBlur={() => setIsPwdFocused(false)}
                $hasError={!!errors.password}
              />
              {/* {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )} */}
            </InputWrapper>

            {/* {errors.serverError && (
              <p className={styles.error}>{errors.serverError.message}</p>
            )} */}
          </InputsContainer>
          <ButtonsContainer>
            <Button $variant="cancel">Cancel</Button>
            <Button $variant="login" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </ButtonsContainer>

          <BottomLink>
            Don't have an account?{" "}
            <StyledLink to="/Register">Signup</StyledLink>
          </BottomLink>
        </FieldsContainer>
      </Cont>
    </Container>
  );
}

export default Login;
