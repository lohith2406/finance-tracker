"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensures client-only rendering
  }, []);

  if (!mounted) return null; // render nothing on server

  return <Navbar />;
}
