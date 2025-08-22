export type OverrideType = "boolean" | "int" | "float" | "string";

export interface OverrideItem {
  type: OverrideType;
  value: boolean | number | string;
  enabled: boolean;
  defaultValue: boolean | number | string;
  label: string;
}

export interface Overrides {
  [key: string]: OverrideItem;
}

export const initialOverrides: Overrides = {
  "pg_override.serverBehavior.pdp_options.pdp_enabled": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "PDP Enabled",
  },
  "pg_override.serverBehavior.pdp_options.num_cards": {
    type: "int",
    value: 4,
    enabled: false,
    defaultValue: 4,
    label: "No. Of Cards",
  },
  "pg_override.serverBehavior.pdp_options.content_spacing": {
    type: "float",
    value: 0.5,
    enabled: false,
    defaultValue: 0.5,
    label: "Card Spacing",
  },
  "pg_override.serverBehavior.pdp_options.enable_reviews": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "Enable Reviews",
  },
  "pg_override.serverBehavior.pdp_options.enable_videos": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "Enable Videos",
  },
  "pg_override.serverBehavior.pdp_options.enable_instagram_reels": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "Enable Reels",
  },
  "pg_override.serverBehavior.pdp_options.enable_instagram_posts": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "Enable Posts",
  },
  "pg_override.serverBehavior.pdp_options.enable_product_qas": {
    type: "boolean",
    value: false,
    enabled: false,
    defaultValue: false,
    label: "Enable QAs",
  },
  "pg_override.serverBehavior.pdp_options.banner_card_text": {
    type: "string",
    value: "You May Also Like",
    enabled: false,
    defaultValue: "You May Also Like",
    label: "Banner Text",
  },
  "pg_override.serverBehavior.pdp_options.brand_card_header_title": {
    type: "string",
    value: "Our Customer's says...",
    enabled: false,
    defaultValue: "Our Customer's says...",
    label: "Brand Text",
  },
};
