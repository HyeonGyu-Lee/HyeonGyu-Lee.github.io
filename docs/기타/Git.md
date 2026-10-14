---
layout: default
title: Git
has_children: false
published_date: 2026-10-14-13-10-00
last_modified_date: 2026-10-14-13-10-00
nav_order: 7
parent: '기타'
permalink: '/기타/Git'
redirect_from:
 - /3f91b412900a81bc8bc8d2bc06670870
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


Git은 파일의 변경 이력을 커밋으로 기록하는 분산 버전 관리 도구다. 실무에서는 현재 상태 확인 → 작업 브랜치 생성 → 변경 검토 → 커밋 → 원격 반영 → 코드 리뷰 흐름을 기본으로 사용한다. 작업 폴더, 스테이징 영역, 로컬 저장소, 원격 저장소를 구분하면 복구 명령을 안전하게 선택할 수 있다.


## 적용 범위와 실습 전제


예제는 Git 2.23 이상과 bash를 기준으로 하며 기본 브랜치는 main, 원격 이름은 origin으로 가정한다. 실제 저장소의 브랜치 정책을 먼저 확인한다. \<commit\> 같은 표기는 실제 값으로 바꾸고 꺾쇠는 입력하지 않는다. 복구·이력 변경 예제는 별도의 실습 저장소에서 연습한다.


## 1. 설치·사용자 설정과 저장소 시작


```bash
git --version
# 현재 저장소에만 적용: 커밋 작성자 정보이며 로그인 인증은 별도다.
git config user.name "Your Name"
git config user.email "your-email@example.com"
git config --get user.name
git config --get user.email

# 기존 저장소를 복제할 때
# git clone https://github.com/OWNER/REPOSITORY.git
# cd REPOSITORY

# 새 로컬 저장소를 만들 때
mkdir git-practice
cd git-practice
git init -b main
git config user.name "Practice User"
git config user.email "practice@example.com"
```



git config는 저장소 내부에서 실행한다. 모든 저장소의 기본값을 지정하려면 --global을 사용하되 업무용·개인용 작성자를 혼동하지 않도록 주의한다. GitHub HTTPS 인증은 비밀번호 대신 지원되는 토큰·자격 증명 관리자 등을 사용한다. 토큰을 remote URL이나 스크립트에 직접 적지 않는다.


## 2. 상태 확인과 변경 검토


```bash
git status --short --branch
# 작업 폴더와 스테이징 영역의 차이
git diff
# 다음 커밋에 들어갈 변경
git diff --staged
# 변경 파일 통계
git diff --stat
# 공백 오류와 남은 충돌 마커 등 점검
git diff --check
# 최근 이력과 브랜치 관계
git log --oneline --graph --decorate -15
```



git diff는 아직 추적되지 않은 파일의 내용을 보여주지 않는다. status에서 ?? 표시를 확인하고 파일 내용을 직접 검토한다. status --short의 첫 열은 스테이징 상태, 두 번째 열은 작업 폴더 상태다. git diff --check는 테스트 실행이나 모든 충돌 검증을 대체하지 않는다.


## 3. 필요한 변경만 커밋하기


```bash
printf '# Git practice
' > README.md
git add README.md
git diff --staged
git commit -m "docs: add project introduction"

# 일부 변경 덩어리만 선택해서 스테이징
git add -p
# 스테이징만 해제하고 실제 수정은 유지
git restore --staged README.md

# 마지막 커밋 내용 확인
git show --stat HEAD
git show HEAD -- README.md
```



git add .는 현재 경로 하위의 변경·삭제까지 포함할 수 있으므로 status를 먼저 확인한다. 기능 변경과 무관한 서식 변경을 분리하고, 커밋 전 프로젝트 테스트를 실행한다. 커밋 메시지는 무엇을 바꿨는지와 목적이 드러나도록 작성한다.


## 4. 브랜치에서 작업하고 원격으로 보내기


```bash
# 작업 폴더가 깨끗한지 먼저 확인
git status
git switch main
git pull --ff-only origin main
git switch -c feat/api-client

# 파일 수정 및 테스트 후
git add path/to/changed-file
git commit -m "feat: add API client"
git push -u origin feat/api-client

# 연결된 원격 브랜치 확인
git branch -vv
git remote -v
```



push -u는 이후 push·pull에서 사용할 upstream을 설정한다. Git 자체에는 Pull Request 명령이 없으므로 GitHub 등 호스팅 서비스에서 리뷰를 요청한다. 팀 정책에 따라 승인·테스트 후 병합한다. 원격 URL을 공유할 때 자격 증명이 포함되지 않았는지 확인한다.


## 5. fetch·pull·merge·rebase 구분

- fetch: 원격 이력과 추적 브랜치를 가져온다. 현재 작업 브랜치를 자동 병합하지 않는다.
- pull: fetch 후 병합 또는 rebase를 수행한다. --ff-only는 이력이 갈라졌으면 중단하므로 예상하지 못한 병합 커밋을 막는다.
- merge: 두 이력을 합친다. 상황에 따라 fast-forward 또는 병합 커밋이 만들어진다. 공유 이력을 유지하기에 적합하다.
- rebase: 커밋을 다른 기반 위에 다시 적용하여 커밋 ID를 바꾼다. 아직 공유하지 않은 개인 브랜치에서 주로 사용한다.

```bash
git fetch origin
git log --oneline --left-right HEAD...origin/main

# 개인 작업 브랜치에서 main 변경을 반영: 둘 중 팀 정책에 맞는 하나 선택
# git merge origin/main
# git rebase origin/main
```



pull --ff-only가 실패하면 원격과 로컬에 각각 어떤 커밋이 있는지 먼저 확인한다. 실패를 없애려고 무조건 reset --hard나 force push를 사용하지 않는다. 공개한 브랜치를 rebase해야 한다면 협업자와 이력 변경을 조율한다.


## 6. 충돌 해결 순서


```bash
git status
# 충돌 파일의 <<<<<<<, =======, >>>>>>> 구간을 열어 의도한 내용으로 수정
# 수정 후 충돌 마커를 제거하고 테스트 실행
git add path/to/conflicted-file

# 진행 중인 작업에 맞는 명령 하나만 사용
# merge 중: git merge --continue
# rebase 중: git rebase --continue
# cherry-pick 중: git cherry-pick --continue

# 전체 작업 취소도 해당 작업에 맞게 선택
# git merge --abort
# git rebase --abort
# git cherry-pick --abort
```



충돌 해결은 양쪽 코드를 단순히 이어 붙이는 작업이 아니다. API 계약·호출 순서·테스트 기대값을 함께 확인한다. rebase 과정에서는 ours와 theirs의 의미가 직관과 다를 수 있으므로 옵션 이름만 보고 한쪽을 통째로 선택하지 않는다. 작업 전 변경을 커밋하거나 임시 보관하면 abort 시 복구가 명확해진다.


## 7. 작업을 잠시 보관하는 stash


```bash
git stash push -u -m "WIP: API error handling"
git stash list
git stash show -p 'stash@{0}'
# 원본 stash를 남겨 둔 채 적용
git stash apply 'stash@{0}'
# 반영 및 테스트를 확인한 뒤에만 보관본 삭제
# git stash drop 'stash@{0}' 
```



-u는 추적되지 않은 파일도 포함하지만 ignored 파일은 포함하지 않는다. stash apply와 pop 모두 충돌할 수 있다. pop은 적용 성공 시 stash를 제거하므로 확인 후 drop하는 흐름이 복구에 유리하다. stash는 로컬에만 존재하며 원격 백업이 아니다.


## 8. 상황별 변경 복구

- 스테이징 실수: git restore --staged \<file\>. 작업 폴더 수정은 유지된다. 첫 커밋 이전 저장소는 HEAD가 없으므로 이 예제의 전제가 다르다.
- 아직 커밋하지 않은 추적 파일 수정 폐기: git restore \<file\>. 기본적으로 스테이징 내용으로 되돌리며 버려진 작업 폴더 변경은 Git으로 복구하지 못할 수 있다. diff 확인과 별도 백업 후 실행한다.
- 로컬 마지막 커밋만 취소하고 변경 유지: git reset --soft HEAD~1. 취소한 변경은 스테이징에 남는다. 부모 커밋이 있는 개인 브랜치에서만 사용한다.
- 이미 공유한 커밋 취소: git revert \<commit\>. 기존 이력을 지우지 않고 반대 변경을 새 커밋으로 만든다. 이후 변경과 충돌할 수 있다. 병합 커밋 revert는 mainline 선택이 필요하므로 별도 검토한다.

```bash
# 잘못된 reset/rebase 후 최근 HEAD 이동 확인
git reflog -15
# reflog에서 찾은 실제 커밋 ID로 새 복구 브랜치 생성
# git branch rescue/my-work <commit>

# 원격에 보내지 않은 마지막 커밋 메시지 수정
# git commit --amend -m "fix: clarify API timeout handling"
```



reflog는 로컬 기록이며 보존 기간과 객체 정리에 영향을 받는다. 아직 커밋하지 않은 모든 파일을 복구하는 도구가 아니다. reset --hard는 추적 파일의 변경을 버리고, clean -fd는 추적되지 않은 파일·디렉터리를 제거한다. clean은 먼저 git clean -nd로 대상만 미리 확인한다. 일반적인 공유 브랜치 복구에는 revert를 우선 검토한다.


## 9. 특정 커밋 적용과 변경 원인 추적


```bash
# 커밋 ID 확인 후 필요한 변경만 현재 브랜치에 적용
# git cherry-pick <commit>

# 특정 파일 이력과 이름 변경 추적
git log --follow -- path/to/file
# 특정 구간을 마지막으로 수정한 커밋
git blame -L 10,30 -- path/to/file
# 문자열의 등장 횟수를 바꾼 커밋 검색
git log -S 'timeoutMs' --oneline -- path/to/file
# 두 브랜치의 최종 파일 상태 비교
git diff main..feat/api-client
# 공통 조상 이후 작업 브랜치의 변경 비교
git diff main...feat/api-client
```



blame은 원인을 조사하는 출발점이다. 마지막 작성자만으로 결함 원인을 판단하지 말고 해당 커밋과 주변 변경을 살펴본다. git diff의 두 점·세 점 의미와 git log의 범위 의미는 같지 않다.


## 10. bisect로 회귀 발생 커밋 찾기


```bash
# 현재 문제가 재현되고 작업 폴더가 깨끗한 상태에서 시작
git bisect start
git bisect bad
# 실제로 정상 동작을 확인한 커밋으로 치환
# git bisect good <known-good-commit>
# Git이 선택한 커밋마다 재현 후 git bisect good 또는 git bisect bad
# 자동화된 재현 스크립트가 있다면:
# git bisect run ./scripts/reproduce-bug.sh
# 조사 종료 후 원래 위치 복귀
git bisect reset
```



자동 재현 스크립트는 정상일 때 0, 결함일 때 1 등 비영(1~127, 125 제외), 해당 커밋을 검사할 수 없을 때 125를 반환하도록 만든다. 빌드 환경 차이나 의존성 설치 실패를 결함으로 판정하지 않도록 구분한다.


## 11. .gitignore·태그·브랜치 정리


```text
# .gitignore 예시
node_modules/
.env
.env.*
!.env.example
_site/
*.log
```



```bash
# ignore 규칙 적용 위치 확인
git check-ignore -v .env
# 이미 추적 중인 파일은 ignore만으로 추적이 중단되지 않는다.
# 로컬 파일을 유지하며 추적 해제 후 커밋: git rm --cached .env

# 릴리스 승인 후 태그 생성 및 명시적 전송
# git tag -a v1.0.0 -m "Release 1.0.0"
# git push origin v1.0.0

# 병합 완료 후 다른 브랜치에서 정리
git switch main
git fetch --prune
# git branch -d feat/api-client
# git push origin --delete feat/api-client
```



비밀 키를 이미 커밋했다면 .gitignore나 추적 해제만으로 과거 이력에서 사라지지 않는다. 먼저 키를 폐기·교체하고 저장소 이력 정리는 팀과 조율한다. fetch --prune은 삭제된 원격 브랜치의 추적 참조를 정리하며 로컬 작업 브랜치를 자동 삭제하지 않는다. squash 병합 후 -d가 거절되면 변경 반영 여부를 확인하고 판단한다.


## 12. 자주 만나는 오류 대응

- non-fast-forward push 거절: fetch로 원격 변경을 확인한 뒤 merge 또는 합의된 rebase를 수행한다. 개인 브랜치의 이력 교체가 승인된 경우에도 --force보다 --force-with-lease를 사용하며, 이는 충돌 위험을 줄일 뿐 협업 조율을 대체하지 않는다.
- detached HEAD: 태그나 커밋을 직접 체크아웃한 상태다. 변경을 유지하려면 git switch -c rescue/my-work로 브랜치를 만든 뒤 커밋한다.
- unrelated histories: 서로 독립된 저장소를 합치려는 상황이다. remote와 저장소 경로가 맞는지 확인하며 --allow-unrelated-histories를 기본 해결책으로 사용하지 않는다.
- 인증 실패: git remote -v로 저장소 주소를 확인하고 HTTPS 자격 증명 또는 SSH 키 설정·저장소 권한을 확인한다. 커밋 user.name/user.email 설정은 서버 로그인 권한을 주지 않는다.

## 13. 실습 과제와 확인 기준


빈 실습 저장소에서 README 생성 → feat/notes 브랜치 생성 → 문장 수정 및 커밋 → main에 병합하는 흐름을 수행한다. 이후 두 브랜치에서 같은 줄을 다르게 수정해 충돌을 재현하고 해결한다. 마지막으로 잘못된 커밋을 revert하여 원본 커밋과 취소 커밋이 모두 남는지 확인한다. 실제 업무 저장소 대신 테스트 저장소에서 진행한다.


```bash
git status --short --branch
git log --oneline --graph --decorate --all
# 마지막 커밋과 변경 내용 검토
git show --stat HEAD
git diff --check
```



완료 기준: 의도한 변경만 커밋되었고, 불필요한 파일이 추적되지 않으며, 충돌 마커가 없고, 프로젝트 테스트가 통과해야 한다. 원격을 사용하는 실습에서는 upstream과 push 대상 브랜치도 확인한다.

