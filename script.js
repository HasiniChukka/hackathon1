document.addEventListener('DOMContentLoaded', () => {
    const totalAmountElement = document.getElementById('total-amount');
    const incomeTableBody = document.getElementById('income-table')?.querySelector('tbody');
    const expenditureTableBody = document.getElementById('expenditure-table')?.querySelector('tbody');
    const allRecordsTableBody = document.getElementById('all-records-table')?.querySelector('tbody');

    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;
    const incomeRecords = JSON.parse(localStorage.getItem('incomeRecords')) || [];
    const expenditureRecords = JSON.parse(localStorage.getItem('expenditureRecords')) || [];
    let currentFilterType = '';

    const updateTotalAmountDisplay = () => {
        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toFixed(2);
            if (totalAmount < 15000) {
                totalAmountElement.className = 'amount-field red';
            } else if (totalAmount > 15000) {
                totalAmountElement.className = 'amount-field green';
            } else {
                totalAmountElement.className = 'amount-field grey';
            }
        }
    };

    const renderTable = (records, tableBody, type) => {
        if (tableBody) {
            tableBody.innerHTML = '';
            records.forEach((record) => {
                const row = document.createElement('tr');
                row.className = type === 'Income' ? 'income-row' : 'expenditure-row';
                row.innerHTML = `
                    <td>${record.dateTime}</td>
                    <td>${record.description}</td>
                    <td>${record.amount.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    };

    const renderAllRecords = () => {
        if (allRecordsTableBody) {
            allRecordsTableBody.innerHTML = '';
            const allRecords = [...incomeRecords.map(record => ({ ...record, type: 'Income' })), 
                                 ...expenditureRecords.map(record => ({ ...record, type: 'Expenditure' }))];
            allRecords.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            allRecords.forEach((record) => {
                const row = document.createElement('tr');
                row.className = record.type === 'Income' ? 'income-row' : 'expenditure-row';
                row.innerHTML = `
                    <td>${record.dateTime}</td>
                    <td>${record.description}</td>
                    <td>${record.type}</td>
                    <td>${record.amount.toFixed(2)}</td>
                `;
                allRecordsTableBody.appendChild(row);
            });
        }
    };

    const clearAllRecords = () => {
        totalAmount = 0;
        localStorage.setItem('totalAmount', totalAmount);
        localStorage.removeItem('incomeRecords');
        localStorage.removeItem('expenditureRecords');
        updateTotalAmountDisplay();
        renderTable([], incomeTableBody, 'Income');
        renderTable([], expenditureTableBody, 'Expenditure');
        renderAllRecords();
    };

    const incomeForm = document.getElementById('income-form');
    const expenditureForm = document.getElementById('expenditure-form');

    if (incomeForm) {
        incomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            totalAmount += amount;
            localStorage.setItem('totalAmount', totalAmount);

            const record = {
                dateTime: new Date().toLocaleString(),
                description: description,
                amount: amount
            };
            incomeRecords.push(record);
            localStorage.setItem('incomeRecords', JSON.stringify(incomeRecords));

            window.location.href = 'index.html';
        });
    }

    if (expenditureForm) {
        expenditureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            if (totalAmount < amount) {
                alert('Insufficient amount');
            } else {
                totalAmount -= amount;
                localStorage.setItem('totalAmount', totalAmount);

                const record = {
                    dateTime: new Date().toLocaleString(),
                    description: description,
                    amount: amount
                };
                expenditureRecords.push(record);
                localStorage.setItem('expenditureRecords', JSON.stringify(expenditureRecords));

                window.location.href = 'index.html';
            }
        });
    }

    if (incomeTableBody) {
        renderTable(incomeRecords, incomeTableBody, 'Income');
    }

    if (expenditureTableBody) {
        renderTable(expenditureRecords, expenditureTableBody, 'Expenditure');
    }

    if (allRecordsTableBody) {
        renderAllRecords();
    }

    updateTotalAmountDisplay();

    // Clear All Records button event listener
    const clearAllButton = document.getElementById('clear-all');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', clearAllRecords);
    }

    // Filter Popup
    const filterPopup = document.getElementById('filter-popup');
    const filterForm = document.getElementById('filter-form');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    window.openFilterPopup = (type) => {
        currentFilterType = type;
        filterPopup.style.display = 'block';
    };

    window.closeFilterPopup = () => {
        filterPopup.style.display = 'none';
    };

    const filterRecords = (records, startDate, endDate) => {
        return records.filter(record => {
            const recordDate = new Date(record.dateTime);
            return recordDate >= startDate && recordDate <= endDate;
        });
    };

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (currentFilterType === 'income') {
            const filteredIncomeRecords = filterRecords(incomeRecords, startDate, endDate);
            renderTable(filteredIncomeRecords, incomeTableBody, 'Income');
        } else if (currentFilterType === 'expenditure') {
            const filteredExpenditureRecords = filterRecords(expenditureRecords, startDate, endDate);
            renderTable(filteredExpenditureRecords, expenditureTableBody, 'Expenditure');
        }

        closeFilterPopup();
    });
});








