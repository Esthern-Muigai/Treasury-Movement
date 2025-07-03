Treasury Movement Simulator
Project Overview
The Treasury Movement Simulator is a web-based application designed to provide a dynamic and intuitive visual representation of internal fund transfers across virtual accounts within a corporate treasury context. In an increasingly complex global economy, organizations often grapple with fragmented financial data, delayed insights, and inefficient manual processes. This simulator addresses these challenges by offering a clear, real-time perspective on financial movements, enabling better liquidity management, risk mitigation, and strategic financial planning.

Problem Solved
This project tackles several critical issues faced by modern treasury operations:

Complexity of Global Cash Management: Simplifies the daunting task of tracking funds across multiple countries, currencies (KES, USD, NGN), and legal entities.

Delayed and Incomplete Information: Provides immediate, real-time updates on cash positions, eliminating delays common in traditional systems.

Inefficient Manual Processes: Automates the visualization and logging of transactions, reducing reliance on error-prone manual data handling.

Suboptimal Liquidity and Risk Management: Offers a dynamic view that helps optimize cash utilization, identify surpluses/shortfalls, and manage financial risks more effectively.

Features
The simulator includes the following functionalities:

Core Functionality:
Account Display: Shows a clear list of 10 pre-defined virtual accounts, each with its name (e.g., Mpesa_KES_1), currency (KES, USD, NGN), and current balance.

Fund Transfer Mechanism: Allows users to easily initiate transfers between any two distinct virtual accounts by selecting source/destination, entering an amount, and adding an optional note.

Balance Validation: Automatically checks for sufficient funds in the 'From Account' before processing a transfer, preventing simulated overdrafts.

Transaction Logging: Maintains an immutable, sortable, and filterable log of all completed transfers, including timestamp, account details, transferred amount, and notes.

Bonus Functionality:
FX Conversion (Static Rate): Automatically converts amounts for inter-currency transfers using pre-defined static exchange rates, displaying the converted amount in the log.

Log Filtering: Provides options to filter the transaction log by specific account (source or destination) or by currency.

Future-Dated Transfers (UI Only): Includes a date picker for logging future dates, though transfers execute immediately within the simulation (for planning/UI purposes only).

How It Works
The Treasury Movement Simulator operates as a client-side web application with in-memory data management:

Initial Setup: Upon launching, the application displays a dashboard with 10 virtual accounts and their initial balances.

Transfer Initiation: Users select source and destination accounts, input a transfer amount, and optionally add a note. A future date can be selected for logging purposes.

Validation: The system validates if the source account has sufficient funds. If not, an error message appears.

Execution & FX: If valid, funds are debited from the source and credited to the destination. If currencies differ, an automatic conversion occurs using fixed exchange rates.

Logging: Every successful transaction is immediately added to a detailed, immutable transaction log, visible on the interface.

Analysis: Users can filter the transaction log to review specific movements by account or currency.

Benefits
Enhanced Visibility: Real-time insights into global cash and liquidity.

Improved Efficiency: Automation reduces manual effort in tracking and reconciliation.

Strategic Decision-Making: Supports "what-if" scenario planning for financial decisions.

Agile Treasury Management: Enables rapid adaptation to market changes and financial innovations.

Setup and Installation
This is a client-side web application. To run it:

Save the HTML: Save the provided HTML code (e.g., index.html) to your local machine.

Open in Browser: Open the index.html file using any modern web browser (e.g., Chrome, Firefox, Edge, Safari).

No server-side setup, database, or external dependencies (beyond standard browser capabilities) are required.

Usage
Once the application is open in your browser:

View Accounts: Observe the initial list of accounts, their currencies, and balances.

Make a Transfer:

Select an account from the "From Account" dropdown.

Select a different account from the "To Account" dropdown.

Enter a numeric value in the "Transfer Amount" field.

(Optional) Add a "Transfer Note."

(Optional) Select a "Future Date" for the transaction log.

Click the "Transfer Funds" button.

Observe Changes:

Account balances will update immediately.

The transaction will appear in the "Transaction Log" table.

If an FX conversion occurred, the converted amount will be shown.

Filter Transactions: Use the filtering options above the transaction log to view specific transactions by account or currency.

Assumptions and Limitations
In-Memory Data: All data (account balances, transaction logs) is stored in memory and will be lost if the page is refreshed or the browser tab is closed.

Static FX Rates: Exchange rates are fixed and cannot be changed by the user.

Virtual Environment: This is a simulation; there are no real-world financial integrations.

Single User: Designed for individual use; no multi-user support.

Future Enhancements (Potential Ideas)
Integration with persistent storage (e.g., a simple local database or cloud-based solution like Firestore) to save data.

Ability to customize or update exchange rates.

Addition of more currencies.

Graphical representation of cash flows over time.

User authentication and multi-user support.