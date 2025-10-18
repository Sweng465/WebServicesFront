import { useAuth } from "../context/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}</h1>
        <p>Email: {user.email}</p>
        {/* Add more user details here */}
      </div>
    </div>
  );
};

export default Profile;