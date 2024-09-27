const Profile = ({
  params: { profileId },
}: {
  params: { profileId: string };
}) => {
  return (
    <div>
      <h1 className="text-20 font-bold text-white-1">My Profile By {profileId}</h1>
    </div>
  );
};

export default Profile;
