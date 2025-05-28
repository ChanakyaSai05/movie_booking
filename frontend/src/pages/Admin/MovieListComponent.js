import React, { useEffect, useState, useCallback } from "react";
import { Table, Button } from "antd";
import MovieForm from "./MovieForm";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movie";
import { useDispatch } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteMovieModal from "./DeleteMovieModal";
import moment from "moment";

function MovieList() {
  const tableHeadings = [
    {
      title: "Poster",
      dataIndex: "poster",      render: (text, data) => {
        return (
          <img
            className="table-movie-poster"
            src={data.poster}
            alt="Movie Poster"
          />
        );
      },
    },
    {
      title: "Movie Name",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => {
        return `${text} Mins`;
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data.releaseDate).format("MM-DD-YYYY");
      },
    },
    {
      title: "Action",
      render: (text, data) => {        return (
          <div className="table-actions">
            <Button
              className="action-btn edit-btn"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMovie(data);
                setFormType("edit");
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              className="action-btn delete-btn"
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedMovie(data);
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];

  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();
  const getData = useCallback(async () => {
    dispatch(ShowLoading());
    const response = await getAllMovies();
    const allMovies = response.data;
    setMovies(
      allMovies.map(function (item) {
        return { ...item, key: `${item._id}` };
      })
    );
    dispatch(HideLoading());
  }, [dispatch]);  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h2 className="page-title">Movie Management</h2>
        <Button
          type="primary"
          className="add-button"
          size="large"
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
          }}
        >
          Add New Movie
        </Button>
      </div>
      <div className="table-container">
        <Table 
          dataSource={movies} 
          columns={tableHeadings} 
          className="modern-table"
          scroll={{ x: 800 }}
        />
      </div>
      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}
    </div>
  );
}

export default MovieList;
