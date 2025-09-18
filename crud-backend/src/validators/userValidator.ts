import { User } from "../types";

type UserInput = Omit<User, "id" | "created_at">;

export const validateUser = (user: Partial<UserInput>) => {
  const errors: Record<string, string> = {};

  if (!user.first_name || user.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }
  if (!user.last_name || user.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }
  const dobValue = user.dob instanceof Date ? user.dob.toISOString() : user.dob;
  if (!dobValue || isNaN(new Date(dobValue).getTime())) {
    errors.dob = "Valid date of birth is required";
  }

  if (!user.mobile || !/^[6-9]\d{9}$/.test(user.mobile)) {
    errors.mobile = "Valid 10-digit mobile number is required";
  }
  if (!user.address || user.address.trim() === "") {
    errors.address = "Address is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
