import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "./postSlice";
import { useCreatePost } from "./useCreatePost";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  // max-height: 80vh;
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
const ErrorMessage = styled.span`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;
const FilePreview = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;
const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #d32f2f;
  }
`;
function PostModal({ show, handlePostModalCancel }) {
  const dispatch = useDispatch();
  const { createPost: createPostApi, isLoading } = useCreatePost();
  const [selectedFiles, setIsSelectedFiles] = useState([]);
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
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

  //   const (e) => {
  //     e.preventDefault();
  //   };
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

  //   const handleOpen = () => {
  //     setIsModalOpen(true);
  //   };

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
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Post</ModalTitle>
          <CloseButton
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
            <Label>Title</Label>
            <Input
              type="text"
              {...register("title", {
                required: true,
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
              error={errors.title}
            />
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
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
              error={errors.description}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Upload Image or Video</Label>
            <FileInput
              type="file"
              name="file"
              onChange={handleInputChange}
              accept="image/*,video/*"
              multiple
              error={errors.files}
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
                      title="Remove File"
                    >
                      x
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
              {isSubmitting ? "Creating..." : "Create Post"}
            </SubmitButton>
          </ModalButtons>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default PostModal;
