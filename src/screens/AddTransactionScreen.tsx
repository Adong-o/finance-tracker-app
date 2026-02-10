import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, HelperText, useTheme } from 'react-native-paper';
import { addTransaction } from '../database/db';

const AddTransactionScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Invalid Description', 'Please enter a description.');
            return;
        }

        setLoading(true);
        try {
            addTransaction({
                amount: Number(amount),
                type: type as 'income' | 'expense',
                date: new Date().toISOString(),
                description: description.trim(),
                category: category.trim() || 'General',
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <SegmentedButtons
                    value={type}
                    onValueChange={setType}
                    buttons={[
                        {
                            value: 'expense',
                            label: 'Expense',
                            style: { backgroundColor: type === 'expense' ? '#ffebee' : undefined },
                            showSelectedCheck: true
                        },
                        {
                            value: 'income',
                            label: 'Income',
                            style: { backgroundColor: type === 'income' ? '#e8f5e9' : undefined },
                            showSelectedCheck: true
                        },
                    ]}
                    style={styles.segmentedButton}
                    theme={{ colors: { secondaryContainer: type === 'expense' ? '#ffebee' : '#e8f5e9' } }}
                />

                <TextInput
                    label="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Affix text="$" />}
                />

                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Category (Optional)"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    style={styles.input}
                    placeholder="e.g., Food, Transport"
                />

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    style={[
                        styles.button,
                        { backgroundColor: type === 'income' ? '#2e7d32' : '#c62828' }
                    ]}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Save Transaction
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 24,
    },
    segmentedButton: {
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white'
    },
    button: {
        marginTop: 16,
    },
});

export default AddTransactionScreen;
