"use client";

import { ConvexProvider, ConvexReactClient, ConvexReactClientOptions} from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient("https://groovy-buffalo-393.convex.cloud", {verbose: true});

export function ConvexClientProvider({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}