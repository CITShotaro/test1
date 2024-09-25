document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const bingoCountElement = document.getElementById('bingo-count');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: '', bingoCount: 0 };
    let bingoCount = currentUser.bingoCount;

    // 5x5のBINGOカードの状態を管理する2次元配列
    let cardState = Array.from({ length: 5 }, () => Array(5).fill(false));

    // BINGOカードの生成
    const generateBingoCard = () => {
        bingoCard.innerHTML = ''; // カードを初期化
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('bingo-row');
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                cell.textContent = `${i * 5 + j + 1}`; // 仮のテキスト
                cell.addEventListener('click', () => handleCellClick(i, j, cell));
                row.appendChild(cell);
            }
            bingoCard.appendChild(row);
        }
    };

    // マスクリック時の処理
    const handleCellClick = (i, j, cell) => {
        if (!cardState[i][j]) {
            const cellIndex = i * 5 + j; // マス番号を計算
            localStorage.setItem('currentCellIndex', cellIndex); // 選択したマスの番号を保存
            window.location.href = 'question.html'; // 問題画面に遷移
        }
    };

    // BINGOの判定
    const checkBingo = () => {
        let newBingoCount = 0;

        const checkLine = (line) => line.every(cell => cell);

        // 縦のチェック
        for (let i = 0; i < 5; i++) {
            if (checkLine(cardState.map(row => row[i]))) newBingoCount++;
        }

        // 横のチェック
        for (let row of cardState) {
            if (checkLine(row)) newBingoCount++;
        }

        // 斜めのチェック
        if (checkLine(cardState.map((row, idx) => row[idx]))) newBingoCount++;
        if (checkLine(cardState.map((row, idx) => row[4 - idx]))) newBingoCount++;

        if (newBingoCount > bingoCount) {
            bingoCount = newBingoCount;
            updateBingoCount();
            saveUserData(); // ユーザーデータの更新
        }
    };

    // BINGOカウントの更新
    const updateBingoCount = () => {
        bingoCountElement.textContent = bingoCount;
    };

    // ローカルストレージにユーザーデータを保存
    const saveUserData = () => {
        currentUser.bingoCount = bingoCount;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex] = currentUser; // 既存のユーザーを更新
        } else {
            users.push(currentUser); // 新しいユーザーを追加
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    generateBingoCard();
    updateBingoCount();
});
