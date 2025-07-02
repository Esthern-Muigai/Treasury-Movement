import React, { useState, useCallback, useMemo } from 'react';

// Main App component
const App = () => {
    // Initial static exchange rates
    const exchangeRates = useMemo(() => ({
        'USD_KES': 130, // 1 USD = 130 KES
        'KES_USD': 1 / 130,
        'NGN_KES': 0.087, // 1 NGN = 0.087 KES
        'KES_NGN': 1 / 0.087,
        'USD_NGN': 130 / 0.087, // USD to KES then KES to NGN
        'NGN_USD': 0.087 / 130, // NGN to KES then KES to USD
    }), []);

    // Initial accounts setup
    const [accounts, setAccounts] = useState(() => {
        const initialAccounts = [
            { id: 'acc1', name: 'Mpesa_KES_1', currency: 'KES', balance: 500000 },
            { id: 'acc2', name: 'Bank_KES_2', currency: 'KES', balance: 1000000 },
            { id: 'acc3', name: 'Wallet_KES_3', currency: 'KES', balance: 250000 },
            { id: 'acc4', name: 'Mpesa_USD_1', currency: 'USD', balance: 10000 },
            { id: 'acc5', name: 'Bank_USD_2', currency: 'USD', balance: 50000 },
            { id: 'acc6', name: 'Invest_USD_3', currency: 'USD', balance: 20000 },
            { id: 'acc7', name: 'Bank_NGN_1', currency: 'NGN', balance: 5000000 },
            { id: 'acc8', name: 'Wallet_NGN_2', currency: 'NGN', balance: 2000000 },
            { id: 'acc9', name: 'Crypto_NGN_3', currency: 'NGN', balance: 1000000 },
            { id: 'acc10', name: 'Reserve_KES_4', currency: 'KES', balance: 750000 },
        ];
        return initialAccounts.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Transaction log state
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Form states
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    // Filter states
    const [filterAccount, setFilterAccount] = useState('');
    const [filterCurrency, setFilterCurrency] = useState('');

    // Function to display a temporary message
    const showMessage = useCallback((msg, type) => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, []);

    // Handle fund transfer logic
    const handleTransfer = (e) => {
        e.preventDefault();

        const fromAcc = accounts.find(acc => acc.id === fromAccount);
        const toAcc = accounts.find(acc => acc.id === toAccount);
        const transferAmount = parseFloat(amount);

        // --- Validation ---
        if (!fromAcc || !toAcc) {
            showMessage('Please select both source and destination accounts.', 'error');
            return;
        }

        if (fromAccount === toAccount) {
            showMessage('Source and destination accounts cannot be the same.', 'error');
            return;
        }

        if (isNaN(transferAmount) || transferAmount <= 0) {
            showMessage('Please enter a valid positive amount.', 'error');
            return;
        }

        if (fromAcc.balance < transferAmount) {
            showMessage(`Insufficient balance in ${fromAcc.name}. Available: ${fromAcc.balance} ${fromAcc.currency}`, 'error');
            return;
        }

        let finalAmountToDestination = transferAmount;
        let fxRateUsed = null;
        let convertedAmountInDestinationCurrency = null;

        // --- FX Conversion (Bonus) ---
        if (fromAcc.currency !== toAcc.currency) {
            const rateKey = `${fromAcc.currency}_${toAcc.currency}`;
            const rate = exchangeRates[rateKey];

            if (!rate) {
                showMessage(`FX rate not available for ${fromAcc.currency} to ${toAcc.currency}.`, 'error');
                return;
            }

            finalAmountToDestination = transferAmount * rate;
            fxRateUsed = rate;
            convertedAmountInDestinationCurrency = finalAmountToDestination;
            showMessage(`Performing FX conversion: ${transferAmount} ${fromAcc.currency} to ${finalAmountToDestination.toFixed(2)} ${toAcc.currency} (Rate: ${rate.toFixed(4)})`, 'success');
        }

        // --- Update Account Balances ---
        setAccounts(prevAccounts => {
            return prevAccounts.map(acc => {
                if (acc.id === fromAccount) {
                    return { ...acc, balance: acc.balance - transferAmount };
                }
                if (acc.id === toAccount) {
                    return { ...acc, balance: acc.balance + finalAmountToDestination };
                }
                return acc;
            });
        });

        // --- Log Transaction ---
        const newTransaction = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            fromAccountId: fromAcc.id,
            fromAccountName: fromAcc.name,
            fromCurrency: fromAcc.currency,
            toAccountId: toAcc.id,
            toAccountName: toAcc.name,
            toCurrency: toAcc.currency,
            amount: transferAmount,
            currency: fromAcc.currency, // Store original currency of transfer
            note: note || 'N/A',
            fxRate: fxRateUsed,
            convertedAmount: convertedAmountInDestinationCurrency,
            transferDate: transferDate, // For future-dated simulation
        };
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

        // --- Clear Form ---
        setFromAccount('');
        setToAccount('');
        setAmount('');
        setNote('');
        setTransferDate(new Date().toISOString().split('T')[0]); // Reset to today

        showMessage('Transfer successful!', 'success');
    };

    // Filtered transactions for display
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesAccount = filterAccount ?
                (tx.fromAccountId === filterAccount || tx.toAccountId === filterAccount) : true;
            const matchesCurrency = filterCurrency ?
                (tx.fromCurrency === filterCurrency || tx.toCurrency === filterCurrency) : true;
            return matchesAccount && matchesCurrency;
        });
    }, [transactions, filterAccount, filterCurrency]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter text-gray-800">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .scrollable-table {
                    max-height: 400px; /* Max height for scroll */
                    overflow-y: auto; /* Enable vertical scroll */
                    border-radius: 0.5rem; /* Match rounded corners */
                }
                .input-field, .select-field {
                    @apply w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500;
                }
                .btn-primary {
                    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out;
                }
                .btn-filter {
                    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out;
                }
                `}
            </style>
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl space-y-8">
                <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8 drop-shadow-sm">
                    Treasury Movement Simulator
                </h1>

                {/* Message Display */}
                {message && (
                    <div className={`p-4 rounded-lg shadow-md text-center ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Accounts Section */}
                <section className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                    <h2 className="text-3xl font-semibold text-indigo-600 mb-6 border-b pb-3">Accounts Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map(account => (
                            <div key={account.id} className="bg-blue-50 p-5 rounded-lg shadow-md border border-blue-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-medium text-blue-800">{account.name}</h3>
                                    <p className="text-gray-600">Currency: <span className="font-semibold">{account.currency}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-900">
                                        {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Transfer Funds Section */}
                <section className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                    <h2 className="text-3xl font-semibold text-indigo-600 mb-6 border-b pb-3">Transfer Funds</h2>
                    <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fromAccount" className="block text-gray-700 text-sm font-semibold mb-2">From Account:</label>
                            <select
                                id="fromAccount"
                                value={fromAccount}
                                onChange={(e) => setFromAccount(e.target.value)}
                                className="select-field"
                                required
                            >
                                <option value="">Select source account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.currency}) - Balance: {account.balance.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="toAccount" className="block text-gray-700 text-sm font-semibold mb-2">To Account:</label>
                            <select
                                id="toAccount"
                                value={toAccount}
                                onChange={(e) => setToAccount(e.target.value)}
                                className="select-field"
                                required
                            >
                                <option value="">Select destination account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.currency}) - Balance: {account.balance.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-gray-700 text-sm font-semibold mb-2">Amount:</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input-field"
                                placeholder="e.g., 1000.00"
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="note" className="block text-gray-700 text-sm font-semibold mb-2">Note (Optional):</label>
                            <input
                                type="text"
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="input-field"
                                placeholder="e.g., Q3 payroll"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="transferDate" className="block text-gray-700 text-sm font-semibold mb-2">Future-Dated Transfer (UI Only):</label>
                            <input
                                type="date"
                                id="transferDate"
                                value={transferDate}
                                onChange={(e) => setTransferDate(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="md:col-span-2 text-center">
                            <button type="submit" className="btn-primary">
                                Perform Transfer
                            </button>
                        </div>
                    </form>
                </section>

                {/* Transaction Log Section */}
                <section className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                    <h2 className="text-3xl font-semibold text-indigo-600 mb-6 border-b pb-3">Transaction Log</h2>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6 items-end">
                        <div>
                            <label htmlFor="filterAccount" className="block text-gray-700 text-sm font-semibold mb-2">Filter by Account:</label>
                            <select
                                id="filterAccount"
                                value={filterAccount}
                                onChange={(e) => setFilterAccount(e.target.value)}
                                className="select-field"
                            >
                                <option value="">All Accounts</option>
                                {accounts.map(account => (
                                    <option key={`filter-${account.id}`} value={account.id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="filterCurrency" className="block text-gray-700 text-sm font-semibold mb-2">Filter by Currency:</label>
                            <select
                                id="filterCurrency"
                                value={filterCurrency}
                                onChange={(e) => setFilterCurrency(e.target.value)}
                                className="select-field"
                            >
                                <option value="">All Currencies</option>
                                {['KES', 'USD', 'NGN'].map(currency => (
                                    <option key={`filter-${currency}`} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-grow"></div> {/* Spacer for alignment */}
                        <div>
                            <button
                                onClick={() => { setFilterAccount(''); setFilterCurrency(''); }}
                                className="btn-filter"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    {filteredTransactions.length > 0 ? (
                        <div className="scrollable-table border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Account</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Account</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Converted Amount (FX)</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredTransactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.timestamp}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.transferDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.fromAccountName} ({tx.fromCurrency})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.toAccountName} ({tx.toCurrency})</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tx.convertedAmount ?
                                                    `${tx.convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${tx.toCurrency} (Rate: ${tx.fxRate.toFixed(4)})` : 'N/A'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{tx.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No transactions recorded yet or matching filters.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default App;

