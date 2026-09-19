import ConfirmDialog from "../../ui/ConfirmDialog";

export default function DeletePatternModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Are you sure you want to delete this pattern?"
      onConfirm={onDelete}
      onClose={onClose}
      isBusy={isDeleting}
    />
  );
}