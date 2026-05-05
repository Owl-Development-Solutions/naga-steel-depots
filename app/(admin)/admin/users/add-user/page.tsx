import UserAdminForm from "@/components/admin/user-form";
import { requireAdmin } from "@/lib/auth-guard";

const AddUser = async () => {
  await requireAdmin();
  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h3-bold">Create User</h1>
      <UserAdminForm type="Create" />
    </div>
  );
};

export default AddUser;
