export type Override = {
  [key: string]: {
    type: "boolean" | "int" | "float" | "string";
    value: any;
    enabled: boolean;
  };
};

export const initialOverrides: Override = {
  "pg_override.serverBehavior.pdp_options.pdp_enabled": {
    type: "boolean",
    value: false,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.num_cards": {
    type: "int",
    value: 0,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.content_spacing": {
    type: "float",
    value: 0.0,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.banner_card_header_title": {
    type: "string",
    value: "",
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.enable_reviews": {
    type: "boolean",
    value: false,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.enable_videos": {
    type: "boolean",
    value: false,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.enable_instagram_reels": {
    type: "boolean",
    value: false,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.enable_instagram_posts": {
    type: "boolean",
    value: false,
    enabled: false,
  },
  "pg_override.serverBehavior.pdp_options.enable_product_qas": {
    type: "boolean",
    value: false,
    enabled: false,
  },
};
