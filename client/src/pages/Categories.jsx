import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarCheck,
  faImage,
  faPenToSquare,
  faPlusCircle,
  faSearch,
  faT,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/category";
import Loader from "../components/Loader";
import CustomAlert from "../components/CustomAlert";
import { useAuthStore } from "../store/auth";
import Card2 from "../components/ConfirmCard";

// Define TypeScript-like prop types for better type safety
const initialCategory = {
  name: "",
  items: [],
  image: null,
};

function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState(initialCategory);

  const navigate = useNavigate();
  const {
    categories,
    createCategory,
    fetchCategories,
    isLoaded,
    deleteCategory,
    updateCategory,
  } = useCategoryStore();

  useEffect(() => {
    if (!isLoaded) {
      fetchCategories();
    }
  }, [isLoaded, fetchCategories]);

  const showAlert = (msg, clr, duration = 2000) => {
    setMessage(msg);
    setColor(clr);
    setAlert(true);
    setTimeout(() => setAlert(false), duration);
  };

  const handleCatClick = (catId) => {
    if (catId) {
      navigate(`/app/categories/${catId}`);
    }
  };

  const handleNewCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      showAlert("Enter a valid name", "yellow-500");
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (state === 0) {
        const formData = new FormData();
        formData.append("name", newCategory.name);
        formData.append("items", JSON.stringify([]));
        if (image) {
          formData.append("image", image);
        }
        result = await createCategory(formData);
      } else {
        const formData = new FormData();
        formData.append("name", newCategory.name);
        formData.append("items", newCategory.items);
        if (image) {
          formData.append("image", image);
        }
        result = await updateCategory(selectedCategory._id, formData);
      }

      if (result.success) {
        showAlert(
          "Category " + (state === 0 ? "Added" : "Updated") + "!",
          "green-500"
        );
        setIsEditing(false);
        setNewCategory(initialCategory);
        setImage(null);
      } else {
        showAlert(result.message || "Operation failed!", "red-500");
      }
    } catch (error) {
      showAlert("An error occurred", "red-500");
      console.error("Category operation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleting = async (password) => {
    if (!selectedCategory?._id) return;

    if (password !== user?.password) {
      showAlert("Wrong password", "red-500");
      return;
    }

    try {
      const result = await deleteCategory(selectedCategory._id);
      if (result.success) {
        showAlert("Category removed", "green-500", 3000);
        setIsDeleting(false);
      } else {
        showAlert("Something went wrong!", "yellow-500", 3000);
      }
    } catch (error) {
      showAlert("An error occurred", "red-500");
      console.error("Delete error:", error);
    }
  };

  const handleCategoryUpdate = (category) => {
    if (!category) return;

    setState(1);
    setSelectedCategory(category);
    setNewCategory({
      name: category.name || "",
      items: category.items || [],
      image: category.image || null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
    setIsEditing(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setNewCategory({ ...newCategory, image: file });
      setImage(file);
    } catch (error) {
      console.error("Error processing image:", error);
      showAlert(
        "Error processing image. Please try a different image.",
        "red-500"
      );
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2 flex-1 min-h-fit bg-gray-50 dark:bg-gray-700">
      {isDeleting && selectedCategory && (
        <Card2
          target={selectedCategory.name}
          onConfirm={handleDeleting}
          onCancel={() => setIsDeleting(false)}
        />
      )}

      {alert && <CustomAlert message={message} color={color} />}

      {isEditing && (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleNewCategory}
            className="dark:bg-gray-700 bg-slate-100 flex flex-col gap-2 rounded-lg p-4 xs:p-6 w-72 xs:w-96"
          >
            <h2 className="text-lg font-semibold mb-4 dark:text-slate-100">
              {state === 0 ? "New Category" : "Update Category"}
            </h2>

            <div className="bg-slate-300 flex pl-2 flex-row gap-1 w-full rounded-xl p-1 items-center dark:bg-gray-800">
              <FontAwesomeIcon
                icon={faT}
                className="w-4 dark:text-slate-200 h-4"
              />
              <input
                type="text"
                value={newCategory.name}
                minLength={1}
                required
                maxLength={35}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="w-full border-none text-sm rounded text-zinc-900 dark:text-slate-50 bg-transparent"
                placeholder="name"
              />
            </div>

            <div className="flex flex-col w-full max-w-xs gap-1 pl-1">
              <label className="text-sm dark:text-slate-100 text-gray-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <FontAwesomeIcon
                  icon={faImage}
                  className="w-4 mr-1 dark:text-slate-200 h-4"
                />
                Image
              </label>
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              />
            </div>

            {state === 1 && newCategory.createdAt && (
              <div className="flex flex-col gap-1 mt-3">
                <div className="bg-slate-300 flex flex-col text-gray-950 w-full font-light rounded-xl p-2 dark:bg-gray-600">
                  <span className="dark:text-gray-400 text-gray-950">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    Created at:
                  </span>
                  {newCategory.createdAt}
                </div>
                <div className="bg-slate-300 flex flex-col text-gray-950 w-full font-light rounded-xl p-2 dark:bg-gray-600">
                  <span className="dark:text-gray-400 text-gray-950">
                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
                    Last updated at:
                  </span>
                  {newCategory.updatedAt}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewCategory(initialCategory);
                  setImage(null);
                }}
                className="bg-gray-300 w-20 hover:bg-gray-400 text-gray-700 rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#FFD700] hover:bg-[#d7bb1c] w-20 text-white rounded px-4 py-2"
              >
                {isLoading ? <Loader /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      <p className="dark:text-slate-100 text-zinc-800 font-sans font-semibold text-xl xs:text-2xl mb-5">
        Categories
      </p>

      <div className="flex z-10 mb-10 p-2 rounded-3xl gap-2 flex-row w-80 mx-auto bg-white">
        <FontAwesomeIcon
          icon={faSearch}
          className="w-5 h-5 bg-[#1985a1] text-white rounded-full p-2"
        />
        <input
          placeholder="Search for category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white text-zinc-800 text-md rounded-lg p-1 w-full focus:outline-none"
        />
      </div>

      {isAuthenticated && user?.username !== "guest" && (
        <div>
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setState(0);
              setNewCategory(initialCategory);
              setImage(null);
            }}
            className="bg-[#FFD700] items-center gap-1 text-white inline-flex p-2 rounded-xl mb-5"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            New Category
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 p-1 md:grid-cols-5 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white cursor-default dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 flex flex-col items-center"
          >
            <div className="w-full cursor-pointer aspect-square rounded-lg overflow-hidden mb-2">
              {cat.image ? (
                <img
                  src={cat.image.replace("your-bucket-name", "uploads")}
                  alt={cat.name}
                  onClick={() => handleCatClick(cat._id)}
                  className="w-full h-auto transform hover:scale-110 duration-300 object-fit"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  onClick={() => handleCatClick(cat._id)}
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className=" text-xs xs:text-sm font-medium text-gray-700 dark:text-slate-100 text-center truncate w-full">
              {cat.name}
            </p>
            {isAuthenticated && user?.username !== "guest" && (
              <div className="w-full mt-2 flex gap-2 justify-end items-center">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={() => handleCategoryUpdate(cat)}
                  className="w-4 h-4 xs:w-5 xs:h-5 cursor-pointer text-blue-500 hover:text-blue-600"
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => {
                    setIsDeleting(true);
                    setSelectedCategory(cat);
                  }}
                  className="w-4 h-4 xs:w-5 xs:h-5 cursor-pointer text-red-500 hover:text-red-600"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No categories found.
        </div>
      )}
    </div>
  );
}

export default Categories;
