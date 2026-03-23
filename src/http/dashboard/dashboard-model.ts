import { RegistrationEntryType } from "../../registration";

export interface DashboardState {

  user : {

    name: string;

    logout: string;

  };

  organization: {

    name: string;

  };

  messages: MessageItem[];

}


export interface MessageItem {

  identifier: string;

  label: string;

  type: RegistrationEntryType;

  createdAt: Date;

}
