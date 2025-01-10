import { useState } from "react";
import PropTypes from "prop-types";
function Card2(props) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onConfirm(password);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 "></div>

      {/* Popup Card */}
      <div className="w-64 flex flex-col p-4 z-50 mx-auto items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl">
        <div>
          <div className="text-center p-3 flex-auto justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 flex items-center text-[#983a3a] mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h2 className="text-xl font-bold py-4 text-gray-200">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-500 px-2">
              Do you really want to delete &apos;{props.target}&apos;? This
              process cannot be undone
            </p>
          </div>
          <form
            className="p-2 mt-1 flex flex-col gap-3"
            onSubmit={handleSubmit}
          >
            <div className="input flex flex-col w-fit static">
              <label
                htmlFor="input"
                className="text-blue-500 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-[#272934] w-fit"
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Write here..."
                name="input"
                className="border-blue-600 text-slate-200 input px-[10px] py-[11px] text-xs bg-[#272934] border-2 rounded-[5px] w-[210px] focus:outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="flex flex-row items-center gap-2 justify-center">
              <button
                onClick={props.onCancel}
                type="button"
                className=" bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-400 hover:bg-green-500 px-5  py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-full transition ease-in duration-300"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Card2;

Card2.propTypes = {
  target: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
