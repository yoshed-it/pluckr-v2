import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, listClients, type ClientRecord } from "@pluckr/supabase";

type ClientFormState = {
  firstName: string;
  lastName: string;
  pronouns: string;
  phone: string;
  email: string;
  notes: string;
};

const emptyForm: ClientFormState = {
  firstName: "",
  lastName: "",
  pronouns: "",
  phone: "",
  email: "",
  notes: ""
};

/**
 * Owns client list loading, search, and add-client behavior for both apps.
 */
export function useClientListController(
  client: SupabaseClient,
  organizationId: string | null
) {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [clientListError, setClientListError] = useState<string | null>(null);
  const [clientListNotice, setClientListNotice] = useState<string | null>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientForm, setClientForm] = useState<ClientFormState>(emptyForm);

  useEffect(() => {
    if (!organizationId) {
      setClients([]);
      setSearchText("");
      setClientListError(null);
      setClientListNotice(null);
      setIsCreatingClient(false);
      setClientForm(emptyForm);
      return;
    }

    void loadClients(organizationId);
  }, [client, organizationId]);

  const filteredClients = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((record) => {
      const fullName = `${record.first_name} ${record.last_name}`.toLowerCase();
      const pronouns = record.pronouns?.toLowerCase() ?? "";
      const email = record.email?.toLowerCase() ?? "";
      const phone = record.phone?.toLowerCase() ?? "";

      return (
        fullName.includes(query) ||
        pronouns.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [clients, searchText]);

  async function loadClients(nextOrganizationId: string) {
    setIsLoadingClients(true);
    setClientListError(null);

    try {
      setClients(await listClients(client, nextOrganizationId));
    } catch (error) {
      setClientListError(
        error instanceof Error
          ? error.message
          : "Unable to load clients right now."
      );
    } finally {
      setIsLoadingClients(false);
    }
  }

  async function submitClient() {
    if (!organizationId) {
      return false;
    }

    if (!clientForm.firstName.trim() || !clientForm.lastName.trim()) {
      setClientListError("First name and last name are required.");
      return false;
    }

    setIsSavingClient(true);
    setClientListError(null);
    setClientListNotice(null);

    try {
      const createdClient = await createClient(client, {
        organizationId,
        firstName: clientForm.firstName,
        lastName: clientForm.lastName,
        pronouns: clientForm.pronouns,
        phone: clientForm.phone,
        email: clientForm.email,
        notes: clientForm.notes
      });

      setClients((current) => [createdClient, ...current]);
      setClientForm(emptyForm);
      setIsCreatingClient(false);
      setClientListNotice(
        `${createdClient.first_name} ${createdClient.last_name} was added.`
      );
      return true;
    } catch (error) {
      setClientListError(
        error instanceof Error
          ? error.message
          : "Unable to save the client right now."
      );
      return false;
    } finally {
      setIsSavingClient(false);
    }
  }

  function updateClientForm<K extends keyof ClientFormState>(
    key: K,
    value: ClientFormState[K]
  ) {
    setClientForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function startCreatingClient() {
    setClientListNotice(null);
    setIsCreatingClient(true);
  }

  function cancelCreatingClient() {
    setIsCreatingClient(false);
    setClientListError(null);
    setClientForm(emptyForm);
  }

  return {
    clients,
    filteredClients,
    searchText,
    isLoadingClients,
    clientListError,
    clientListNotice,
    isCreatingClient,
    isSavingClient,
    clientForm,
    setSearchText,
    updateClientForm,
    startCreatingClient,
    cancelCreatingClient,
    submitClient,
    refreshClients: () =>
      organizationId ? loadClients(organizationId) : Promise.resolve()
  };
}
