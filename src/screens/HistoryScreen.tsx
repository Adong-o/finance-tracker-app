import React, { useEffect, useState, useCallback } from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions } from '../database/db';
import { Transaction } from '../utils/types';
import TransactionItem from '../components/TransactionItem';
import { format, parseISO, isSameDay } from 'date-fns';

const HistoryScreen = () => {
    const [sections, setSections] = useState<{ title: string; data: Transaction[] }[]>([]);

    const loadData = useCallback(() => {
        const data = getTransactions();

        // Group by date
        const grouped: { [key: string]: Transaction[] } = {};
        data.forEach(transaction => {
            const dateKey = format(parseISO(transaction.date), 'yyyy-MM-dd');
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(transaction);
        });

        const sectionsData = Object.keys(grouped)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(dateKey => ({
                title: format(parseISO(dateKey), 'EEEE, MMMM do, yyyy'),
                data: grouped[dateKey]
            }));

        setSections(sectionsData);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TransactionItem transaction={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Surface style={styles.header} elevation={1}>
                        <Text variant="labelLarge" style={styles.headerText}>{title}</Text>
                    </Surface>
                )}
                contentContainerStyle={styles.listContent}

                stickySectionHeadersEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    headerText: {
        fontWeight: 'bold',
        color: '#555'
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default HistoryScreen;
