/**
 * Web entrypoint for the first Swift-parity slice.
 *
 * The heavy lifting lives in the client component so the Next app can
 * subscribe to Supabase auth state directly in the browser.
 */
import { PluckrWebApp } from "../components/PluckrWebApp";

export default function HomePage() {
  return <PluckrWebApp />;
}
