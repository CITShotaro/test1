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
    
    const cellIndex = parseInt(localStorage.getItem('currentCellIndex'), 10) || 0;

    console.log('選択されたマス番号:', cellIndex);

    const allQuestions = await loadQuestionsFromCSV();

    console.log('読み込まれた全ての問題:', allQuestions);

    const questions = allQuestions.slice(cellIndex * totalQuestions, (cellIndex + 1) * totalQuestions);

    console.log('表示する問題:', questions);

    if (questions.length === 0) {
        alert('問題データが読み込まれていません。CSVファイルの配置と読み込みパスを確認してください。');
        return;
    }

    const loadQuestion = (index) => {
        const question = questions[index];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        feedback.textContent = ''; // フィードバックをクリア
        feedback.classList.remove('correct');

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
            feedback.classList.add('correct'); // 正解時に緑色にする
        } else {
            feedback.textContent = `不正解です。正解は ${correct} です。`;
        }

        // 次の問題ボタンを有効化
        nextQuestionButton.disabled = false;
    };

    const completeQuestions = () => {
        if (correctAnswers === totalQuestions) {
            alert('3問全て正解です！このマスの色が変わります。');
            updateBingoCellState(cellIndex);
        } else {
            alert('終了です。結果によりマスの色は変わりません。');
        }
        window.location.href = 'bingo.html';
    };

    const updateBingoCellState = (index) => {
        const bingoState = JSON.parse(localStorage.getItem('bingoState')) || Array(25).fill(false);
        bingoState[index] = true;
        localStorage.setItem('bingoState', JSON.stringify(bingoState));
    };

    nextQuestionButton.addEventListener('click', () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
            nextQuestionButton.disabled = true; // ボタンを無効化
        } else {
            completeQuestions();
        }
    });

    // 最初の問題をロードし、次の問題ボタンを無効化
    loadQuestion(currentQuestionIndex);
    nextQuestionButton.disabled = true;
});
