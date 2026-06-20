import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  archiveClient,
  updateClient,
  type ClientRecord
} from "@pluckr/supabase";
import {
  dedupeTagLabels,
  defaultClientTags,
  mergeTagLibrary
} from "./tags";

type ClientDetailFormState = {
  firstName: string;
  lastName: string;
  pronouns: string;
  phone: string;
  email: string;
  notes: string;
  clientTags: string[];
};

const emptyForm: ClientDetailFormState = {
  firstName: "",
  lastName: "",
  pronouns: "",
  phone: "",
  email: "",
  notes: "",
  clientTags: []
};

/**
 * Owns client-detail editing state so journal screens can stay presentation
 * focused while the update/archive behavior remains shared.
 */
export function useClientDetailController(
  client: SupabaseClient,
  organizationId: string | null,
  selectedClient: ClientRecord | null
) {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [clientDetailError, setClientDetailError] = useState<string | null>(null);
  const [clientDetailNotice, setClientDetailNotice] = useState<string | null>(null);
  const [clientDetailForm, setClientDetailForm] =
    useState<ClientDetailFormState>(emptyForm);

  useEffect(() => {
    if (!selectedClient) {
      setIsEditingClient(false);
      setClientDetailError(null);
      setClientDetailNotice(null);
      setClientDetailForm(emptyForm);
      return;
    }

    setIsEditingClient(false);
    setClientDetailError(null);
    setClientDetailNotice(null);
    setClientDetailForm({
      firstName: selectedClient.first_name,
      lastName: selectedClient.last_name,
      pronouns: selectedClient.pronouns ?? "",
      phone: selectedClient.phone ?? "",
      email: selectedClient.email ?? "",
      notes: selectedClient.notes ?? "",
      clientTags: selectedClient.client_tags ?? []
    });
  }, [selectedClient]);

  function updateClientDetailForm<K extends keyof ClientDetailFormState>(
    key: K,
    value: ClientDetailFormState[K]
  ) {
    setClientDetailForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function startEditingClient() {
    if (!selectedClient) {
      return;
    }

    setClientDetailError(null);
    setClientDetailNotice(null);
    setClientDetailForm({
      firstName: selectedClient.first_name,
      lastName: selectedClient.last_name,
      pronouns: selectedClient.pronouns ?? "",
      phone: selectedClient.phone ?? "",
      email: selectedClient.email ?? "",
      notes: selectedClient.notes ?? "",
      clientTags: selectedClient.client_tags ?? []
    });
    setIsEditingClient(true);
  }

  function cancelEditingClient() {
    setIsEditingClient(false);
    setClientDetailError(null);
    if (selectedClient) {
      setClientDetailForm({
        firstName: selectedClient.first_name,
        lastName: selectedClient.last_name,
        pronouns: selectedClient.pronouns ?? "",
        phone: selectedClient.phone ?? "",
        email: selectedClient.email ?? "",
        notes: selectedClient.notes ?? "",
        clientTags: selectedClient.client_tags ?? []
      });
    }
  }

  async function submitClientDetails() {
    if (!organizationId || !selectedClient) {
      return null;
    }

    if (!clientDetailForm.firstName.trim() || !clientDetailForm.lastName.trim()) {
      setClientDetailError("First name and last name are required.");
      return null;
    }

    setIsSavingClient(true);
    setClientDetailError(null);
    setClientDetailNotice(null);

    try {
      const updatedClient = await updateClient(client, {
        organizationId,
        clientId: selectedClient.id,
        firstName: clientDetailForm.firstName,
        lastName: clientDetailForm.lastName,
        pronouns: clientDetailForm.pronouns,
        phone: clientDetailForm.phone,
        email: clientDetailForm.email,
        notes: clientDetailForm.notes,
        clientTags: dedupeTagLabels(clientDetailForm.clientTags)
      });

      setClientDetailNotice("Client updated.");
      setIsEditingClient(false);
      return updatedClient;
    } catch (error) {
      setClientDetailError(
        error instanceof Error
          ? error.message
          : "Unable to update the client right now."
      );
      return null;
    } finally {
      setIsSavingClient(false);
    }
  }

  async function archiveSelectedClient() {
    if (!organizationId || !selectedClient) {
      return null;
    }

    setIsSavingClient(true);
    setClientDetailError(null);
    setClientDetailNotice(null);

    try {
      const archivedClient = await archiveClient(client, {
        organizationId,
        clientId: selectedClient.id
      });

      setClientDetailNotice("Client archived.");
      setIsEditingClient(false);
      return archivedClient;
    } catch (error) {
      setClientDetailError(
        error instanceof Error
          ? error.message
          : "Unable to archive the client right now."
      );
      return null;
    } finally {
      setIsSavingClient(false);
    }
  }

  return {
    isEditingClient,
    isSavingClient,
    clientDetailError,
    clientDetailNotice,
    clientDetailForm,
    availableClientTags: mergeTagLibrary(
      defaultClientTags,
      clientDetailForm.clientTags
    ),
    updateClientDetailForm,
    toggleClientTag: (tagLabel: string) =>
      setClientDetailForm((current) => {
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

      setClientDetailForm((current) => ({
        ...current,
        clientTags: dedupeTagLabels([...current.clientTags, trimmedLabel])
      }));
    },
    startEditingClient,
    cancelEditingClient,
    submitClientDetails,
    archiveSelectedClient
  };
}
