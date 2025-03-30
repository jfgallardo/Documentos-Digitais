import packageJson from "../package.json";
import { paths } from "./routes/paths";

// ----------------------------------------------------------------------

export type ConfigValue = {
  site: {
    name: string;
    serverUrl: string;
    version: string;
    baseUrl: string;
  };
  auth: {
    method: string;
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  site: {
    name: "SignEase",
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    version: packageJson.version,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "",
  },
  auth: {
    method: "jwt",
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};
