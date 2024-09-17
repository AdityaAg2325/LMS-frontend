import React, { useState, useEffect } from "react";
import Modal from "../../shared/modal/Modal";
import Button from "../../shared/button/Button";
import { createUser, updateUser } from "../../../service/UserService";
import {
  validateEmail,
  validateMobile,
  validateNotEmpty,
  validatePassword,
} from "../../../utility/validation";

const UsersModal = ({
  title,
  isModalOpen,
  handleCloseModal,
  handleAddUser,
  selectedUser,
  setToastMessage,
  setToastType,
  setShowToast,
}) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setUserData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        mobileNumber: selectedUser.mobileNumber || "",
        password: "", // Password is not populated for editing
      });
    } else {
      setUserData({
        name: "",
        email: "",
        mobileNumber: "",
        password: "", // Empty fields for new user registration
      });
    }
    setErrors({
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
    });
  }, [selectedUser]);

  const validateUser = () => {
    userData.name = userData?.name?.trim();
    userData.email = userData?.email?.trim();
    userData.mobileNumber = userData?.mobileNumber?.trim();
    userData.password = userData?.password?.trim();

    let isValid = true;
    const newErrors = {
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
    };

    if (!validateNotEmpty(userData.name)) {
      newErrors.name = `Name is required!`;
      isValid = false;
    }

    if (!validateNotEmpty(userData.email)) {
      newErrors.email = `Email is required!`;
      isValid = false;
    } else if (!validateEmail(userData.email)) {
      newErrors.email = `Enter a valid email!`;
      isValid = false;
    }

    if (!validateNotEmpty(userData.mobileNumber)) {
      newErrors.mobileNumber = `Mobile no. is required!`;
      isValid = false;
    } else if (!validateMobile(userData.mobileNumber)) {
      newErrors.mobileNumber = `Enter a valid 10-digit mobile no.`;
      isValid = false;
    }

    if (userData.password.length > 0) {
      if (!validatePassword(userData.password)) {
        newErrors.password = `Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.`;
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(newErrors);
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setErrors({ ...errors, [e.target.id]: "" });
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAdd = async () => {
    if (validateUser()) {
      try {
        const data = await createUser(userData); // Register the new user
        setToastMessage("User added successfully!");
        setShowToast(true);
        setToastType("success");
        console.log(data);
        handleAddUser();
      } catch (error) {
        setToastMessage("Error occurred while saving the User.");
        setToastType("error");
        setShowToast(true);
      } finally {
        handleCloseModal();
      }
    }
  };

  const handleEdit = async () => {
    if (validateUser()) {
      try {
        const data = await updateUser(userData, selectedUser?.mobileNumber); // Register the new user
        setToastMessage("User updated successfully!");
        setShowToast(true);
        setToastType("success");
        handleAddUser();
      } catch (error) {
        setToastMessage("User added successfully!");
        setShowToast(true);
        setToastType("success");
      } finally {
        handleCloseModal();
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
      {/* <form onSubmit={handleSubmit}>                    */}
      <div>
        <div className="form-group">
          <label
            htmlFor="name"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            Name:
          </label>
          <div>
          <input
            className="login-input"
            type="text"
            id="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label
            htmlFor="email"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            E-mail:
          </label>
          <div>
          <input
            className="login-input"
            type="text"
            id="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label
            htmlFor="mobileNumber"
            className="label-text"
            style={{ marginBottom: "5px" }}
          >
            Mobile:
          </label>
          <div>
          <input
            className="login-input"
            type="text"
            id="mobileNumber"
            value={userData.mobileNumber}
            onChange={handleChange}
            required
          />
          {errors.mobileNumber && (
            <div className="error-text">{errors.mobileNumber}</div>
          )}
          </div>
        </div>
        
        {/* {!selectedUser && ( // Password field is shown only when registering a new user
          <div className="form-group">
            <label htmlFor="password" className="label-text" style={{ marginBottom: '5px' }}>
              Password:
            </label>
            <input
              className="login-input"
              type="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
        )} */}
        <div className="modal-button">
          {!selectedUser && (
            <Button onClick={handleAdd} type="submit" text={"Add"} />
          )}
          {selectedUser && (
            <Button onClick={handleEdit} type="submit" text={"Save"} />
          )}
        </div>
      </div>
      {/* </form> */}
    </Modal>
  );
};

export default UsersModal;
