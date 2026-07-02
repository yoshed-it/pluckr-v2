import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, listClients, type ClientRecord } from "@pluckr/supabase";
import { getClientDisplayName } from "@pluckr/domain";
import {
  dedupeTagLabels,
  defaultClientTags,
  mergeTagLibrary
} from "./tags";
import {
  hasClientFormErrors,
  validateClientIdentityForm,
  type ClientFormErrors
} from "./clientValidation";

type ClientFormState = {
  preferredName: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  phone: string;
  email: string;
  careSummary: string;
  clientTags: string[];
  consentSigned: boolean;
};

const emptyForm: ClientFormState = {
  preferredName: "",
  firstName: "",
  lastName: "",
  pronouns: "",
  phone: "",
  email: "",
  careSummary: "",
  clientTags: [],
  consentSigned: false
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
  const [clientFormErrors, setClientFormErrors] = useState<ClientFormErrors>({});
  const [hasAttemptedClientSubmit, setHasAttemptedClientSubmit] =
    useState(false);

  useEffect(() => {
    if (!organizationId) {
      setClients([]);
      setSearchText("");
      setClientListError(null);
      setClientListNotice(null);
      setIsCreatingClient(false);
      setClientForm(emptyForm);
      setClientFormErrors({});
      setHasAttemptedClientSubmit(false);
      return;
    }

    void loadClients(organizationId);
  }, [client, organizationId]);

  useEffect(() => {
    if (hasAttemptedClientSubmit) {
      setClientFormErrors(validateClientIdentityForm(clientForm));
    }
  }, [clientForm, hasAttemptedClientSubmit]);

  const filteredClients = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const queryDigits = query.replace(/\D/g, "");

    if (!query) {
      return clients;
    }

    return clients.filter((record) => {
      const displayName = getClientDisplayName(record).toLowerCase();
      const legalName = `${record.first_name} ${record.last_name}`.toLowerCase();
      const pronouns = record.pronouns?.toLowerCase() ?? "";
      const email = record.email?.toLowerCase() ?? "";
      const phone = record.phone?.toLowerCase() ?? "";
      const phoneDigits = phone.replace(/\D/g, "");
      const tags = (record.client_tags ?? [])
        .join(" ")
        .toLowerCase();

      return (
        displayName.includes(query) ||
        legalName.includes(query) ||
        pronouns.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        (queryDigits.length > 0 && phoneDigits.includes(queryDigits)) ||
        tags.includes(query)
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
      return null;
    }

    setHasAttemptedClientSubmit(true);

    const nextErrors = validateClientIdentityForm(clientForm);
    setClientFormErrors(nextErrors);

    if (hasClientFormErrors(nextErrors)) {
      setClientListError("Fix the highlighted fields to add this client.");
      return null;
    }

    setIsSavingClient(true);
    setClientListError(null);
    setClientListNotice(null);

    try {
      const createdClient = await createClient(client, {
        organizationId,
        preferredName: clientForm.preferredName,
        firstName: clientForm.firstName,
        lastName: clientForm.lastName,
        pronouns: clientForm.pronouns,
        phone: clientForm.phone,
        email: clientForm.email,
        notes: clientForm.careSummary,
        clientTags: dedupeTagLabels(clientForm.clientTags),
        consentSignedAt: clientForm.consentSigned ? new Date().toISOString() : null
      });

      setClients((current) => [createdClient, ...current]);
      setClientForm(emptyForm);
      setClientFormErrors({});
      setHasAttemptedClientSubmit(false);
      setIsCreatingClient(false);
      setClientListNotice(
        `${getClientDisplayName(createdClient)} was added.`
      );
      return createdClient;
    } catch (error) {
      setClientListError(
        error instanceof Error
          ? error.message
          : "Unable to save the client right now."
      );
      return null;
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
    setClientListError(null);
    setClientFormErrors({});
    setHasAttemptedClientSubmit(false);
    setIsCreatingClient(true);
  }

  function cancelCreatingClient() {
    setIsCreatingClient(false);
    setClientListError(null);
    setClientForm(emptyForm);
    setClientFormErrors({});
    setHasAttemptedClientSubmit(false);
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
    clientFormErrors,
    availableClientTags: mergeTagLibrary(
      defaultClientTags,
      clientForm.clientTags
    ),
    setSearchText,
    updateClientForm,
    toggleClientTag: (tagLabel: string) =>
      setClientForm((current) => {
        const exists = current.clientTags.some(
          (tag) => tag.toLowerCase() === tagLabel.toLowerCase()
        );

        return {
          ...current,
          clientTags: exists
            ? current.clientTags.filter(
                (tag) => tag.toLowerCase() !== tagLabel.toLowerCase()
              )
            : [...current.clientTags, tagLabel]
        };
      }),
    addCustomClientTag: (tagLabel: string) => {
      const trimmedLabel = tagLabel.trim();

      if (!trimmedLabel) {
        return;
      }

      setClientForm((current) => ({
        ...current,
        clientTags: dedupeTagLabels([...current.clientTags, trimmedLabel])
      }));
    },
    startCreatingClient,
    cancelCreatingClient,
    submitClient,
    refreshClients: () =>
      organizationId ? loadClients(organizationId) : Promise.resolve()
  };
}
