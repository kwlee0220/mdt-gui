#!/bin/bash

# 환경 변수 치환 프로그램
# ${} 형식의 환경 변수를 실제 값으로 치환합니다.

set -e

# 사용법 출력
usage() {
    cat << EOF
사용법: $0 [옵션] 입력파일 [-o 출력파일]

옵션:
    -o, --output     출력 파일 경로 (지정하지 않으면 stdout으로 출력)
    -v, --verbose    상세 정보 출력
    -h, --help       도움말 출력

사용 예시:
    $0 input.txt                           # stdout으로 출력
    $0 input.txt -o output.txt             # 파일로 출력
    $0 mdt-workflow.service -o mdt-workflow-resolved.service
EOF
}

# 환경 변수 치환 함수
substitute_env_vars() {
    local content="$1"
    local result=""
    
    # ${VAR_NAME} 패턴을 찾아서 치환
    while [[ $content =~ \$\{([^}]+)\} ]]; do
        local var_name="${BASH_REMATCH[1]}"
        local var_value="${!var_name}"
        
        if [[ -z "$var_value" ]]; then
            echo "오류: 환경 변수가 정의되지 않았습니다: $var_name" >&2
            exit 1
        fi
        
        # 첫 번째 매치를 치환
        result="${content%%\$\{$var_name\}*}$var_value"
        content="${content#*\$\{$var_name\}}"
        content="$result$content"
    done
    
    echo "$content"
}

# 파일 처리 함수
process_file() {
    local input_file="$1"
    local output_file="$2"
    
    if [[ ! -f "$input_file" ]]; then
        echo "오류: 파일을 찾을 수 없습니다: $input_file" >&2
        exit 1
    fi
    
    # 파일 내용 읽기
    local content
    content=$(cat "$input_file")
    
    # 환경 변수 치환
    local substituted_content
    substituted_content=$(substitute_env_vars "$content")
    
    if [[ -n "$output_file" ]]; then
        echo "$substituted_content" > "$output_file"
        echo "환경 변수가 치환되어 $output_file에 저장되었습니다."
    else
        echo "$substituted_content"
    fi
}

# 메인 함수
main() {
    local input_file=""
    local output_file=""
    local verbose=false
    
    # 인수 파싱
    while [[ $# -gt 0 ]]; do
        case $1 in
            -o|--output)
                output_file="$2"
                shift 2
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            -*)
                echo "알 수 없는 옵션: $1" >&2
                usage
                exit 1
                ;;
            *)
                if [[ -z "$input_file" ]]; then
                    input_file="$1"
                else
                    echo "오류: 여러 입력 파일이 지정되었습니다." >&2
                    usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # 입력 파일이 지정되지 않은 경우
    if [[ -z "$input_file" ]]; then
        echo "오류: 입력 파일이 지정되지 않았습니다." >&2
        usage
        exit 1
    fi
    
    # 상세 정보 출력
    if [[ "$verbose" == true ]]; then
        echo "입력 파일: $input_file"
        if [[ -n "$output_file" ]]; then
            echo "출력 파일: $output_file"
        fi
    fi
    
    # 파일 처리
    process_file "$input_file" "$output_file"
}

# 스크립트 실행
main "$@"
