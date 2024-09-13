import React, { useState, useEffect } from "react";
import Modal from "../../shared/modal/Modal";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import { createBook, updateBook } from "../../../service/BookService";
import { fetchUsers } from "../../../service/UserService";
import { createIssuance } from "../../../service/IssuanceService";
import { useNavigate } from "react-router-dom";

const AssignUserModal = ({
  title,
  isAssignModalOpen,
  closeAssignModal,
  selectedBook,
}) => {
  const initialState = {
    userId: "",
    bookId: selectedBook?.id || "",
    type: "In house",
    returnTime: "",
  };
  const [assignBookData, setAssignBookData] = useState({
    ...initialState,
    bookId: selectedBook?.id,
  });

  const resetState = () => setAssignBookData(initialState);
  const navigate = useNavigate();

  // const [first, setfirst] = useState(second)

  const [username, setUsername] = useState("");
  const [userList, setuserList] = useState([]);
  // useEffect(() => {
  //   if (selectedBook) {
  //     setAssignBookData({
  //       title: selectedBook.title,
  //     });
  //   } else {
  //     setAssignBookData({
  //       title: "",
  //       user: "",
  //       mobileNumber: ""
  //     });
  //   }
  // }, [selectedBook]);

  useEffect(() => {
    setAssignBookData({
      bookId: selectedBook?.id || "",
      returnTime: "",
      type: "In house",
      userId: "",
    });
  }, [selectedBook]);

  useEffect(() => {
    if (isAssignModalOpen === false) {
      resetState();
      setUsername("");
    }
  }, [isAssignModalOpen]);

  const getUserList = async () => {
    const userData = await fetchUsers();
    setuserList(userData);
  };
  useEffect(() => {
    getUserList();
  }, []);

  const handleAssign = async () => {
    console.log(assignBookData);

    try {
      const data = await createIssuance(assignBookData);
      console.log(data);
      navigate("/issuance");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAssignBookData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === "userId") {
      setAssignBookData((prevData) => {
        setUsername(getUserDetails(value, "name"));
        return {
          ...prevData,
          userId: getUserDetails(value, "id"),
        };
      });
    }
  };

  const getUserDetails = (text = "", what = "id") => {
    const arr = text.split(".");
    const id = arr[0];
    const name = arr[1];
    console.log(arr, id, name);

    return what === "id" ? parseInt(id) : name;
  };

  return (
    <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} title={title}>
      {/* <form onSubmit={handleAddBook}> */}
      <div>
        {/* <div className="form-group">
            <label htmlFor="author" className="label-text" style={{ marginBottom: "5px" }}>Title:</label>
            <input className="login-input" type="text" id="author" value={assignBookData.title} onChange={handleChange} required/>
          </div> */}

        <div className="form-group">
          <label
            htmlFor="bookId"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            Title:
          </label>
          <select
            defaultValue={selectedBook?.id}
            className="login-input modal-select"
            value={selectedBook?.id}
            id="bookId"
            disabled
          >
            <option selected value={selectedBook?.id}>
              {selectedBook?.title}
            </option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="userId"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            User's Mobile:
          </label>
          <select
            className="login-input modal-select"
            value={`${assignBookData.userId}.${username}`}
            id="userId"
            onChange={(e) => {
              handleChange(e);
              setUsername();
            }}
            required
          >
            <option value="">Select User</option>
            {userList.map((user) => (
              <option key={user.id} value={`${user?.id}.${user?.name}`}>
                {user.mobileNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="username"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            User:
          </label>
          <input
            className="login-input"
            type="text"
            id="username"
            value={username}
            disabled
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="type"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            Type:
          </label>
          <select
            defaultValue={selectedBook?.id}
            className="login-input modal-select"
            value={assignBookData.type}
            id="type"
            onChange={handleChange}
            required
          >
            {/* <option selected value="">Select type</option> */}
            <option selected value={"In house"}>
              {"In house"}
            </option>
            <option value={"Take away"}>{"Take away"}</option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="returnTime"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            Expected Return:
          </label>
          <input
            className="login-input"
            type="datetime-local"
            id="returnTime"
            value={assignBookData.returnTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modal-button">
          <Button onClick={handleAssign} type="submit" text={"Assign"} />
        </div>
      </div>
    </Modal>
  );
};

export default AssignUserModal;
