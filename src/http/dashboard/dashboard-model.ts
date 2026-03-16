
export interface DashboardState {

  user : {

    name: string;

    logout: string;

  };

  organization: {

    name: string;

  };

  catalogs: CatalogItem[];

  catalogCreateUrl: string | null;

  datasets: DatasetItem[];

  datasetCreateUrl: string | null;

  messages: MessageItem[];

}

export interface CatalogItem {

  url: string;

  title: string;

  editUrl: string | null;

  deleteUrl: string | null;

}

export interface DatasetItem {

  url: string;

  title: string;

  editUrl: string | null;

  deleteUrl: string | null;

}

export interface MessageItem {

  identifier: string;

  label: string;

  type: string;

  iri: string | null;

  payload: string;

}
