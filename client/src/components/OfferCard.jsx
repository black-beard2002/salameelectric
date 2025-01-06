import logo from "../assets/logo.svg";
import { useAuthStore } from "../store/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
function OfferCard({ offer, onDelete }) {
  const phoneNumber = "96103219099"; // Replace with the desired phone number
  const message = `Hello, I want to inquire about ${offer.title}`; // Default message
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const discountPercentage = Math.round(
    ((offer.defaultPrice - offer.price) / offer.defaultPrice) * 100
  );

  const { user, isAuthenticated } = useAuthStore();
  return (
    <div className="relative mb-14 flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
        <img
          src={offer.image || logo}
          alt="Offer Image"
          className="h-full w-full max-w-full max-h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          {offer.title}
        </h5>
        <p className="block font-sans text-base break-words font-light leading-relaxed text-inherit antialiased">
          {offer.description}
        </p>
        <div className="w-full mt-5 flex flex-row items-center justify-between">
          <div>
            <p className="block font-medium font-sans text-base break-words leading-relaxed text-inherit antialiased">
              Old Price:{" "}
              <span className="font-bold">{offer.defaultPrice}$</span>
            </p>
            <p className="block font-medium font-sans text-base break-words leading-relaxed text-inherit antialiased">
              New Price: <span className="font-bold">{offer.price}$</span>
            </p>
          </div>
          <div className="bg-blue-400 font-medium text-lg rounded-lg p-3">
            {discountPercentage}% OFF
          </div>
        </div>
      </div>
      <div className="p-6 pt-0 w-full flex justify-between items-center">
        <button
          data-ripple-light="true"
          type="button"
          className="select-none  rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          <a
            href={whatsAppLink}
            className="w-full h-full inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 " />
            More Details
          </a>
        </button>
        {isAuthenticated && user.username !== "guest" && (
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => onDelete(offer._id)}
            className="w-4 h-4 cursor-pointer hover:text-red-400 duration-200 text-red-500"
          />
        )}
      </div>
    </div>
  );
}

export default OfferCard;
