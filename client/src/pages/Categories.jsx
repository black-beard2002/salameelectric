import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
import reduceImageSize from "../utils/imageReducer";
import CustomAlert from "../components/CustomAlert";
import { useAuthStore } from "../store/auth";
import Card2 from "../components/ConfirmCard";
function Categories() {
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const [alert, setAlert] = useState(false);
  const [state, setState] = useState(0); // 0 means new category, 1 means updating category
  const [selectedCategory, setSelectedCategory] = useState({});
  const [color, setColor] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    items: [],
    image: "",
  });
  const navigate = useNavigate();

  // Access categories directly from the store
  const {
    categories,
    createCategory,
    fetchCategories,
    deleteCategory,
    updateCategory,
  } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCatClick = (catID) => {
    navigate(`/app/categories/${catID}`);
  };

  const handleNewCategory = async (e) => {
    e.preventDefault();
    let result = { success: false, message: "" };
    if (newCategory.name.trim() !== "") {
      setIsLoading(true);
      if (state === 0) {
        result = await createCategory(newCategory);
      } else {
        result = await updateCategory(selectedCategory._id, newCategory);
      }
      console.log(result);

      if (result.success) {
        setAlert(true);
        setColor("green-500");
        setMessage("Category Added !");
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      } else {
        setAlert(true);
        setColor("red-500");
        setMessage(
          state === 0 ? "Failed to Add Category!" : "Failed to update Category!"
        );
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      }
      setIsLoading(false);
      setIsEditing(false);
      return;
    }
    setMessage("enter a valid name");
    setColor("yellow-500");
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  };

  const handelDeleting = async (password) => {
    if (password === user.password) {
      const result = await deleteCategory(selectedCategory._id);
      if (result.success) {
        setMessage("category removed");
        setColor("green-500");
        setAlert(true);
        setIsDeleting(false);
        setTimeout(() => setAlert(false), 3000);
      } else {
        setMessage("something went wrong!");
        setColor("yellow-500");
        setAlert(true);
        setIsDeleting(false);
        setTimeout(() => setAlert(false), 3000);
      }
      return;
    }
    setMessage("wrong password");
    setColor("red-500");
    setAlert(true);
    setTimeout(() => setAlert(false), 2000);
    return;
  };
  const handleCancle = () => {
    setIsDeleting(false);
  };
  const handleCategoryUpdate = (category) => {
    setState(1);
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      items: category.items,
      image: category.image,
    });
    setIsEditing(true);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // First convert to base64
      const base64 = await convertToBase64(file);
      const reducedImage = await reduceImageSize(base64);
      setNewCategory({ ...newCategory, image: reducedImage });
    } catch (error) {
      console.error("Error processing image:", error);
      setAlert(true);
      setColor("red-500");
      setMessage("Error processing image. Please try a different image.");
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    }
  };

  return (
    <div className="p-4 flex-1 min-h-fit bg-gray-50 dark:bg-gray-700">
      {isDeleting && (
        <Card2
          target={selectedCategory.name}
          onConfirm={handelDeleting}
          onCancel={handleCancle}
        />
      )}
      {alert && <CustomAlert message={message} color={color} />}
      {isEditing && (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleNewCategory}
            className="dark:bg-gray-700 bg-slate-100 flex flex-col gap-2 rounded-lg p-6 w-96"
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
                maxLength={20}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="w-full border-none text-sm rounded text-zinc-900 dark:text-slate-50 bg-transparent"
                placeholder="name"
              />
            </div>

            <div className="flex flex-col w-full max-w-xs gap-1 pl-1">
              <label className="text-sm dark:text-slate-100 text-gray-700font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <FontAwesomeIcon
                  icon={faImage}
                  className="w-4 mr-1 dark:text-slate-200 h-4"
                />
                Image
              </label>
              <input
                id="picture"
                type="file"
                accept="*"
                onChange={handleFileUpload}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 w-20 hover:bg-gray-400 text-gray-700 rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#FFD700] w-20 hover:bg-[#d7bb1c] text-white rounded px-4 py-2"
              >
                {isLoading?<Loader/>:'submit'}
              </button>
            </div>
          </form>
        </div>
      )}
      <p className="dark:text-slate-100 text-black font-sans font-semibold text-2xl mb-5">
        Categories
      </p>
      <div className="flex z-10 mb-10 p-2 rounded-3xl gap-2 flex-row w-80 mx-auto bg-white">
        <FontAwesomeIcon
          icon={faSearch}
          className="w-5 h-5 bg-[#1985a1] text-white rounded-full p-2"
        />
        <input
          placeholder="Search for category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white text-zinc-800 text-md rounded-lg p-1 w-full focus:outline-none"
        />
      </div>
      {isAuthenticated && user.username !== "guest" && (
        <div>
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setState(0);
              setNewCategory({ name: "", items: [], image: "" });
            }}
            className="bg-[#FFD700] items-center gap-1 text-white inline-flex p-2 rounded-xl mb-5"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            New Category
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 p-1 md:grid-cols-5 gap-4">
        {categories
          .filter((c) => c.name.toLowerCase().includes(category.toLowerCase()))
          .map((cat) => (
            <div
              key={cat._id}
              className="bg-white cursor-default dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 flex flex-col items-center"
            >
              <div className="w-full cursor-pointer aspect-square rounded-lg overflow-hidden mb-2">
                {cat.image !== "" ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onClick={() => handleCatClick(cat._id)}
                    className="w-full h-full transform hover:scale-110 duration-300 object-cover"
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
              <p className="text-sm font-medium text-gray-700 dark:text-slate-100  text-center truncate w-full">
                {cat.name}
              </p>
              {isAuthenticated && user.username !== "guest" && (
                <div className="w-full mt-2 flex gap-2 justify-end items-center">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => {
                      handleCategoryUpdate(cat);
                    }}
                    className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-600"
                  />
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => {
                      setIsDeleting(true);
                      setSelectedCategory(cat);
                    }}
                    className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-600"
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      {categories.filter((c) =>
        c.name.toLowerCase().includes(category.toLowerCase())
      ).length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No categories found.
        </div>
      )}
    </div>
  );
}

export default Categories;
