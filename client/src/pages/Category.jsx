import { useParams } from "react-router-dom";
import CategoryComponentCard from "../components/CategoryComponentCard";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faA,
  faCalendar,
  faCalendarCheck,
  faD,
  faDollarSign,
  faPlusCircle,
  faSearch,
  faT,
} from "@fortawesome/free-solid-svg-icons";
import { useCategoryStore } from "../store/category";
import Card2 from "../components/ConfirmCard";
import { useState } from "react";
import CustomAlert from "../components/CustomAlert";
import { useAuthStore } from "../store/auth";
function Category() {
  const { id } = useParams();
  const { categories, updateCategory } = useCategoryStore();
  const [item, setItem] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [state, setState] = useState(0); // 0 means new category, 1 means updating category
  const [alert, setAlert] = useState(false);
  const [color, setColor] = useState("");
  const { user, isAuthenticated } = useAuthStore();
  const [message, setMessage] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    description: "",
    availability: true,
  });

  const category = categories?.find((cat) => cat._id === id);
  if (!category) {
    // Fallback for undefined category
    return (
      <div className="text-center text-gray-500 p-4 flex-1 flex items-center justify-center">
        <p>No category found.</p>
      </div>
    );
  }

  const handleNewItem = async (e) => {
    e.preventDefault();
    if (newItem.name.trim() !== "" && newItem.price > 0) {
      setIsLoading(true);
      let result = { success: false, message: "" };
      if (state === 0) {
        const newCategory = {
          ...category,
          items: [...category.items, newItem],
        };
        result = await updateCategory(id, newCategory);
      } else {
        const updatedCategory = {
          ...category,
          items: category.items.map((item) => {
            if (item._id === selectedItem._id) {
              const cleanedNewItem = { ...newItem };
              delete cleanedNewItem.createdAt;
              delete cleanedNewItem.updatedAt;
              return { ...item, ...cleanedNewItem };
            }
            return item;
          }),
        };

        result = await updateCategory(id, updatedCategory);
      }

      if (result.success) {
        setAlert(true);
        setColor("green-500");
        setMessage(
          state === 0 ? "Category Item Added !" : "Category Item Updated !"
        );
        setTimeout(() => {
          setAlert(false);
        }, 2000);
        console.log(newItem);
      } else {
        setAlert(true);
        setColor("red-500");
        setMessage("Something went wrong!");
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      }
      setIsLoading(false);
      setIsEditing(false);
      setNewItem({ name: "", price: 0, description: "", availability: true });
      return;
    }
    setAlert(true);
    setColor("red-500");
    setMessage("Enter a valid name and price>0");
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  };
  const handleItemUpdate = (item) => {
    setState(1);
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      availability: item.availability,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
    setIsEditing(true);
  };

  const handelDeleting = async (password) => {
    if (password === user.password) {
      const updatedCategory = {
        ...category,
        items: category.items.filter((i) => i._id !== selectedItem._id),
      };
      const result = await updateCategory(id, updatedCategory);

      if (result.success) {
        setColor("green-500");
        setMessage("Category Item Deleted !");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      } else {
        setColor("red-500");
        setMessage("Failed to Delete Category Item!");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 2000);
      }
      setIsDeleting(false);
      return;
    }
    setMessage("wrong password");
    setColor("red-500");
    setAlert(true);
    setTimeout(() => setAlert(false), 2000);
  };
  const handleCancle = () => {
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-1 p-1">
      {alert && <CustomAlert message={message} color={color} />}
      {isDeleting && (
        <Card2
          target={selectedItem.name}
          onConfirm={handelDeleting}
          onCancel={handleCancle}
        />
      )}
      {isEditing && (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-60">
          <form
            onSubmit={handleNewItem}
            className="dark:bg-gray-700 bg-slate-100 flex flex-col gap-2 rounded-lg p-6 w-96"
          >
            <h2 className="text-lg font-semibold mb-4 dark:text-slate-100">
              {state === 0 ? "New Item" : "Update Item"}
            </h2>
            <div className="bg-slate-300 flex pl-2 flex-row gap-1 w-full rounded-xl p-1 items-center dark:bg-gray-800">
              <FontAwesomeIcon
                icon={faT}
                className="w-4 dark:text-slate-200 h-4"
              />
              <input
                type="text"
                value={newItem.name}
                minLength={1}
                required
                maxLength={20}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full border-none text-sm rounded text-zinc-900 dark:text-slate-50 bg-transparent"
                placeholder="name"
              />
            </div>
            <div className="bg-slate-300 flex flex-row pl-2 gap-1 p-1 rounded-xl items-center dark:bg-gray-800">
              <FontAwesomeIcon
                icon={faD}
                className="w-4 dark:text-slate-200 h-4"
              />
              <input
                type="text"
                value={newItem.description}
                minLength={1}
                maxLength={200}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="w-full focus:outline-none  text-sm border-none rounded   text-zinc-900 dark:text-slate-50 bg-transparent"
                placeholder="description"
              />
            </div>
            <div className="bg-slate-300 flex flex-col pl-2 gap-1 p-1 rounded-xl  dark:bg-gray-800">
              <div className="flex flex-row items-center">
                <FontAwesomeIcon
                  icon={faA}
                  className="w-4 dark:text-slate-200 h-4"
                />
                <p className="text-sm ml-3 text-gray-500">availability</p>
              </div>

              <div
                className="inline-flex justify-center rounded-md mt-1 shadow-sm w-full"
                role="group"
              >
                <button
                  type="button"
                  onClick={() => {
                    setNewItem({ ...newItem, availability: true });
                  }}
                  className="px-2 py-1 w-1/2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  available
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewItem({ ...newItem, availability: false });
                  }}
                  className="px-2 py-1 text-sm w-1/2 font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  unavailable
                </button>
              </div>
            </div>
            <div className="bg-slate-300 flex flex-row pl-2 gap-1 p-1 rounded-xl items-center dark:bg-gray-800">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="w-4 dark:text-slate-200 h-4"
              />
              <input
                type="number"
                value={newItem.price}
                minLength={1}
                required
                maxLength={5}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full focus:outline-none  text-sm border-none rounded   text-zinc-900 dark:text-slate-50 bg-transparent"
                placeholder="price $"
              />
            </div>
            {state === 1 && (
              <div className="flex flex-col gap-1 mt-3">
                <div className="bg-slate-300 flex flex-col text-gray-950 w-full font-light rounded-xl p-2 dark:bg-gray-600">
                  <span className="dark:text-gray-400 text-gray-950">
                    <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                    created at:
                  </span>{" "}
                  {newItem.createdAt}
                </div>
                <div className="bg-slate-300 flex flex-col text-gray-950 w-full font-light rounded-xl p-2 dark:bg-gray-600">
                  <span className="dark:text-gray-400 text-gray-950">
                    <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
                    last updated at:
                  </span>{" "}
                  {newItem.updatedAt}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 w-20 hover:bg-gray-400 text-gray-700 rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#FFD700] hover:bg-[#d7bb1c] w-20 text-white rounded px-4 py-2"
              >
                {isLoading ? <Loader /> : "submit"}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex-1 flex p-2 flex-col">
        {category.image !== "" ? (
          <img
            src={category.image}
            alt={category.name}
            className="max-w-full h-64 md:aspect-video lg:aspect-video md:h-80 lg:h-96 mb-5 mx-auto max-h-80  rounded-lg"
          />
        ) : (
          <div className="w-full flex items-center justify-center mb-5 mx-auto lg:w-1/2 h-72 rounded-lg">
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
        <div className="flex  p-2 rounded-3xl gap-2 flex-row w-80 mx-auto bg-white">
          <FontAwesomeIcon
            icon={faSearch}
            className="w-5 h-5 bg-[#1985a1] text-white rounded-full p-2"
          />
          <input
            placeholder="Search for item..."
            value={item}
            type="text"
            onChange={(e) => setItem(e.target.value)}
            className="bg-white text-zinc-800 text-md rounded-lg p-1 w-full border-none focus:outline-none"
          />
        </div>
        <span className="text-sm mb-5 text-gray-500 text-center">
          Search by name, specs, or price
        </span>
        <p className="text-2xl font-bold text-zinc-700 dark:text-slate-100 mb-2">
          {category.name} List:
        </p>
        {isAuthenticated && user.username !== "guest" && (
          <div>
            <button
              type="button"
              onClick={() => {setIsEditing(true);setState(0);}}
              className="bg-[#FFD700] items-center gap-1 text-white inline-flex p-2 rounded-xl mb-5"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              New Item
            </button>
          </div>
        )}
        <div className="flex flex-col flex-1">
          {category.items.length !== 0 ? (
            category.items
              ?.filter(
                (i) =>
                  i.name.toLowerCase().includes(item.toLowerCase()) ||
                  i.description.toLowerCase().includes(item.toLowerCase()) ||
                  i.price.toString().includes(item)
              )
              .map((item) => (
                <CategoryComponentCard
                  item={item}
                  key={item._id}
                  onUpdate={() => handleItemUpdate(item)}
                  onDelete={() => {
                    setIsDeleting(true);
                    setSelectedItem(item);
                  }}
                />
              ))
          ) : (
            <div className="mx-auto text-gray-500 text-lg mt-10">
              No items to show
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
