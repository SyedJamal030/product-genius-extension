export interface Override {
  key: string;
  type: 'boolean' | 'number' | 'string' | 'float';
  label: string;
}
export type OverrideValues = {
  [key: string]: { value: string | number | boolean; enabled: boolean };
};

export const initialOverrides: Override[] = [
  { key: 'pg_override.serverBehavior.pdp_options.pdp_enabled', type: 'boolean', label: 'PDP Enabled' },
  { key: 'pg_override.serverBehavior.pdp_options.enable_reviews', type: 'boolean', label: 'Enable Reviews' },
  { key: 'pg_override.serverBehavior.pdp_options.enable_videos', type: 'boolean', label: 'Enable Videos' },
  { key: 'pg_override.serverBehavior.pdp_options.enable_instagram_reels', type: 'boolean', label: 'Enable IG Reels' },
  { key: 'pg_override.serverBehavior.pdp_options.enable_instagram_posts', type: 'boolean', label: 'Enable IG Posts' },
  { key: 'pg_override.serverBehavior.pdp_options.enable_product_qas', type: 'boolean', label: 'Enable Product Q&As' },
  { key: 'pg_override.serverBehavior.pdp_options.num_cards', type: 'number', label: 'Num Cards' },
  { key: 'pg_override.serverBehavior.pdp_options.content_spacing', type: 'float', label: 'Content Spacing' },
  { key: 'pg_override.serverBehavior.pdp_options.banner_card_header_title', type: 'string', label: 'Banner Header Title' },
];
