const fs = require('fs').promises;
const path = require('path');

async function transformClassExports(directoryPath) {
    try {
        // 디렉토리 내의 모든 파일 읽기
        const files = await fs.readdir(directoryPath);
        
        // JS 파일만 필터링
        const jsFiles = files.filter(file => path.extname(file) === '.js');
        
        for (const file of jsFiles) {
            const filePath = path.join(directoryPath, file);
            let content = await fs.readFile(filePath, 'utf8');
            
            // 정규식을 사용하여 module.exports = class [클래스명] 패턴 찾기
            const regex = /module\.exports\s*=\s*class\s+(\w+)/;
            const match = content.match(regex);
            
            if (match) {
                const className = match[1];
                
                // 기존 module.exports = class [클래스명] 를 class [클래스명] 으로 변경
                content = content.replace(regex, 'class $1');
                
                // 파일 끝에 module.exports = [클래스명] 추가
                content = content.trim() + `\n\nmodule.exports = ${className};\n`;
                
                // 변경된 내용을 파일에 쓰기
                await fs.writeFile(filePath, content, 'utf8');
                console.log(`변환 완료: ${file}`);
            }
        }
        
        console.log('모든 파일 처리 완료');
    } catch (error) {
        console.error('에러 발생:', error);
    }
}

transformClassExports('./argo/model');