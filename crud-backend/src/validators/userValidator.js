export const validateUser = (user) => {
  const errors = {};

  if (!user.first_name || user.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }
  if (!user.last_name || user.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }
  if (!user.dob || isNaN(Date.parse(user.dob))) {
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
