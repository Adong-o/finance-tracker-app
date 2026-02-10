import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Surface, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions, getFinancialSummary, initDatabase } from '../database/db';
import { Transaction } from '../utils/types';
import TransactionItem from '../components/TransactionItem';

const HomeScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

    const loadData = useCallback(() => {
        const data = getTransactions();
        setTransactions(data);
        const sum = getFinancialSummary();
        setSummary(sum);
    }, []);

    useEffect(() => {
        initDatabase();
        loadData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Surface style={styles.summaryContainer} elevation={2}>
                <View style={styles.balanceRow}>
                    <Text variant="titleMedium" style={{ color: '#666' }}>Total Balance</Text>
                    <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                        ${summary.balance.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={{ color: '#2e7d32', fontWeight: 'bold' }}>Income</Text>
                        <Text variant="titleMedium">${summary.totalIncome.toFixed(2)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={{ color: '#c62828', fontWeight: 'bold' }}>Expense</Text>
                        <Text variant="titleMedium">${summary.totalExpense.toFixed(2)}</Text>
                    </View>
                </View>
            </Surface>

            <Text variant="titleLarge" style={styles.header}>Recent Activity</Text>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TransactionItem transaction={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyLarge" style={{ color: '#888' }}>No transactions yet.</Text>
                        <Text variant="bodyMedium" style={{ color: '#aaa' }}>Tap + to add one.</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="white"
                onPress={() => navigation.navigate('AddTransaction')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    summaryContainer: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'white',
    },
    balanceRow: {
        alignItems: 'center',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    header: {
        marginHorizontal: 16,
        marginBottom: 12,
        fontWeight: 'bold',
        color: '#333'
    },
    listContent: {
        paddingBottom: 80,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default HomeScreen;
