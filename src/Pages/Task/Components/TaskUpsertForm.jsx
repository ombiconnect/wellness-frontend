import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { upsertTask } from "../../../Thunks/Task";
import DropDown from "../../../Components/DropDown";
import { getAllChallenges } from "../../../Thunks/Challenge";

const TaskUpsertForm = ({ taskData, handleCancelClick, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    challengeId: "",
    order: 0,
    xp: 0,
    mediaId: null,
    activity: {
      text: "",
      children: [""],
    },
    keyTakeaways: [""],
  });

  const [errors, setErrors] = useState({});
  const [showActivitySection, setShowActivitySection] = useState(true);
  const [showKeyTakeawaysSection, setShowKeyTakeawaysSection] = useState(false);
  const challenges = useSelector((state) => state.challenge);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleNestedChange = (parentField, fieldName, value, index = null) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };

      if (index !== null) {
        const updatedChildren = [...updatedParent[fieldName]];
        updatedChildren[index] = value;
        updatedParent[fieldName] = updatedChildren;
      } else {
        updatedParent[fieldName] = value;
      }

      return { ...prev, [parentField]: updatedParent };
    });

    // Clear nested field errors when user types
    const errorKey =
      index !== null
        ? `${parentField}${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          }`
        : `${parentField}${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          }`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleArrayChange = (fieldName, value, index) => {
    setFormData((prev) => {
      const updatedArray = [...prev[fieldName]];
      updatedArray[index] = value;
      return { ...prev, [fieldName]: updatedArray };
    });

    // Clear array field errors when user types
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const addArrayItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }));
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData((prev) => {
      const updatedArray = [...prev[fieldName]];
      updatedArray.splice(index, 1);
      return { ...prev, [fieldName]: updatedArray };
    });
  };

  const addChildItem = (parentField, fieldName) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };
      updatedParent[fieldName] = [...updatedParent[fieldName], ""];
      return { ...prev, [parentField]: updatedParent };
    });
  };

  const removeChildItem = (parentField, fieldName, index) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };
      const updatedChildren = [...updatedParent[fieldName]];
      updatedChildren.splice(index, 1);
      updatedParent[fieldName] = updatedChildren;
      return { ...prev, [parentField]: updatedParent };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.challengeId.trim()) {
      newErrors.challengeId = "Challenge is required";
    }

    // Validate order
    const orderValue = parseInt(formData.order) || 0;
    if (!formData.order && formData.order !== 0) {
      newErrors.order = "Order is required";
    }

    // Validate XP
    const xpValue = parseInt(formData.xp) || 0;
    if (!formData.xp && formData.xp !== 0) {
      newErrors.xp = "XP is required";
    } else if (xpValue < 0) {
      newErrors.xp = "XP should be 0 or greater";
    }

    // Activity validation (mandatory)
    if (!formData.activity.text.trim()) {
      newErrors.activityText = "Activity description is required";
    }
    if (
      !formData.activity.children ||
      formData.activity.children.filter((c) => c.trim() !== "").length === 0
    ) {
      newErrors.activityChildren = "At least one activity step is required";
    }

    // Key takeaways validation (if section is shown and has content)
    if (
      showKeyTakeawaysSection &&
      formData.keyTakeaways.filter((item) => item.trim() !== "").length === 0
    ) {
      newErrors.keyTakeaways =
        "At least one key takeaway is required when this section is enabled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      activity: {
        ...formData.activity,
        children: formData.activity.children.filter(
          (item) => item.trim() !== ""
        ),
      },
      keyTakeaways: formData.keyTakeaways.filter((item) => item.trim() !== ""),
      order: parseInt(formData.order) || 0,
      xp: parseInt(formData.xp) || 0,
    };

    dispatch(upsertTask(payload)).then((action) => {
      if (upsertTask.fulfilled.match(action)) {
        if (onSuccess) onSuccess();
      }
    });
  };

  useEffect(() => {
    if (taskData) {
      setFormData({
        id: taskData.id || "",
        title: taskData.title || "",
        description: taskData.description || "",
        challengeId: taskData.challengeId || "",
        order: taskData.order || 0,
        xp: taskData.xp || 0,
        mediaId: taskData.mediaId || null,
        activity: taskData.activity || { text: "", children: [""] },
        keyTakeaways: taskData.keyTakeaways || [""],
      });
    }
    setErrors({});
  }, [taskData]);

  useEffect(() => {
    dispatch(getAllChallenges());
  }, [dispatch]);

  return (
    <div>
      <form>
        {/* Title Field */}
        <InputField
          placeholder={"e.g. Complete Daily Review"}
          label={"Task Title"}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        {/* Description Field */}
        <InputField
          className="mt-4"
          label={"Description"}
          placeholder={"Describe this task"}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          type="textarea"
          rows="3"
          required
        />

        {/* Challenge Dropdown */}
        <div className="mt-4">
          <DropDown
            id="challengeId"
            label="Challenge"
            required
            optionsObject={challenges.items || []}
            selected={formData.challengeId}
            onChange={(e) => handleChange("challengeId", e.target.value)}
            placeholder="Select a challenge"
            error={errors.challengeId}
          />
        </div>

        {/* Order and XP Fields */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <InputField
            type="number"
            label={"Order"}
            placeholder={"Display order"}
            value={formData.order}
            onChange={(e) => handleChange("order", e.target.value)}
            error={errors.order}
            min="0"
            required
          />
          <InputField
            type="number"
            label={"XP Points"}
            placeholder={"Experience points"}
            value={formData.xp}
            onChange={(e) => handleChange("xp", e.target.value)}
            error={errors.xp}
            min="0"
            required
          />
        </div>

        {/* Media ID Field */}
        <InputField
          className="mt-4"
          label={"Media ID (Optional)"}
          placeholder={"Enter media ID"}
          value={formData.mediaId}
          onChange={(e) => handleChange("mediaId", e.target.value)}
        />

        {/* Activity Section - Required */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700">
            Activity Details
          </h3>

          <div className="mt-2 p-4 border border-gray-200 rounded-md">
            <InputField
              label={"Activity Description"}
              placeholder={"Describe the task activity"}
              value={formData.activity.text}
              type="textarea"
              rows="3"
              onChange={(e) =>
                handleNestedChange("activity", "text", e.target.value)
              }
              error={errors.activityText}
              required
            />

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Steps
              </label>
              {formData.activity.children.map((step, index) => (
                <div key={index} className="flex items-center mb-2">
                  <InputField
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) =>
                      handleNestedChange(
                        "activity",
                        "children",
                        e.target.value,
                        index
                      )
                    }
                    className="flex-1"
                    error={index === 0 ? errors.activityChildren : ""}
                  />
                  {formData.activity.children.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() =>
                        removeChildItem("activity", "children", index)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => addChildItem("activity", "children")}
              >
                + Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Key Takeaways Section - Optional */}
        <div className="mt-4">
          <div
            className="flex items-center cursor-pointer p-2 bg-gray-100 rounded-md"
            onClick={() => setShowKeyTakeawaysSection(!showKeyTakeawaysSection)}
          >
            <i
              className={`fas ${
                showKeyTakeawaysSection ? "fa-chevron-down" : "fa-chevron-right"
              } mr-2`}
            ></i>
            <h3 className="text-lg font-medium text-gray-700">
              Key Takeaways (Optional)
            </h3>
          </div>

          {showKeyTakeawaysSection && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md">
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Takeaways
                </label>
                {formData.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <InputField
                      placeholder={`Key takeaway ${index + 1}`}
                      value={takeaway}
                      onChange={(e) =>
                        handleArrayChange("keyTakeaways", e.target.value, index)
                      }
                      className="flex-1"
                      error={index === 0 ? errors.keyTakeaways : ""}
                    />
                    {formData.keyTakeaways.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => removeArrayItem("keyTakeaways", index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={() => addArrayItem("keyTakeaways")}
                >
                  + Add Key Takeaway
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
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
            Save Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskUpsertForm;
