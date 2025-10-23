export interface Goal {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  targetMinutes: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  createdAt: number;
}
