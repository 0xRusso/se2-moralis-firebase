import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "~~/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { user, login } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      router.push("/dashboard");
    }
  }, [user]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>
      <div>
        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center py-24 gap-6">
          <input
            className="input focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 border font-medium placeholder:text-gray-100 text-gray-100"
            onChange={(e: any) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
            value={data.email}
            required
            type="email"
            placeholder="Enter email"
          />

          <input
            className="input focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 border font-medium placeholder:text-gray-100 text-gray-100"
            onChange={(e: any) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
            value={data.password}
            required
            type="password"
            placeholder="Password"
          />
          <button type="submit" className="btn btn-primary px-6">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
