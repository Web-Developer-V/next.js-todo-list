import { useEffect } from "react";

interface Props {
  storageKey: string;
}

export default function VerificationEmailStorage({ storageKey }: Props) {
  useEffect(() => {
    localStorage.setItem(storageKey, String(Date.now()));
  }, [storageKey]);

  return null;
}
