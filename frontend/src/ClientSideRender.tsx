"use client";

import React from "react";

interface ClientSideRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientSideRender: React.FC<ClientSideRenderProps> = ({
  children,
  fallback = null,
}) => {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? <>{children}</> : <>{fallback}</>;
};