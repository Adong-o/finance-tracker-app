export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  date: string; // Stored as ISO string
  description: string;
  category: string;
}
