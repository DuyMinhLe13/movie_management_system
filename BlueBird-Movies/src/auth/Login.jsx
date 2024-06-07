import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const usernameRef = useRef();
  const naviage = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [option, setOption] = useState("");

  const handleSubmit = async (e) => {
    if(username == 'Admin' && password == 'Admin' && option == 'Admin')
        naviage('/admin');
  };
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  return (
    <div className="h-screen text-white flex font-sans text-center flex flex-col items-center justify-center">
      <div className="text-4xl font-bold">Login</div>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center border border-gray-300 rounded-md mt-30 p-10 w-450">
        <div className="mb-5">
          <label className="mr-10 w-100 h-30">Username</label>
          <input
            className="w-48 h-8 p-2 text-black rounded-md border border-gray-300 transition duration-100 ease-in-out focus:outline-green-400 focus:outline-offset-1px focus:scale-105"
            ref={usernameRef}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label className="mr-10 w-100 h-30">Password</label>
          <input
            className="w-48 h-8 p-2 text-black rounded-md border border-gray-300 transition duration-100 ease-in-out focus:outline-green-400 focus:outline-offset-1px focus:scale-105"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-5">
            <label className="mr-10 w-100 h-30">Role</label>
            <select 
                className="text-black color-white w-48 h-8 rounded-md border border-white transition duration-100 ease-in-out focus:outline-green-400 focus:outline-offset-1px focus:scale-105"
                onChange={(e) => setOption(e.target.value)}
            >
                <option value="" disabled selected hidden>Select your role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
            </select>
        </div>
        <div className="">
          <button className="h-10 w-28 text-lg text-black bg-white rounded-md cursor-pointer transition duration-100 ease-in-out hover:bg-green-500 hover:text-white hover:border-gray-300 transform hover:scale-105">Login</button>
        </div>
      </form>
    </div>
  );
}
