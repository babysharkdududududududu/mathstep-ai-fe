// Types matching the backend UserProfileResponse schema

export interface UserProfileData {
  // Header
  streak_days: number;
  xp_total: number;

  // Identity
  display_name: string | null;
  avatar_url: string | null;
  title: string | null;

  // Gamification
  level: number;
  xp_progress_percent: number;
  xp_to_next_level: number;
  is_pro: boolean;

  // Combo
  combo_multiplier: number;
  combo_label: string;

  // Achievement (optional)
  current_achievement_name: string | null;
  current_achievement_desc: string | null;
  current_achievement_progress: number | null;
  current_achievement_total: number | null;
}
