export type ClientIdentityForm = {
  preferredName: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  email: string;
  phone: string;
};

export type ClientFormErrors = Partial<
  Record<keyof ClientIdentityForm | "contact", string>
>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function toIsoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

export function normalizeBirthDateInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return toIsoDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]),
      Number(isoMatch[3])
    );
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return toIsoDate(
      Number(slashMatch[3]),
      Number(slashMatch[1]),
      Number(slashMatch[2])
    );
  }

  return null;
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

  if (typeof form.birthDate === "string" && !form.birthDate.trim()) {
    errors.birthDate = "Date of birth is required.";
  } else if (
    typeof form.birthDate === "string" &&
    !normalizeBirthDateInput(form.birthDate)
  ) {
    errors.birthDate = "Use MM/DD/YYYY.";
  }

  if (!form.phone.trim() && !form.email.trim()) {
    errors.contact = "Add a mobile phone or email.";
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
