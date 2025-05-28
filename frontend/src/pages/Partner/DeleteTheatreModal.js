import { Modal } from "antd";
import { deleteTheatre } from "../../api/theatre";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const DeleteTheatreModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      dispatch(ShowLoading());
      const theatreId = selectedTheatre._id;
      console.log("Deleting theatre with ID:", theatreId);
      const response = await deleteTheatre({ theatreId });
      if (response.success) {
        toast.success(response.message);
        getData();
      } else {
        toast.error(response.message);
      }
      setSelectedTheatre(null);
      setIsDeleteModalOpen(false);
      dispatch(HideLoading());
    } catch (err) {
      dispatch(HideLoading());
      setIsDeleteModalOpen(false);
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedTheatre(null);
  };
  return (
    <Modal
      title="Delete Theatre"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modern-modal delete-modal"
      okText="Delete Theatre"
      cancelText="Cancel"
      okButtonProps={{
        danger: true,
        size: "large",
        className: "delete-confirm-btn"
      }}
      cancelButtonProps={{
        size: "large",
        className: "cancel-button"
      }}
    >
      <div className="delete-modal-content">
        <div className="warning-icon">⚠️</div>
        <h3 className="delete-title">Are you sure?</h3>
        <p className="delete-message">
          You are about to delete <strong>"{selectedTheatre?.name}"</strong>. This action cannot be undone and you'll lose all data associated with this theatre.
        </p>
        <div className="delete-warning">
          This will also remove all shows and bookings associated with this theatre.
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTheatreModal;
