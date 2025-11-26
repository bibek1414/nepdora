export type PluginType = "whatsapp" | "dash" | "ydm" | "google-analytics";

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  type: PluginType;
  status?: "beta" | "active";
  is_enabled: boolean;
  hideForService?: boolean;
}

export interface PluginConfig {
  id?: string;
  is_enabled: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
