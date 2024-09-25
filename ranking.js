document.addEventListener('DOMContentLoaded', () => {
    const rankingTable = document.getElementById('ranking-table').getElementsByTagName('tbody')[0];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // ユーザーをBINGOカウントでソート
    users.sort((a, b) => b.bingoCount - a.bingoCount);

    users.forEach(user => {
        const row = rankingTable.insertRow();
        const usernameCell = row.insertCell(0);
        const countCell = row.insertCell(1);
        usernameCell.textContent = user.username;
        countCell.textContent = user.bingoCount;
    });
});
