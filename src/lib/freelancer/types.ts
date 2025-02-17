export type SearchForActiveProjectsParams = {
  query: string;
  page: number;
  limit: number;
};

export type ProjectFromFreelancer = {
  id: number;
  title: string;
  status: string;
  currency: {
    id: number;
    code: string;
    sign: string;
    name: string;
    exchange_rate: number;
    country: string;
    is_external: boolean;
    is_escrowcom_supported: boolean;
  };
  description: string;
  deleted: boolean;
  bidperiod: number;
  budget: {
    minimum: number;
    maximum: number;
    name: string | null;
    project_type: string | null;
    currency_id: number | null;
  };
  hourly_project_info: null | {
    commitment: {
      hours: number;
      interval: string;
    };
  };
  bid_stats: {
    bid_count: number;
    bid_avg: number;
  };
};

export type Project = {
  id: number;
  title: string;
  description: string;
  budget: {
    minimum: number;
    maximum: number;
    durationType: "fixed" | "periodic";
  };
  periodicInfo?: string;
  currency: string;
  bidStats: {
    bidCount: number;
    bidAvg: number;
  };
};

export type ResponseFromAI = {
  ignore: boolean;
  proposal: string;
  amount: number;
  duration: number;
};
