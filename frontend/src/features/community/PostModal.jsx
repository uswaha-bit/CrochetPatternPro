import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "./postSlice";
import { useCreatePost } from "./useCreatePost";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { colors, fontStack, patchButton, ghostButton } from "../../ui/theme";

/* ---------- Dialog: the same stitched swatch as the login card ---------- */
const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(22, 48, 32, 0.55);
  color: ${colors.ink};
  font-family: ${fontStack};
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  max-height: calc(100dvh - 48px);
  border: 2px solid ${colors.ink};
  border-radius: 20px;
  background: ${colors.surface};
  box-shadow: 0 6px 0 ${colors.ink};

  /* dashed seam just inside the edge */
  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 2px dashed ${colors.stitchLine};
    border-radius: 13px;
    pointer-events: none;
  }
`;

/* The seam stays put; only this part scrolls */
const ModalBody = styled.div`
  overflow-y: auto;
  padding: 36px;

  @media (max-width: 480px) {
    padding: 28px 22px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
`;

const CloseButton = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* ---------- Fields ---------- */
const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.95rem;
  font-weight: 700;
`;

const fieldBorder = ({ $error }) => ($error ? colors.error : colors.ink);

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 2px solid ${fieldBorder};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 2px solid ${fieldBorder};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.ink};
  font: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;

  &::placeholder {
    color: ${colors.muted};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const FileInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 2px dashed ${({ $error }) => ($error ? colors.error : colors.stitchLine)};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.muted};
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    border-color: ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  &::file-selector-button {
    margin-right: 14px;
    padding: 6px 14px;
    border: 2px solid ${colors.ink};
    border-radius: 10px;
    background: transparent;
    color: ${colors.ink};
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  &::file-selector-button:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  color: ${colors.error};
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

const FileItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 4px 6px 4px 12px;
  border: 2px solid ${colors.ink};
  border-radius: 999px;
  background: ${colors.paper};
  font-size: 0.875rem;
  font-weight: 500;

  span {
    overflow: hidden;
    max-width: 220px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const RemoveFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  color: ${colors.ink};
  font: inherit;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${colors.error};
    color: ${colors.surface};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 1px;
  }
`;

/* ---------- Buttons ---------- */
const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 32px;
  padding-bottom: 4px; /* room for the patch button's shadow */
`;

const CancelButton = styled.button`
  ${ghostButton}
`;

const SubmitButton = styled.button`
  ${patchButton}
`;

function PostModal({ show, handlePostModalCancel }) {
  const dispatch = useDispatch();
  const { createPost: createPostApi } = useCreatePost();
  const [selectedFiles, setIsSelectedFiles] = useState([]);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      files: null,
    },
  });

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    setIsSelectedFiles(files);
    setValue("files", files);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setIsSelectedFiles(updatedFiles);
    setValue("files", updatedFiles);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      selectedFiles.forEach((file) => {
        formData.append("postContent", file);
      });

      const postPayLoadData = {
        title: data.title,
        description: data.description,
        files: selectedFiles.map((file) => file.name),
      };
      createPostApi(formData, {
        onSuccess: (response) => {
          queryClient.refetchQueries({ queryKey: ["userPosts"] });
          toast.success("posted successfully", { id: "postSuccess" });
        },
        onError: (error) => {
          toast.error("could not create post,try again", { id: "postFail" });
        },
      });
      dispatch(createPost(postPayLoadData));
      handlePostModalCancel();
      handleCancel();
    } catch (error) {
      toast.error(`please try again=>${error.message}`, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsSelectedFiles([]);
    reset();
  };
  const handleCancelClick = (e) => {
    e.preventDefault(); // Prevent form submission
    handleCancel();
    handlePostModalCancel();
  };

  if (!show) return null;
  return (
    <Modal
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
          handlePostModalCancel();
        }
      }}
    >
      <ModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
      >
        <ModalBody>
          <ModalHeader>
            <ModalTitle id="post-modal-title">Create new post</ModalTitle>
            <CloseButton
              type="button"
              aria-label="Close"
              onClick={() => {
                handleCancel();
                handlePostModalCancel();
              }}
            >
              ×
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 6,
                    message: "title must be atleast 6 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "title must be at most 500 characters",
                  },
                })}
                placeholder="Enter post title..."
                $error={!!errors.title}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="post-description">Description</Label>
              <TextArea
                id="post-description"
                {...register("description", {
                  required: false,
                  minLength: {
                    value: 10,
                    message: "description must of atleast 10 characters",
                  },
                  maxLength: {
                    value: 1000,
                    message: "description can be max of 1000 characters",
                  },
                })}
                placeholder="Share your crochet experience, pattern details, or tips..."
                $error={!!errors.description}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="post-files">Upload image or video</Label>
              <FileInput
                id="post-files"
                type="file"
                name="file"
                onChange={handleInputChange}
                accept="image/*,video/*"
                multiple
                $error={!!errors.files}
              />
              {errors.files && (
                <ErrorMessage>{errors.files.message}</ErrorMessage>
              )}
              {selectedFiles.length > 0 && (
                <FilePreview>
                  {selectedFiles.map((file, index) => (
                    <FileItem key={index}>
                      <span>{file.name}</span>
                      <RemoveFileButton
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                        title="Remove file"
                      >
                        ×
                      </RemoveFileButton>
                    </FileItem>
                  ))}
                </FilePreview>
              )}
            </FormGroup>

            <ModalButtons>
              <CancelButton type="button" onClick={handleCancelClick}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create post"}
              </SubmitButton>
            </ModalButtons>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PostModal;