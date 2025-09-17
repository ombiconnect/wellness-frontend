import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { upsertHabit } from "../../../Thunks/Habit";
import DropDown from "../../../Components/DropDown";
import { getAllFocusAreas } from "../../../Thunks/FocusArea";

const HabitUpsertForm = ({ habitData, handleCancelClick, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    activity: {
      text: "",
      children: [""],
    },
    tips: {
      text: "",
      children: [""],
    },
    recordPoint: 0,
    difficultyLevel: "BEGINNER",
    activeFrom: new Date().toISOString().split("T")[0],
    activeTo: "",
    focusAreaId: "",
  });

  const [errors, setErrors] = useState({});
  const [showActivitySection, setShowActivitySection] = useState(false);
  const [showTipsSection, setShowTipsSection] = useState(false);
  const focusAreas = useSelector((state) => state.focusArea);

  const difficultyLevels = [
    { id: "BEGINNER", name: "Beginner" },
    { id: "INTERMEDIATE", name: "Intermediate" },
    { id: "ADVANCED", name: "Advanced" },
  ];

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
        // Handle array fields (children)
        const updatedChildren = [...updatedParent[fieldName]];
        updatedChildren[index] = value;
        updatedParent[fieldName] = updatedChildren;
      } else {
        // Handle simple fields
        updatedParent[fieldName] = value;
      }

      return { ...prev, [parentField]: updatedParent };
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
      newErrors.title = "Habit title is required";
    }

    if (!formData.activeFrom) {
      newErrors.activeFrom = "Start date is required";
    }

    if (!formData.focusAreaId) {
      newErrors.focusAreaId = "Focus area is required";
    }

    if (formData.recordPoint <= 0) {
      newErrors.recordPoint = "Record points should be greater than 0";
    }
    if (!formData.recordPoint) {
      newErrors.recordPoint = "Record points are required";
    }
    if (!formData.difficultyLevel) {
      newErrors.difficultyLevel = "Difficulty level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty children items and format dates
    const payload = {
      ...formData,
      activity: showActivitySection
        ? {
            ...formData.activity,
            children: formData.activity.children.filter(
              (item) => item.trim() !== ""
            ),
          }
        : null,
      tips: showTipsSection
        ? {
            ...formData.tips,
            children: formData.tips.children.filter(
              (item) => item.trim() !== ""
            ),
          }
        : null,
      // Convert dates to ISO format
      activeFrom: new Date(formData.activeFrom).toISOString(),
      activeTo: formData.activeTo
        ? new Date(formData.activeTo).toISOString()
        : null,
      recordPoint: parseInt(formData.recordPoint) || 0,
    };

    dispatch(upsertHabit(payload)).then((action) => {
      if (upsertHabit.fulfilled.match(action)) {
        if (onSuccess) onSuccess();
      }
    });
  };

  useEffect(() => {
    if (habitData) {
      const hasActivity =
        habitData.activity &&
        (habitData.activity.text ||
          (habitData.activity.children &&
            habitData.activity.children.length > 0));

      const hasTips =
        habitData.tips &&
        (habitData.tips.text ||
          (habitData.tips.children && habitData.tips.children.length > 0));

      setFormData({
        id: habitData.id || "",
        title: habitData.title || "",
        activity: habitData.activity || { text: "", children: [""] },
        tips: habitData.tips || { text: "", children: [""] },
        recordPoint: habitData.recordPoint || 0,
        difficultyLevel: habitData.difficultyLevel || "BEGINNER",
        activeFrom: habitData.activeFrom
          ? new Date(habitData.activeFrom).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        activeTo: habitData.activeTo
          ? new Date(habitData.activeTo).toISOString().split("T")[0]
          : "",
        focusAreaId: habitData.focusAreaId || "",
      });

      setShowActivitySection(hasActivity);
      setShowTipsSection(hasTips);
    }
    setErrors({});
  }, [habitData]);

  useEffect(() => {
    dispatch(getAllFocusAreas());
  }, [dispatch]);

  return (
    <div>
      <form>
        <InputField
          placeholder={"e.g. Morning Exercise"}
          label={"Habit Title"}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        {/* Record Points Field */}
        <InputField
          className="mt-4"
          type="number"
          label={"Record Points"}
          placeholder={"Points earned for completing this habit"}
          value={formData.recordPoint}
          onChange={(e) => handleChange("recordPoint", e.target.value)}
          error={errors.recordPoint}
          min="0"
        />

        {/* Activity Section - Optional */}
        <div className="mt-4">
          <div
            className="flex items-center cursor-pointer p-2 bg-gray-100 rounded-md"
            onClick={() => setShowActivitySection(!showActivitySection)}
          >
            <i
              className={`fas ${
                showActivitySection ? "fa-chevron-down" : "fa-chevron-right"
              } mr-2`}
            ></i>
            <h3 className="text-lg font-medium text-gray-700">
              Activity Details (Optional)
            </h3>
            <button
              type="button"
              className="ml-auto text-sm text-blue-600 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                setShowActivitySection(true);
              }}
            ></button>
          </div>

          {showActivitySection && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md">
              <InputField
                label={"Activity Description"}
                placeholder={"Describe the habit activity"}
                value={formData.activity.text}
                type="textarea"
                rows="3"
                onChange={(e) =>
                  handleNestedChange("activity", "text", e.target.value)
                }
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
                    />
                    {formData.activity.children.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
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
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => addChildItem("activity", "children")}
                >
                  + Add Step
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section - Optional */}
        <div className="mt-4">
          <div
            className="flex items-center cursor-pointer p-2 bg-gray-100 rounded-md"
            onClick={() => setShowTipsSection(!showTipsSection)}
          >
            <i
              className={`fas ${
                showTipsSection ? "fa-chevron-down" : "fa-chevron-right"
              } mr-2`}
            ></i>
            <h3 className="text-lg font-medium text-gray-700">
              Tips (Optional)
            </h3>
            <button
              type="button"
              className="ml-auto text-sm text-blue-600 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                setShowTipsSection(true);
              }}
            ></button>
          </div>

          {showTipsSection && (
            <div className="mt-2 p-4 border border-gray-200 rounded-md">
              <InputField
                label={"Tips Description"}
                placeholder={"Provide general tips for this habit"}
                value={formData.tips.text}
                type="textarea"
                rows="3"
                onChange={(e) =>
                  handleNestedChange("tips", "text", e.target.value)
                }
              />

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Tips
                </label>
                {formData.tips.children.map((tip, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <InputField
                      placeholder={`Tip ${index + 1}`}
                      value={tip}
                      onChange={(e) =>
                        handleNestedChange(
                          "tips",
                          "children",
                          e.target.value,
                          index
                        )
                      }
                      className="flex-1"
                    />
                    {formData.tips.children.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() =>
                          removeChildItem("tips", "children", index)
                        }
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => addChildItem("tips", "children")}
                >
                  + Add Tip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Level */}
        <div className="mt-4">
          <DropDown
            id="difficultyLevel"
            label="Difficulty Level"
            required
            optionsObject={difficultyLevels}
            selected={formData.difficultyLevel}
            error={errors.difficultyLevel}
            onChange={(e) => handleChange("difficultyLevel", e.target.value)}
            placeholder="Select difficulty level"
          />
        </div>

        {/* Date Fields */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <InputField
            type="date"
            label="Active From"
            value={formData.activeFrom}
            onChange={(e) => handleChange("activeFrom", e.target.value)}
            error={errors.activeFrom}
            required
          />
          <InputField
            type="date"
            label="Active To (Optional)"
            value={formData.activeTo}
            onChange={(e) => handleChange("activeTo", e.target.value)}
          />
        </div>

        {/* Focus Area Dropdown */}
        <div className="mt-4">
          <DropDown
            id="focusArea"
            label="Focus Area"
            required
            optionsObject={focusAreas.items || []}
            selected={formData.focusAreaId}
            onChange={(e) => handleChange("focusAreaId", e.target.value)}
            placeholder="Select a focus area"
            error={errors.focusAreaId}
          />
        </div>

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
            {formData.id ? "Update Habit" : "Create Habit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HabitUpsertForm;
