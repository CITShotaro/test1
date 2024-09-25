// CSVデータの読み込みと問題データへの変換
const loadQuestionsFromCSV = async () => {
    try {
        const response = await fetch('questions.csv');
        const data = await response.text();
        const lines = data.split('\n').slice(1); // ヘッダーを除去
        
        return lines.map(line => {
            // 各行をカンマで分割し、要素を取得
            const [question, correct, option1, option2, option3, option4] = line.split(',');

            // 各要素が undefined でないか確認
            if (!question || !correct || !option1 || !option2 || !option3 || !option4) {
                console.warn('不完全なデータをスキップ:', line);
                return null; // 不完全な行は無視する
            }

            // 各要素の前後の空白を削除し、オブジェクトを返す
            return {
                question: question.trim(),
                correct: correct.trim(),
                options: [option1.trim(), option2.trim(), option3.trim(), option4.trim()]
            };
        }).filter(q => q !== null); // null をフィルタリング
    } catch (error) {
        console.error('CSVの読み込みに失敗しました:', error);
        return [];
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');
    const feedback = document.getElementById('feedback');
    const nextQuestionButton = document.getElementById('next-question');

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    const totalQuestions = 3;
    
    // クリックしたBINGOマスの情報（ここでは仮にマス番号 1 を指定）
    const cellIndex = localStorage.getItem('currentCellIndex') || 0; // 仮のインデックス管理

    // CSVから問題を読み込む
    const allQuestions = await loadQuestionsFromCSV();
    
    // 特定のマスの問題を選択 (例: マス1の問題)
    const questions = allQuestions.slice(cellIndex * totalQuestions, (cellIndex + 1) * totalQuestions);

    const loadQuestion = (index) => {
        const question = questions[index];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => checkAnswer(option, question.correct));
            optionsContainer.appendChild(button);
        });
    };

    const checkAnswer = (selected, correct) => {
        if (selected === correct) {
            correctAnswers++;
            feedback.textContent = '正解です！';
        } else {
            feedback.textContent = `不正解です。正解は ${correct} です。`;
        }
        setTimeout(() => {
            feedback.textContent = '';
            if (currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            } else {
                completeQuestions();
            }
        }, 1000);
    };

    const completeQuestions = () => {
        if (correctAnswers === totalQuestions) {
            alert('3問全て正解です！このマスの色が変わります。');
            // BINGOカードの更新ロジック
            updateBingoCellState(cellIndex);
        } else {
            alert('終了です。結果によりマスの色は変わりません。');
        }
        window.location.href = 'bingo.html';
    };

    const updateBingoCellState = (index) => {
        // BINGOカードの状態を更新する（仮のロジック）
        const bingoState = JSON.parse(localStorage.getItem('bingoState')) || Array(25).fill(false);
        bingoState[index] = true;
        localStorage.setItem('bingoState', JSON.stringify(bingoState));
    };

    nextQuestionButton.addEventListener('click', () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            completeQuestions();
        }
    });

    loadQuestion(currentQuestionIndex);
});
