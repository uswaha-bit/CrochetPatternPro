import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useUpdatePost } from '../../hooks/useUpdatePost'
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner";


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

function EditPostModal({ show, handlePostModalCancel, post }) {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { mutate: updatePost, isLoading: isUpdating } = useUpdatePost();

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
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
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
        const field = file.type.startsWith("video") ? "postVideos" : "postImages";
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
  else if (isUpdating) return <Spinner overlay/>
  return (
    <Modal
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancelClick(e);
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Post</ModalTitle>
          <CloseButton onClick={handleCancelClick}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 6, message: "Min 6 characters" },
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
            />
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              {...register("description", {
                minLength: { value: 10, message: "Min 10 characters" },
                maxLength: { value: 1000, message: "Max 1000 characters" },
              })}
            />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Upload Image or Video</Label>
            <FileInput type="file" multiple onChange={handleInputChange} accept="image/*,video/*" />
            {selectedFiles.length > 0 && (
              <FilePreview>
                {selectedFiles.map((file, index) => (
                  <FileItem key={index}>
                    <span>{file.name || file.originalName || `File ${index + 1}`}</span>
                    <RemoveFileButton onClick={() => removeFile(index)}>x</RemoveFileButton>
                  </FileItem>
                ))}
              </FilePreview>
            )}
          </FormGroup>

          <ModalButtons>
            <CancelButton type="button" onClick={handleCancelClick}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Post"}
            </SubmitButton>
          </ModalButtons>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditPostModal;

