import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "./postSlice";
import { useCreatePost } from "./useCreatePost";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  TextArea,
  FileInput,
  ErrorMessage,
  FilePreview,
  FileItem,
  RemoveFileButton,
  ModalButtons,
  CancelButton,
  SubmitButton,
} from "../../ui/ModalStyles";

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