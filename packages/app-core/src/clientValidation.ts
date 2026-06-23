export type ClientIdentityForm = {
  preferredName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ClientFormErrors = Partial<
  Record<keyof ClientIdentityForm, string>
>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function validateClientIdentityForm(
  form: ClientIdentityForm
): ClientFormErrors {
  const errors: ClientFormErrors = {};

  if (!form.preferredName.trim()) {
    errors.preferredName = "Name is required.";
  }

  if (!form.firstName.trim()) {
    errors.firstName = "Legal first name is required.";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Legal last name is required.";
  }

  if (form.email.trim() && !isValidEmail(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (form.phone.trim() && !isValidPhone(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  return errors;
}

export function hasClientFormErrors(errors: ClientFormErrors) {
  return Object.keys(errors).length > 0;
}
