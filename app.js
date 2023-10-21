const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');

// DB 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'abc',
    password: '1234',
    database: 'simple_board'
});

app.use(express.static(__dirname));

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL with ID:', connection.threadId);
});

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'board/views'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/board', (req, res) => {
    const sql = "SELECT * FROM posts";
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.render('index', { posts: results });
    });
});

app.get('/write', (req, res) => {
    res.render('write');
});
app.post('/write', (req, res) => {
    // 폼에서 제출된 데이터 가져오기
    const title = req.body.title;
    const content = req.body.content;

    // 데이터베이스에 저장하기 위한 쿼리 작성
    const sql = "INSERT INTO posts (title, content) VALUES (?, ?)";
    const values = [title, content];

    // 쿼리 실행
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting post:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        // 게시글 저장 후 게시판 페이지로 리다이렉트
        res.redirect('/board');
    });
});
// 서버 포트 설정
app.listen(3000, function () {
    console.log('Server listening on port 3000...');
});



