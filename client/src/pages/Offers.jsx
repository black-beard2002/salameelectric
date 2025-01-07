import { useEffect, useState } from "react";
import { useOfferStore } from "../store/offer";
import { useAuthStore } from "../store/auth";
import OfferCard from "../components/OfferCard";
import reduceImageSize from "../utils/imageReducer";
import { useCategoryStore } from "../store/category";
import CustomAlert from "../components/CustomAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faPercentage,
  faX,
  faMinus,
  faPlus,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";

function Offers() {
  const { offers, fetchOffers, createOffer, deleteOffer } = useOfferStore();
  const { user, isAuthenticated } = useAuthStore();
  const { categories } = useCategoryStore();
  const [alert, setAlert] = useState(false);
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");
  const [imageInputText,setImageInputText]=useState("upload image");
  const [fullItems, setFullItems] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  // Form states
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  // Changed structure to store item with quantity
  const [offerItems, setOfferItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);


  const findItemInCategories = (itemName) => {
    for (const category of categories) {
      const item = category.items.find((item) => item.name === itemName);
      if (item) return item;
    }
    return null;
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const foundItem = findItemInCategories(item.name);
      return total + (foundItem ? foundItem.price * item.quantity : 0);
    }, 0);
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
    setImageInputText("uploading image..");
    try {
      const file = e.target.files[0];
      if (!file) return;
      const base64 = await convertToBase64(file);
      const reducedImage = await reduceImageSize(base64);
      setImage(reducedImage);
      setImageInputText("image uploaded!");
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

  const handleItemSelect = (e) => {
    const selectedItem = categories
      .flatMap((category) => category.items)
      .find((item) => item._id === e.target.value);
    const selectedItemName = selectedItem.name;
    if (!selectedItemName) return;

    if (!offerItems.some((item) => item.name === selectedItemName)) {
      const newItems = [...offerItems, { name: selectedItemName, quantity: 1 }];
      setOfferItems(newItems);
      const total = calculateTotalPrice(newItems);
      setTotalPrice(total);
      setNewPrice(total);
      setFullItems([...fullItems, selectedItem]);
    }
  };

  const updateItemQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) return;

    const newItems = offerItems.map((item) =>
      item.name === itemName ? { ...item, quantity: newQuantity } : item
    );
    setOfferItems(newItems);
    const total = calculateTotalPrice(newItems);
    setTotalPrice(total);
    setNewPrice(total);
  };

  const removeItem = (itemToRemove) => {
    const newItems = offerItems.filter((item) => item.name !== itemToRemove);
    setOfferItems(newItems);
    const total = calculateTotalPrice(newItems);
    setTotalPrice(total);
    setNewPrice(total);
  };

  const handleOfferDelete = async (id) => {
    const result = await deleteOffer(id);
    if (result.success) {
      setMessage("offer deleted");
      setColor("green-500");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }
    setMessage("error deleting offer");
    setColor("red-500");
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 2000);
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (title.trim() === "" || description.trim() === "" || image === null) {
        setColor("red-500");
        setMessage("Please provide all fields");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        return;
      }
      if (offerItems.length === 0) {
        setColor("yellow-500");
        setMessage("Please add at least one item to the offer");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        return;
      }
      setIsLoading(true);
      const offer = {
        title: title,
        description: description,
        image: image,
        items: fullItems,
        price: newPrice,
        defaultPrice: totalPrice,
      };
      const result = await createOffer(offer);
      if (result.success) {
        setColor("green-500");
        setMessage("Offer created successfully");
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        setIsLoading(false);
      }
      else{
      setColor("red-500");
      setMessage("Failed to create offer");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      
      setOfferItems([]);
      setFullItems([]);
      setIsLoading(false);
      setTotalPrice(0);
      setTitle("");
      setDescription("");
      setImage(null);
      setNewPrice(0);
    };}

    return (
      <div className="flex flex-col flex-1 p-1">
        {alert && <CustomAlert message={message} color={color} />}
        <p className="text-2xl w-full justify-center sm:justify-center md:justify-center lg:justify-start font-sans font-semibold inline-flex items-center flex-row gap-1 mb-10 dark:text-slate-100">
          <FontAwesomeIcon
            icon={faPercentage}
            className="w-5 h-5 bg-blue-500 p-1 rounded-full text-slate-50"
          />
          OFFERS
        </p>
        {isAuthenticated && user.username !== "guest" ? (
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg overflow-hidden min-h-fit mb-14 shadow-xl w-11/12 mx-auto sm:mx-auto md:mx-auto lg:mx-0 sm:w-11/12 md:w-3/4 lg:w-2/3">
            <div className="p-4">
              <p className="text-lg font-semibold mb-2 text-white w-full inline-flex items-center justify-between">
                Hello{" "}
                {user.username !== "guest" ? user.username : "Electrician"},
                Welcome to Your Electronics Hub!
                <FontAwesomeIcon
                  icon={faBoltLightning}
                  className="w-8 h-8 text-white"
                />
              </p>
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4"
              >
                <div className="w-full flex flex-row justify-between gap-4">
                  <div className="input flex flex-col w-[45%] static">
                    <label
                      htmlFor="title"
                      className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] dark:bg-[#323440] bg-slate-100 w-fit"
                    >
                      Title:
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="offer title..."
                      className="border-blue-600 text-zinc-900 font-medium dark:text-slate-200 input px-[10px] py-[11px] text-xs dark:bg-[#323440] bg-slate-100 border-2 rounded-[5px] w-full focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="input flex flex-col w-[45%] static">
                    <label
                      htmlFor="image"
                      className="text-blue-500 z-10 text-xs font-semibold relative top-2 ml-[7px] px-[3px] dark:bg-[#323440] bg-slate-100 w-fit"
                    >
                      Image:
                    </label>
                    <div className="relative">
                      <input
                        id="image"
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*"
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-blue-600 text-zinc-900 truncate font-medium dark:text-slate-200 px-[10px] py-[11px] text-xs dark:bg-[#323440] bg-slate-100 border-2 rounded-[5px] w-full">
                        {imageInputText}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row justify-between gap-4">
                  <div className="input flex flex-col w-[20%] static">
                    <label
                      htmlFor="price"
                      className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] dark:bg-[#323440] bg-slate-100 w-fit"
                    >
                      Price:
                    </label>
                    <input
                      id="price"
                      type="number"
                      value={newPrice || 0}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="border-blue-600 text-zinc-900 font-medium dark:text-slate-200 input px-[10px] py-[11px] text-xs dark:bg-[#323440] bg-slate-100 border-2 rounded-[5px] w-full focus:outline-none"
                    />
                  </div>
                  <div className="input flex flex-col w-[70%] static">
                    <label
                      htmlFor="description"
                      className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] dark:bg-[#323440] bg-slate-100 w-fit"
                    >
                      Description:
                    </label>
                    <input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="describe your offer..."
                      className="border-blue-600 text-zinc-900 font-medium dark:text-slate-200 input px-[10px] py-[11px] text-xs dark:bg-[#323440] bg-slate-100 border-2 rounded-[5px] w-full focus:outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-1">
                  <div className="input flex flex-col w-full static">
                    <label
                      htmlFor="items"
                      className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] dark:bg-[#323440] bg-slate-100 w-fit"
                    >
                      Items:
                    </label>
                    <select
                      id="items"
                      required={offerItems.length === 0}
                      onChange={handleItemSelect}
                      className="border-blue-600 text-zinc-900 font-medium dark:text-slate-200 input px-[10px] py-[11px] text-xs dark:bg-[#323440] bg-slate-100 border-2 rounded-[5px] w-full focus:outline-none placeholder:text-zinc-500"
                    >
                      <option value="">Select an item</option>
                      {categories.map((category) =>
                        category.items.filter((item)=>item.availability).map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name} - ${item.price}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div className="w-full flex flex-wrap gap-2">
                  {offerItems.length === 0 && (
                    <p className="w-full text-sm text-center">
                      No items selected yet!
                    </p>
                  )}
                  {offerItems.map((item, index) => {
                    const itemDetails = findItemInCategories(item.name);
                    return (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-between gap-2 rounded-2xl px-3 py-2 bg-slate-200"
                      >
                        <span className="text-sm font-medium text-slate-600">
                          {item.name} - ${itemDetails?.price || 0}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(item.name, item.quantity - 1)
                            }
                            className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-blue-700"
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="w-2 h-2"
                            />
                          </button>
                          <span className="text-sm text-slate-700 font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(item.name, item.quantity + 1)
                            }
                            className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-blue-700"
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="w-2 h-2"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.name)}
                            className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 ml-1"
                          >
                            <FontAwesomeIcon icon={faX} className="w-2 h-2" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-row items-center justify-center w-full gap-2">
                  <FontAwesomeIcon
                    icon={faSackDollar}
                    className="w-4 h-4 text-slate-50"
                  />
                  <span className="text-slate-100 font-bold">
                    Default Total Price: {totalPrice}
                  </span>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {isLoading?<Loader/>:'Create Offer'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg overflow-hidden min-h-fit mb-14 shadow-xl w-4/5 mx-auto sm:mx-auto md:mx-auto lg:mx-0 sm:w-4/5 md:w-3/4 lg:w-1/2">
            <div className="p-4">
              <p className="text-lg font-semibold mb-2 text-white w-full inline-flex items-center justify-between">
                Hello{" "}
                {user.username !== "guest" ? user.username : "Electrician"},
                Welcome to Your Electronics Hub!
                <FontAwesomeIcon
                  icon={faBoltLightning}
                  className="w-8 h-8 text-white"
                />
              </p>
              <p className="text-sm mb-4 text-white">
                We&apos;re thrilled to have you here! Whether you&apos;re a professional
                electrician, an engineer, or an enthusiast, our platform is
                designed to provide you with top-notch electronic components at
                unbeatable prices. Check out our exclusive offers and elevate
                your projects with high-quality products. way!
              </p>
            </div>
          </div>
        )}
        <div className="flex w-full flex-wrap justify-center gap-x-5">
          {offers.length===0 && (<p className="text-gray-600 mt-5">No offers available at the moment!</p>)}
          {offers.map((offer) => (
            <OfferCard key={offer._id} offer={offer} onDelete={handleOfferDelete}/>
          ))}
        </div>
      </div>
    );
  };

export default Offers;
