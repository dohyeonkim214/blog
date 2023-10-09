// 모듈 import
var http = require('http');
var fs = require('fs');

// 서버 생성
var app = http.createServer(function (req, res) {
    fs.readFile(__dirname + 'index.html', function (err, result) {
        if(err) {   // 파일읽기가 실패했을 경우
            console.log('file read fail : ' + err.message);	// error 메세지 콘솔 출력
        }else { // 파일읽기에 성공했을 경우
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(result);
        }
    });
});

// 서버의 포트넘버 지정
app.listen(3000, function () {
    console.log('Server listening in port number 3000.....');
});