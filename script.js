document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'bingo.html'; // ログイン成功後にBINGO画面へ
            } else {
                document.getElementById('login-error').innerText = 'ユーザーIDまたはパスワードが間違っています。';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.username === username)) {
                document.getElementById('register-error').innerText = 'このユーザーIDは既に使用されています。';
            } else {
                const newUser = { username, password, bingoCount: 0 };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                alert('登録が完了しました。ログインしてください。');
                window.location.href = 'index.html';
            }
        });
    }
});
