import React, { useState } from "react";
import Head from "next/head";
import { useAuth } from "~~/context/AuthContext";

const Signup = () => {
  const { user, signup } = useAuth();
  console.log(user);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      await signup(data.email, data.password);
    } catch (err) {
      console.log(err);
    }

    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>
      <div>
        <form onSubmit={handleSignup} className="flex flex-col justify-center items-center py-24 gap-6">
          <input
            className="input focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 border font-medium placeholder:text-gray-100 text-gray-100"
            type="email"
            placeholder="Enter email"
            required
            onChange={(e: any) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
          />

          <input
            className="input focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 border font-medium placeholder:text-gray-100 text-gray-100"
            type="password"
            placeholder="Password"
            required
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
          />

          <button type="submit" className="btn btn-primary px-6">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
