export class Profile {
  cookie?: string;
  cookie_name?: string;
  status?: string;
  error?: string;
  auth_username?: string;
  auth_password?: string;
  user?: {
    avatar?: string;
    capabilities?: string;
    description?: string;
    display_name?: string;
    email?: string;
    first_name?: string;
    id?: number;
    last_name?: string;
    login?: string;
    nicename?: string;
    registered?: string;
    url?: string;
    role?: string; //eg: 'primary'
    meta?: {
      _mylisting_stats_cache?: { // stats
        listings?: { published?: number, pending_approval?: number, pending_payment?: number, preview?: number, expired?: number, pending?: number };
        expired?: number;
        pending?: number;
        pending_approval?: number;
        pending_payment?: number;
        preview?: number;
        published?: number;
        promotions?: { count?: number; }
        count?: number;
        updated_on?: number;
        visits?: {
          browsers?: { name?: string, count?: string }[];
          charts?: { lastday?: any; lastmonth?: any; lastweek?: any; }
          countries?: { code?: string, name?: string, count?: string }[]
          devices?: { name?: string, label?: string, count?: string }[];
          platforms?: { name?: string, count?: string }[];
          referrers?: { domain?: string, count?: string, subrefs?: { count?: string, url?: string } }[]
          unique_views?: { lastday?: number, lastweek?: number, lastmonth?: number }
          views: { lastday?: number, lastweek?: number, lastmonth?: number }
        }
      }
    }

  };
}
