import styled from "styled-components";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdatedUser } from "./useUpdateUser";
import { useUser } from "./useUser";
import { setUser } from "../login/loginSlice";
import { colors, ghostButton } from "../../ui/theme";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Label,
  Input,
  Select,
  ErrorMessage,
  ModalButtons,
  CancelButton,
  SubmitButton,
} from "../../ui/ModalStyles";

/* ---------- Image pickers ---------- */
const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 20px;
`;

// The current image sits on a little square of graph paper
const Preview = styled.div`
  flex: none;
  overflow: hidden;
  width: ${({ $round }) => ($round ? "96px" : "144px")};
  height: 96px;
  box-sizing: border-box;
  border: 2px solid ${colors.ink};
  border-radius: ${({ $round }) => ($round ? "50%" : "12px")};
  background-color: ${colors.paper};
  background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
  background-size: 12px 12px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ChooseButton = styled.button`
  ${ghostButton}
`;

function UpdateUserModal({ show, onHide, userDetail }) {
  const { refetch } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { update, isLoading } = useUpdatedUser();

  const user = useSelector((store) => store.user);
  const { _id } = user.userDetail;
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

  const [existingProfileImage] = useState(
    userDetail.profileImage?.filename || ""
  );
  const [existingCoverImage] = useState(userDetail.coverImage?.filename || "");

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
    }
  };

  const handleUpdateUserProfile = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
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
              navigate(`/user/${_id}`, { replace: true });
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
      <ModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-user-title"
      >
        <ModalBody>
          <ModalHeader>
            <ModalTitle id="update-user-title">Update profile</ModalTitle>
            <CloseButton type="button" aria-label="Close" onClick={onHide}>
              ×
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit(handleUpdateUserProfile)}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                $error={!!errors.name}
              />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username", { required: "Username is required" })}
                $error={!!errors.username}
              />
              {errors.username && (
                <ErrorMessage>{errors.username.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                {...register("gender")}
                $error={!!errors.gender}
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
              {errors.gender && (
                <ErrorMessage>{errors.gender.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                $error={!!errors.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <ErrorMessage>{errors.dateOfBirth.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="skillLevel">Skill level</Label>
              <Select
                id="skillLevel"
                {...register("skillLevel")}
                $error={!!errors.skillLevel}
              >
                <option value="">Select Skill Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advance">Advanced</option>
              </Select>
              {errors.skillLevel && (
                <ErrorMessage>{errors.skillLevel.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label as="span">Profile image</Label>
              <ImageRow>
                <Preview $round>
                  {profileImage && <img src={profileImage} alt="Profile" />}
                </Preview>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  ref={profileImageRef}
                  onChange={handleProfileImageChange}
                  id="profileImage"
                  name="profileImage"
                />
                <ChooseButton
                  type="button"
                  onClick={() => profileImageRef.current.click()}
                >
                  Choose image
                </ChooseButton>
              </ImageRow>
            </FormGroup>

            <FormGroup>
              <Label as="span">Cover image</Label>
              <ImageRow>
                <Preview>
                  {coverImage && <img src={coverImage} alt="Cover" />}
                </Preview>
                <HiddenInput
                  type="file"
                  accept="image/*"
                  ref={coverImageRef}
                  onChange={handleCoverImageChange}
                  id="coverImage"
                  name="coverImage"
                />
                <ChooseButton
                  type="button"
                  onClick={() => coverImageRef.current.click()}
                >
                  Choose image
                </ChooseButton>
              </ImageRow>
            </FormGroup>

            <ModalButtons>
              <CancelButton type="button" onClick={onHide}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </SubmitButton>
            </ModalButtons>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default UpdateUserModal;