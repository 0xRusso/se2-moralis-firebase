import React from "react";
import Head from "next/head";
import { useAuth } from "~~/context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>
      <div>
        This route is protected <p>UID: {user.uid}</p>
        <p>Display name: {user.displayName}</p>
        <button onClick={logout} className="btn btn-primary px-6">
          Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;
