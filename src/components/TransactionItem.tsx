import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Transaction } from '../utils/types';

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const isIncome = transaction.type === 'income';
    const formattedDate = new Date(transaction.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });

    return (
        <Card style={styles.card} mode="elevated">
            <Card.Title
                title={transaction.category || "Uncategorized"}
                subtitle={`${formattedDate} • ${transaction.description}`}
                left={(props) => (
                    <Avatar.Icon
                        {...props}
                        icon={isIncome ? "arrow-down-bold" : "arrow-up-bold"}
                        style={{ backgroundColor: isIncome ? '#e8f5e9' : '#ffebee' }}
                        color={isIncome ? '#2e7d32' : '#c62828'}
                        size={40}
                    />
                )}
                right={(props) => (
                    <Text {...props} variant="titleMedium" style={{
                        color: isIncome ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold',
                        marginRight: 16
                    }}>
                        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </Text>
                )}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 4,
        marginHorizontal: 16,
        backgroundColor: 'white'
    }
});

export default TransactionItem;
