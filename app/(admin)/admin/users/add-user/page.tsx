import UserAdminForm from "@/components/admin/user-form";

const AddUser = () => {
  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h3-bold">Create User</h1>
      <UserAdminForm type="Create" />
    </div>
  );
};

export default AddUser;
