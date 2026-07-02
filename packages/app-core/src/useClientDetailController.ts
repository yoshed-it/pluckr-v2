import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  archiveClient,
  updateClient,
  updateClientTags,
  type ClientRecord
} from "@pluckr/supabase";
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

type ClientDetailFormState = {
  preferredName: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressPostalCode: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  notes: string;
  clientTags: string[];
};

const emptyForm: ClientDetailFormState = {
  preferredName: "",
  firstName: "",
  lastName: "",
  pronouns: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  addressCity: "",
  addressRegion: "",
  addressPostalCode: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  notes: "",
  clientTags: []
};

function buildClientDetailForm(client: ClientRecord): ClientDetailFormState {
  return {
    preferredName:
      client.preferred_name ?? `${client.first_name} ${client.last_name}`.trim(),
    firstName: client.first_name,
    lastName: client.last_name,
    pronouns: client.pronouns ?? "",
    phone: client.phone ?? "",
    email: client.email ?? "",
    addressLine1: client.address_line1 ?? "",
    addressLine2: client.address_line2 ?? "",
    addressCity: client.address_city ?? "",
    addressRegion: client.address_region ?? "",
    addressPostalCode: client.address_postal_code ?? "",
    emergencyContactName: client.emergency_contact_name ?? "",
    emergencyContactRelationship:
      client.emergency_contact_relationship ?? "",
    emergencyContactPhone: client.emergency_contact_phone ?? "",
    notes: client.notes ?? "",
    clientTags: client.client_tags ?? []
  };
}

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
  const [clientDetailFormErrors, setClientDetailFormErrors] =
    useState<ClientFormErrors>({});
  const [hasAttemptedClientDetailSubmit, setHasAttemptedClientDetailSubmit] =
    useState(false);

  useEffect(() => {
    if (!selectedClient) {
      setIsEditingClient(false);
      setClientDetailError(null);
      setClientDetailNotice(null);
      setClientDetailForm(emptyForm);
      setClientDetailFormErrors({});
      setHasAttemptedClientDetailSubmit(false);
      return;
    }

    setIsEditingClient(false);
    setClientDetailError(null);
    setClientDetailNotice(null);
    setClientDetailFormErrors({});
    setHasAttemptedClientDetailSubmit(false);
    setClientDetailForm(buildClientDetailForm(selectedClient));
  }, [selectedClient]);

  useEffect(() => {
    if (hasAttemptedClientDetailSubmit) {
      setClientDetailFormErrors(validateClientIdentityForm(clientDetailForm));
    }
  }, [clientDetailForm, hasAttemptedClientDetailSubmit]);

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
    setClientDetailFormErrors({});
    setHasAttemptedClientDetailSubmit(false);
    setClientDetailForm(buildClientDetailForm(selectedClient));
    setIsEditingClient(true);
  }

  function cancelEditingClient() {
    setIsEditingClient(false);
    setClientDetailError(null);
    setClientDetailFormErrors({});
    setHasAttemptedClientDetailSubmit(false);
    if (selectedClient) {
      setClientDetailForm(buildClientDetailForm(selectedClient));
    }
  }

  async function submitClientDetails() {
    if (!organizationId || !selectedClient) {
      return null;
    }

    setHasAttemptedClientDetailSubmit(true);

    const nextErrors = validateClientIdentityForm(clientDetailForm);
    setClientDetailFormErrors(nextErrors);

    if (hasClientFormErrors(nextErrors)) {
      setClientDetailError("Fix the highlighted fields to update this client.");
      return null;
    }

    setIsSavingClient(true);
    setClientDetailError(null);
    setClientDetailNotice(null);

    try {
      const updatedClient = await updateClient(client, {
        organizationId,
        clientId: selectedClient.id,
        preferredName: clientDetailForm.preferredName,
        firstName: clientDetailForm.firstName,
        lastName: clientDetailForm.lastName,
        pronouns: clientDetailForm.pronouns,
        phone: clientDetailForm.phone,
        email: clientDetailForm.email,
        addressLine1: clientDetailForm.addressLine1,
        addressLine2: clientDetailForm.addressLine2,
        addressCity: clientDetailForm.addressCity,
        addressRegion: clientDetailForm.addressRegion,
        addressPostalCode: clientDetailForm.addressPostalCode,
        emergencyContactName: clientDetailForm.emergencyContactName,
        emergencyContactRelationship:
          clientDetailForm.emergencyContactRelationship,
        emergencyContactPhone: clientDetailForm.emergencyContactPhone,
        notes: clientDetailForm.notes,
        clientTags: dedupeTagLabels(clientDetailForm.clientTags)
      });

      setClientDetailNotice("Client updated.");
      setClientDetailFormErrors({});
      setHasAttemptedClientDetailSubmit(false);
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

  async function submitClientTags() {
    if (!organizationId || !selectedClient) {
      return null;
    }

    setIsSavingClient(true);
    setClientDetailError(null);
    setClientDetailNotice(null);

    try {
      const updatedClient = await updateClientTags(client, {
        organizationId,
        clientId: selectedClient.id,
        clientTags: dedupeTagLabels(clientDetailForm.clientTags)
      });

      setClientDetailNotice("Client tags updated.");
      setClientDetailForm((current) => ({
        ...current,
        clientTags: updatedClient.client_tags ?? []
      }));
      return updatedClient;
    } catch (error) {
      setClientDetailError(
        error instanceof Error
          ? error.message
          : "Unable to update client tags right now."
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
    clientDetailFormErrors,
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
    submitClientTags,
    archiveSelectedClient
  };
}
