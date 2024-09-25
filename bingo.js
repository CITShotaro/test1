document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const bingoCountElement = document.getElementById('bingo-count');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: '', bingoCount: 0 };
    let bingoCount = currentUser.bingoCount;

    // BINGOカードの状態を管理する2次元配列（localStorageから読み込む）
    let cardState = JSON.parse(localStorage.getItem('bingoState')) || Array(25).fill(false);

    // BINGOカードの生成
    const generateBingoCard = () => {
        bingoCard.innerHTML = ''; // カードを初期化
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('bingo-row');
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                const cellIndex = i * 5 + j;
                cell.textContent = `${cellIndex + 1}`; // マスの番号

                // カード状態に基づき、正解済みのマスの色を変える
                if (cardState[cellIndex]) {
                    cell.classList.add('correct-cell'); // 正解済みのマスに適用するCSSクラス
                }

                cell.addEventListener('click', () => handleCellClick(i, j, cell));
                row.appendChild(cell);
            }
            bingoCard.appendChild(row);
        }
    };

    // マスクリック時の処理
    const handleCellClick = (i, j, cell) => {
        if (!cardState[i * 5 + j]) { // 未正解のマスのみ操作可能
            const cellIndex = i * 5 + j; // マス番号を計算 (0 から 24)
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
            if (checkLine(cardState.slice(i * 5, i * 5 + 5))) newBingoCount++;
        }

        // 横のチェック
        for (let i = 0; i < 5; i++) {
            if (checkLine(cardState.filter((_, index) => index % 5 === i))) newBingoCount++;
        }

        // 斜めのチェック
        if (checkLine(cardState.filter((_, index) => index % 6 === 0))) newBingoCount++;
        if (checkLine(cardState.filter((_, index) => index % 4 === 0 && index > 0 && index < 24))) newBingoCount++;

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
    checkBingo(); // 初期表示時にBINGO状態を確認
});
