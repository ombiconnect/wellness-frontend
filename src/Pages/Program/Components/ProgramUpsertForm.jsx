import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import StatusSelect from "../../../Components/StatusSelect";
import { useDispatch } from "react-redux";
import { upsertProgram } from "../../../Thunks/Program";

const ProgramUpsertForm = ({ programData, handleCancelClick, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Program name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(upsertProgram(formData)).then(() => {
      if (onSuccess) onSuccess();
    });
  };

  useEffect(() => {
    setFormData({
      id: programData?.id || "",
      name: programData?.name || "",
      description: programData?.description || "",
      status: programData?.status || "",
    });
    setErrors({});
  }, []);

  return (
    <div>
      <form>
        <InputField
          placeholder={"e.g. FitNova Brotherhood"}
          label={"Program Name"}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />
        <InputField
          label={"Description"}
          placeholder={"Describe the program's purpose and goals"}
          className="mt-4"
          value={formData.description}
          type="textarea"
          rows="3"
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          required
        />
        <StatusSelect
          className="mt-4"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          error={errors.status}
          required
        />

        <div className="mt-4 border-gray-200 flex justify-end space-x-3">
          <Button
            type="button"
            variant="primary"
            size="medium"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            onClick={handleUpsert}
          >
            Save Program
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProgramUpsertForm;
