import * as SQLite from 'expo-sqlite';
import { Transaction } from '../utils/types';

// Open the database (creates it if it doesn't exist)
const db = SQLite.openDatabaseSync('finance.db');

export const initDatabase = () => {
    try {
        db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        category TEXT
      );
    `);
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const { amount, type, date, description, category } = transaction;
    try {
        db.runSync(
            'INSERT INTO transactions (amount, type, date, description, category) VALUES (?, ?, ?, ?, ?)',
            [amount, type, date, description, category]
        );
        // console.log("Transaction added");
    } catch (error) {
        console.error("Error adding transaction:", error);
    }
};

export const getTransactions = (): Transaction[] => {
    try {
        return db.getAllSync<Transaction>('SELECT * FROM transactions ORDER BY date DESC');
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};

export const deleteTransaction = (id: number) => {
    try {
        db.runSync('DELETE FROM transactions WHERE id = ?', [id]);
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
};

export const getFinancialSummary = () => {
    try {
        const incomeResult = db.getFirstSync<{ total: number }>('SELECT SUM(amount) as total FROM transactions WHERE type = "income"');
        const expenseResult = db.getFirstSync<{ total: number }>('SELECT SUM(amount) as total FROM transactions WHERE type = "expense"');

        const totalIncome = incomeResult?.total || 0;
        const totalExpense = expenseResult?.total || 0;

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    } catch (error) {
        console.error("Error calculating summary:", error);
        return { totalIncome: 0, totalExpense: 0, balance: 0 };
    }
};
