import { faUser, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useAuthStore } from "../store/auth";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
function Welcome() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginError, guestLogin, clearError } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setWarning(true);
      return;
    }
    setIsLoading(true);
    setWarning(false);
    await login({ username: username, password: password });
    setIsLoading(false);
    navigate("/app");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (warning) setWarning(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (warning) setWarning(false);
  };

  const handleGuest = () => {
    guestLogin();
    navigate("/app");
    clearError();
  };

  return (
    <div className="flex flex-1 max-w-full h-screen items-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-cover bg-center justify-center">
      <div className="relative min-h-fit bg-zinc-900 px-8 py-6 mt-4 text-left rounded-xl shadow-lg w-72 sm:w-72">
        <form onSubmit={handleLogin} className="min-h-96 ">
          <div className="flex flex-col justify-center items-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <div className="w-8 h-8 flex rounded-full items-center justify-center bg-gray-700">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <p className="m-0 text-[16px] font-semibold text-white">
                Welcome Back!
              </p>
              <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                Get started with our app, press the guest button to continue
              </span>
            </div>
            <div className="w-full flex flex-col gap-2">
              {loginError && (
                <p className="text-red-500 text-xs mx-auto">{loginError}</p>
              )}
              <label className="font-semibold text-xs text-gray-400">
                Username
              </label>
              <input
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
                className={`border-2 rounded-lg px-3 text-slate-100 py-2 mb-5 text-sm w-full outline-none ${
                  warning && username.trim() === ""
                    ? "border-red-500"
                    : "dark:border-gray-500"
                } bg-gray-900`}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="font-semibold text-xs text-gray-400">
              Password
            </label>
            <input
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
              className={`border-2 rounded-lg px-3 text-slate-100 py-2 mb-5 text-sm w-full outline-none ${
                warning && password.trim() === ""
                  ? "border-red-500"
                  : "dark:border-gray-500"
              } bg-gray-900`}
              type="password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="py-1 px-8 mb-2 flex items-center justify-center bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserSecret} className="mx-1" />
                  Login
                </>
              )}
            </button>
            <p className="text-white text-center underline w-full">OR</p>
          </div>
        </form>
        <div>
          <button
            type="button"
            onClick={handleGuest}
            className="py-2 px-8 bg-zinc-500 text-sm hover:bg-zinc-700 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center  font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
          >
            <FontAwesomeIcon icon={faUser} className="mx-1" />
            Login as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
