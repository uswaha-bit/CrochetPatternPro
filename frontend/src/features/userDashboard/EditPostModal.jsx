import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdatePost } from "../../hooks/useUpdatePost";
import Spinner from "../../ui/Spinner";
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

function EditPostModal({ show, handlePostModalCancel, post }) {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState([]);
  // TanStack Query v5 mutations expose `isPending` (there is no `isLoading`)
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

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

  // Prefill when post prop is available
  useEffect(() => {
    if (post) {
      setValue("title", post.title || "");
      setValue("description", post.description || "");
      setSelectedFiles(post.content || []);
    }
  }, [post, setValue]);

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setValue("files", files);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedFiles(updatedFiles);
    setValue("files", updatedFiles);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    reset();
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    handleCancel();
    handlePostModalCancel();
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    selectedFiles.forEach((file) => {
      if (file instanceof File) {
        const field = file.type.startsWith("video")
          ? "postVideos"
          : "postImages";
        formData.append(field, file);
      }
    });

    updatePost(
      { id: post._id, formData },
      {
        onSuccess: () => {
          toast.success("Post updated!");
          queryClient.invalidateQueries({ queryKey: ["userPosts"] });
          handleCancel();
          handlePostModalCancel();
        },
        onError: (err) => {
          toast.error("Failed to update post");
        },
      }
    );
  };

  if (!show || !post) return null;
  else if (isUpdating) return <Spinner overlay />;
  return (
    <Modal
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancelClick(e);
        }
      }}
    >
      <ModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-post-title"
      >
        <ModalBody>
          <ModalHeader>
            <ModalTitle id="edit-post-title">Edit post</ModalTitle>
            <CloseButton
              type="button"
              aria-label="Close"
              onClick={handleCancelClick}
            >
              ×
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                  maxLength: { value: 500, message: "Max 500 characters" },
                })}
                $error={!!errors.title}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="edit-description">Description</Label>
              <TextArea
                id="edit-description"
                {...register("description", {
                  minLength: { value: 10, message: "Min 10 characters" },
                  maxLength: { value: 1000, message: "Max 1000 characters" },
                })}
                $error={!!errors.description}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="edit-files">Upload image or video</Label>
              <FileInput
                id="edit-files"
                type="file"
                multiple
                onChange={handleInputChange}
                accept="image/*,video/*"
              />
              {selectedFiles.length > 0 && (
                <FilePreview>
                  {selectedFiles.map((file, index) => {
                    const fileName =
                      file.name || file.originalName || `File ${index + 1}`;
                    return (
                      <FileItem key={index}>
                        <span>{fileName}</span>
                        <RemoveFileButton
                          type="button"
                          onClick={() => removeFile(index)}
                          aria-label={`Remove ${fileName}`}
                          title="Remove file"
                        >
                          ×
                        </RemoveFileButton>
                      </FileItem>
                    );
                  })}
                </FilePreview>
              )}
            </FormGroup>

            <ModalButtons>
              <CancelButton type="button" onClick={handleCancelClick}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update post"}
              </SubmitButton>
            </ModalButtons>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EditPostModal;