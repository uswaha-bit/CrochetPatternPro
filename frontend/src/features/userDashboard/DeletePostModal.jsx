import ConfirmDialog from "../../ui/ConfirmDialog";

export default function DeletePostModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Are you sure you want to delete this post?"
      onConfirm={onDelete}
      onClose={onClose}
      isBusy={isDeleting}
    />
  );
}