import { Modal } from "antd";
import { deleteMovie } from "../../api/movie";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";

const DeleteMovieModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedMovie,
  setSelectedMovie,
  getData,
}) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleOk = async () => {
    setIsDeleting(true);
    try {
      dispatch(ShowLoading());
      const movieId = selectedMovie._id;
      const response = await deleteMovie({ movieId });
      if (response.success) {
        toast.success(response.message);
        getData();
      } else {
        toast.error(response.message);
      }
      setSelectedMovie(null);
      setIsDeleteModalOpen(false);
      dispatch(HideLoading());
    } catch (err) {      dispatch(HideLoading());
      setIsDeleteModalOpen(false);
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedMovie(null);
  };
  return (
    <Modal
      title="Delete Movie"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modern-modal delete-modal"
      okText="Delete Movie"
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
          You are about to delete <strong>"{selectedMovie?.title}"</strong>. This action cannot be undone and you'll lose all data associated with this movie.
        </p>
        <div className="delete-warning">
          This will also remove all shows and bookings associated with this movie.
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMovieModal;
