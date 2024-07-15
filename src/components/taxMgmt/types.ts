export type AccountLeaf = {
  name: string;
  clientName: string;
  clientId: number;
  accountName: string;
  accountId: number;
  ideas: number;
  actions: number;
  groupingType: string;
};

export type AccountBranch = {
  name: string;
  clientId: number;
  accountId: number;
  ideas: number;
  actions: number;
  children: AccountBranch[] | AccountLeaf[];
};

export type AccountNode = AccountLeaf | AccountBranch;
