const fs = require('fs').promises;
const path = require('path');

async function convertImportsToRequire(directoryPath) {
    try {
        const files = await fs.readdir(directoryPath);
        const jsFiles = files.filter(file => path.extname(file) === '.js');

        for (const file of jsFiles) {
            const filePath = path.join(directoryPath, file);
            
            try {
                let content = await fs.readFile(filePath, 'utf8');

                // import 문을 require로 변환
                let newContent = content.replace(
                    /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
                    'const $1 = require(\'$2\')'
                );

                // export default class를 변환
                newContent = newContent.replace(
                    /export\s+default\s+class\s+(\w+)/g,
                    'class $1'
                );

                // 실제 클래스 정의를 찾기 위한 정규식
                const classPattern = /^class\s+(\w+)\s*{/m;
                const classNameMatch = newContent.match(classPattern);

                if (classNameMatch) {
                    const className = classNameMatch[1];
                    
                    // 파일명과 클래스명 비교
                    const expectedClassName = path.basename(file, '.js');
                    
                    if (className !== expectedClassName) {
                        console.log(`경고: ${file} - 클래스명(${className})이 파일명(${expectedClassName})과 다릅니다`);
                    }

                    // 기존 module.exports 제거 (잘못된 exports 포함)
                    newContent = newContent.replace(/\nmodule\.exports\s*=\s*[^;]+;/g, '');
                    
                    // 새로운 module.exports 추가
                    newContent = newContent.trim() + `\n\nmodule.exports = ${className};\n`;
                } else {
                    console.log(`${file}: 클래스 정의를 찾을 수 없습니다`);
                }

                // 변경된 내용을 파일에 쓰기
                await fs.writeFile(filePath, newContent, 'utf8');
                console.log(`${file} 변환 완료`);

            } catch (err) {
                console.error(`${file} 처리 중 오류:`, err);
            }
        }
    } catch (err) {
        console.error('디렉토리 처리 중 오류:', err);
    }
}

// 사용 예시
const targetDirectory = './argo/model';
convertImportsToRequire(targetDirectory)
    .then(() => console.log('모든 파일 변환 완료'))
    .catch(err => console.error('변환 중 오류 발생:', err));