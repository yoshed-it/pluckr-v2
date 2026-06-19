# Supabase Notes

This folder contains the first prototype schema for Pluckr v2.

## Current Intent

- model organizations, memberships, providers, clients, and chart entries in Postgres
- keep the schema easy to understand while we build the prototype quickly
- leave room to harden RLS and storage policies later

## Prototype Caveat

The initial policies are intentionally lightweight for speed. Before anything real or sensitive ships, tighten:

- row-level policies
- storage policies
- audit trails
- invite handling
- server-only admin access
