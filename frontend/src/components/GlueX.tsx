import React from "react";
import { type WidgetConfigPartialProps } from "@gluex/widget";
import { GlueXWidget, WidgetSkeleton } from "@gluex/widget";
import { ClientSideRender } from "@/ClientSideRender";
const config = {
    variant: "compact",
    subvariant: "router",
    appearance: "auto",
    theme: {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: "#02F994"
            },
            secondary: {
              main: "#F5B5FF"
            }
          }
        },
        dark: {
          palette: {
            primary: {
              main: "#02F994"
            },
            secondary: {
              main: "#F5B5FF"
            }
          }
        }
      },
      container: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px"
      }
    },
    wallet: {
      onConnect: () => console.log("Wallet connected"),
      usePartialWalletManagement: true
    }
  }
const Widget = () => {
  const config: WidgetConfigPartialProps["config"] = React.useMemo(() => {
    return {
      integrator: "f29ec7b244e829aaa006684a05cb3ff02f0e5a1c09527a8f897df52cc59a5a1d", // Replace with your integrator ID
      apiKey: "RSvguRUV5uE1lSJk78tHKxggOHt65noY", // Your GlueX API key
      appearance: "dark",
      theme: {
        container: {
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
          borderRadius: "16px",
        },
      },
    };
  }, []);

  return (
    <ClientSideRender fallback={<WidgetSkeleton config={config} />}>
      <GlueXWidget config={config} />
    </ClientSideRender>
  );
};

export default Widget;
