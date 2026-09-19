import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRegister } from "./useRegister.js";
import Container from "../../ui/Container";
import toast from "react-hot-toast";
import Header from "../../ui/Header";
import {
  FieldsContainer,
  Container as Cont,
  Title,
  InputsContainer,
  InputWrapper,
  Label,
  Input,
  Select,
  DatePickerWrapper,
  ButtonsContainer,
  Button,
  BottomLink,
  StyledLink,
  ErrorMessage,
} from "../../ui/LoginSignupStyles";

function Register() {
  // Focus states for step 0
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Focus states for step 1
  const [isSkillLevelFocused, setIsSkillLevelFocused] = useState(false);
  const [isDobFocused, setIsDobFocused] = useState(false);
  const [isSkillGenderFocused, setIsGenderFocused] = useState(false);

  // Focus states for step 2
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const { register: registerUser, isLoading } = useRegister();
  const { register, handleSubmit, formState, trigger, watch, reset } = useForm({
    mode: "onTouched",
  });

  // Watch all field values
  const name = watch("name");
  const username = watch("username");
  const email = watch("email");
  const skillLevel = watch("skillLevel");
  const dateOfBirth = watch("dateOfBirth");
  const gender = watch("gender");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const { errors } = formState;
  const [dob, setDob] = useState();
  const [step, setStep] = useState(0);
  const totalSteps = 3;
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Editor", path: "/editor" },
  ];

  // Content checks
  const hasNameContent = name?.length > 0;
  const hasUsernameContent = username?.length > 0;
  const hasEmailContent = email?.length > 0;
  const hasSkillLevelContent = skillLevel?.length > 0;
  const hasGenderContent = gender?.length > 0;
  const hasdobContent = dateOfBirth?.length > 0;
  const hasPasswordContent = password?.length > 0;
  const hasConfirmPasswordContent = confirmPassword?.length > 0;

  const handleNext = async () => {
    let fieldsToValidate = [];
    switch (step) {
      case 0:
        fieldsToValidate = ["name", "username", "email"];
        break;
      case 1:
        fieldsToValidate = ["skillLevel", "gender"];
        break;
      case 2:
        fieldsToValidate = ["password", "confirmPassword"];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      fieldsToValidate.forEach((field) => {
        if (errors[field]) {
          toast.error(errors[field].message, { id: `error-${field}` });
        }
      });
    } else if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  function handlePrevious() {
    if (step > 0) {
      setStep(step - 1);
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.length >= 2 && name.length <= 12;
  };

  const validateUsername = (username) => {
    return username.length >= 8 && username.length <= 15;
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateConfirmPassword = (confirmPassword) => {
    return confirmPassword === watch("password");
  };

  // function onError(errors) {
  //   Object.values(errors).forEach((error) => {
  //     if (error && error.message) {
  //       toast.error(error.message, { id: `error-${Date.now()}` });
  //     }
  //   });
  // }

  function onSubmit(data) {
    if (
      !data.name ||
      !data.username ||
      !data.email ||
      !data.skillLevel ||
      !data.password ||
      !data.confirmPassword ||
      !validateName(data.name) ||
      !validateUsername(data.username) ||
      !validateEmail(data.email) ||
      !validatePassword(data.password) ||
      !validateConfirmPassword(data.confirmPassword)
    ) {
      return;
    }
    registerUser(data, {
      onSuccess: (response) => {
        reset();
        toast.dismiss("registerToast");
        toast.success("registration successful", { id: "registerSuccess" });
      },
      onError: (error) => {
        // onError(error);
      },
    });
  }

  return (
    <Container>
      <Header navItems={navItems} />
      <Cont>
        <FieldsContainer onSubmit={handleSubmit(onSubmit)}>
          <Title>Sign Up</Title>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <InputsContainer>
              <InputWrapper>
                <Label
                  $isFocused={isNameFocused}
                  $hasContent={hasNameContent}
                  $hasError={!!errors.name}
                >
                  Name
                </Label>
                <Input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    validate: (value) =>
                      validateName(value) ||
                      "name must be at least 2 characters",
                  })}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  $hasError={!!errors.name}
                />
                {/* {errors?.name && (
                  <ErrorMessage>{errors?.name?.message}</ErrorMessage>
                )} */}
              </InputWrapper>

              <InputWrapper>
                <Label
                  $isFocused={isUsernameFocused}
                  $hasContent={hasUsernameContent}
                  $hasError={!!errors.username}
                >
                  Username
                </Label>
                <Input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) =>
                      validateUsername(value) ||
                      "username must be at least 8 characters",
                  })}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                  $hasError={!!errors.username}
                />
                {/* {errors?.username && (
                  <ErrorMessage>{errors?.username?.message}</ErrorMessage>
                )} */}
              </InputWrapper>

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
                    required: "Email is required",
                    validate: (value) =>
                      validateEmail(value) || "Invalid email",
                  })}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  $hasError={!!errors.email}
                />
                {/* {errors?.email && (
                  <ErrorMessage>{errors?.email?.message}</ErrorMessage>
                )} */}
              </InputWrapper>
            </InputsContainer>
          )}

          {/* Step 1: Additional Info */}
          {step === 1 && (
            <InputsContainer>
              <InputWrapper>
                {hasSkillLevelContent && (
                  <Label
                    $hasContent={hasSkillLevelContent}
                    $hasError={!!errors.skillLevel}
                  >
                    Skill Level
                  </Label>
                )}
                <Select
                  {...register("skillLevel", {
                    required: "Skill Level is required",
                  })}
                  onFocus={() => setIsSkillLevelFocused(true)}
                  onBlur={() => setIsSkillLevelFocused(false)}
                  $hasError={!!errors.skillLevel}
                >
                  <option value="">Select Skill Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advance">Advanced</option>
                </Select>
                {/* {errors?.skillLevel && (
                  <ErrorMessage>{errors?.skillLevel?.message}</ErrorMessage>
                )} */}
              </InputWrapper>

              <InputWrapper>
                {hasdobContent && (
                  <Label
                    $hasContent={hasdobContent}
                    $hasError={!!errors.dateOfBirth}
                  >
                    Date of birth
                  </Label>
                )}
                <DatePickerWrapper>
                  <Input
                    selected={dob}
                    type="date"
                    onChange={(date) => setDob(date)}
                    onFocus={() => setIsDobFocused(true)}
                    onBlur={() => setIsDobFocused(false)}
                    placeholder="Select date"
                    {...register("dateOfBirth", {
                      required: "Date of Birth is required",
                    })}
                  />
                </DatePickerWrapper>
                {/* {errors?.dateOfBirth && (
                  <ErrorMessage>{errors?.dateOfBirth?.message}</ErrorMessage>
                )} */}
              </InputWrapper>

              <InputWrapper>
                {hasGenderContent && (
                  <Label
                    $hasContent={hasGenderContent}
                    $hasError={!!errors.gender}
                  >
                    Gender
                  </Label>
                )}
                <Select
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                  onFocus={() => setIsGenderFocused(true)}
                  onBlur={() => setIsGenderFocused(false)}
                  $hasError={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="Don't Specify">Don't Specify</option>
                </Select>
                {/* {errors?.gender && (
                  <ErrorMessage>{errors?.gender?.message}</ErrorMessage>
                )} */}
              </InputWrapper>
            </InputsContainer>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <InputsContainer>
              <InputWrapper>
                <Label
                  $isFocused={isPasswordFocused}
                  $hasContent={hasPasswordContent}
                  $hasError={!!errors.password}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) =>
                      validatePassword(value) ||
                      "Password must be at least 8 characters",
                  })}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  $hasError={!!errors.password}
                />
                {/* {errors?.password && (
                  <ErrorMessage>{errors?.password?.message}</ErrorMessage>
                )} */}
              </InputWrapper>

              <InputWrapper>
                <Label
                  $isFocused={isConfirmPasswordFocused}
                  $hasContent={hasConfirmPasswordContent}
                  $hasError={!!errors.confirmPassword}
                >
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      validateConfirmPassword(value) ||
                      "Passwords do not match",
                  })}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  $hasError={!!errors.confirmPassword}
                />
                {/* {errors?.confirmPassword && (
                  <ErrorMessage>{errors?.confirmPassword?.message}</ErrorMessage>
                )} */}
              </InputWrapper>
            </InputsContainer>
          )}

          <ButtonsContainer>
            {step > 0 && (
              <Button type="submit" $variant="cancel" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < totalSteps - 1 ? (
              <Button type="submit" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" onClick={handleNext}>
                Register
              </Button>
            )}
          </ButtonsContainer>

          <BottomLink>
            Already Registered?
            <StyledLink to="/login">Login</StyledLink>
          </BottomLink>
        </FieldsContainer>
      </Cont>
    </Container>
  );
}

export default Register;
