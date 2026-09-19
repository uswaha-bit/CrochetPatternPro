import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdatedUser } from "./useUpdateUser";
import { useUser } from "./useUser";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../login/loginSlice";
import { replace, useNavigate } from "react-router-dom";
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #5c6bc0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #5c6bc0;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-right: 50px;
  margin-left: 50px;
  &:hover {
    border-color: #5c6bc0;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background: none;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #999;
    color: #333;
  }
`;

const SubmitButton = styled.button`
  background-color: #5c6bc0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a5ac0;
  }
`;

function UpdateUserModal({ show, onHide, userDetail }) {
  const { refetch, isLoading: userIsLoading } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { update, isLoading } = useUpdatedUser();
  
  const user = useSelector((store) => store.user);
  console.log(user)
  const {_id } = user.userDetail;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: userDetail.name,
      username: userDetail.username,
      email: userDetail.email,
      dateOfBirth: userDetail.dateOfBirth,
      gender: userDetail.gender,
      skillLevel: userDetail.skillLevel,
    },
  });

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    userDetail.profileImage?.url || ""
  );
  const [coverImage, setCoverImage] = useState(
    userDetail.coverImage?.url || ""
  );

  const [existingProfileImage, setExistingProfileImage] = useState(
    userDetail.profileImage?.filename || ""
  );
  const [existingCoverImage, setExistingCoverImage] = useState(
    userDetail.coverImage?.filename || ""
  );

  // useEffect(() => {
  //   // Set initial values for existing images
  //   if (userDetail.profileImage) {
  //     setExistingProfileImage(userDetail.profileImage.name);
  //   }
  //   if (userDetail.coverImage) {
  //     setExistingCoverImage(userDetail.coverImage.name);
  //   }
  // }, [userDetail]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setValue("profileImage", file);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImage(existingProfileImage);
      //setValue("profileImage", existingProfileImage);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        setValue("coverImage", file);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(existingCoverImage);
      //setValue("coverImage", existingCoverImage);
    }
  };

  const handleUpdateUserProfile = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    // formData.append("email", data.email);
    formData.append("gender", data.gender);

    formData.append("skillLevel", data.skillLevel);
    formData.append("profileImage", data.profileImage);
    formData.append("coverImage", data.coverImage);
    if (data.dateOfBirth) {
      formData.append("dateOfBirth", data.dateOfBirth);
    }

    update(formData, {
      onSuccess: () => {
        onHide();
        refetch()
          .then((response) => {
            if (response.data) {
              dispatch(setUser(response.data));
              navigate("/user/_id", { replace: true });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
      onError: (error) => {
        console.error("Update failed", error);
      },
    });
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Update User Profile</ModalTitle>
          <CloseButton onClick={onHide}>×</CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit(handleUpdateUserProfile)}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              id="name"
            />
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username", { required: "Username is required" })}
              id="username"
            />
            {errors.username && (
              <small className="text-danger">{errors.username.message}</small>
            )}
          </FormGroup>
          {/* <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              id="email"
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </FormGroup> */}
          <FormGroup>
            <Label htmlFor="gender">Gender</Label>
            <select
              {...register("gender")}
              className={`form-control ${errors.gender ? "is-invalid" : ""}`}
              id="gender"
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender.message}</div>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input {...register("dateOfBirth")} type="date" id="dateOfBirth" />
            {errors.dateOfBirth && (
              <small className="text-danger">
                {errors.dateOfBirth.message}
              </small>
            )}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="skillLevel">Skill Level</Label>
            <select
              {...register("skillLevel")}
              className={`form-control ${
                errors.skillLevel ? "is-invalid" : ""
              }`}
              id="skillLevel"
            >
              <option value="">Select Skill Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advance">Advanced</option>
            </select>
            {errors.skillLevel && (
              <div className="invalid-feedback">
                {errors.skillLevel.message}
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label>Profile Image</Label>
            <div className="d-flex align-items-center">
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  marginRight: 30,
                }}
              />
              <FileInput
                type="file"
                accept="image/*"
                ref={profileImageRef}
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
                id="profileImage"
                name="profileImage"
              />
              <SubmitButton
                type="button"
                onClick={() => profileImageRef.current.click()}
              >
                Choose Image
              </SubmitButton>
            </div>
          </FormGroup>
          <FormGroup>
            <Label>Cover Image</Label>
            <div className="d-flex align-items-center">
              <img
                src={coverImage}
                alt="Cover"
                style={{
                  width: 150,
                  height: 100,
                  marginRight: 30,
                  objectFit: "cover",
                }}
              />
              <FileInput
                type="file"
                accept="image/*"
                ref={coverImageRef}
                onChange={handleCoverImageChange}
                style={{ display: "none" }}
                id="coverImage"
                name="coverImage"
              />
              <SubmitButton
                type="button"
                onClick={() => coverImageRef.current.click()}
              >
                Choose Image
              </SubmitButton>
            </div>
          </FormGroup>
          <ModalButtons>
            <CancelButton type="button" onClick={onHide}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              Save Changes
            </SubmitButton>
          </ModalButtons>
        </form>
      </ModalContent>
    </Modal>
  );
}
export default UpdateUserModal;
