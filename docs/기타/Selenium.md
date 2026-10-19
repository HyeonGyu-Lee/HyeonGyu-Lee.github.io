---
layout: default
title: Selenium
has_children: false
published_date: 2024-08-09-13-08-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 3
parent: '기타'
permalink: '/기타/Selenium'
redirect_from:
 - "/a1271ad8aacf4f759024ea9397642edc"
---
## 비동기 화면에서 버튼을 누르고 결과를 확인하는 상황


Browser automation은 요소 탐색, 동작과 상태 관찰을 구분해야 한다. 고정 sleep 대신 원하는 조건을 기다려야 환경 속도 차이와 실제 오류를 분리할 수 있다.


> 브라우저 검색 동작을 명시적 대기와 결과 assertion으로 검증하는 예제를 다룬다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
실행 예제의 주소·선택자·인터페이스·설정값은 시험 환경에 맞게 변경한다. 규격의 적용 판과 도구 버전을 확인한다.
</div>
</div>
</blockquote>



### 핵심 요약


Selenium WebDriver는 브라우저를 제어해 사용자 동작과 페이지 상태를 검증하는 도구다. 단순 클릭 자동화와 결과를 판정하는 테스트를 구분한다.


### 테스트 설계 순서


사용자 시나리오 → 준비 조건 → 동작 → 기대 결과 → 검증 → 정리 순서로 작성한다. 버튼 클릭이 성공했다는 사실보다 목적한 상태·내용이 나타났는지를 확인한다.


### 요소 선택


안정적인 ID나 테스트 전용 속성을 우선 고려한다. DOM 위치에 의존하는 긴 XPath, 화면 문구 전체에 의존하는 선택자는 변경 영향이 크므로 목적과 제약을 기록한다.


### 대기와 비동기 처리


고정 sleep 대신 필요한 조건을 기다리는 explicit wait를 사용한다. 요소 존재, 표시, 클릭 가능, 작업 완료는 서로 다른 조건이다. implicit wait와 explicit wait를 혼용하면 대기 시간이 예상과 달라질 수 있다.


### 흔한 실패 원인

- 렌더링 전에 요소를 찾음.
- DOM 갱신 후 이전 요소 참조를 사용해 stale element 발생.
- iframe 또는 새 창으로 전환하지 않음.
- 테스트 데이터·로그인 상태가 다른 테스트에 의존함.
- 애니메이션·오버레이로 실제 클릭이 가로막힘.

### 실패를 분석할 기록


브라우저·드라이버 버전, 실행 URL, 테스트 조건, 실패 단계, 오류 메시지와 스크린샷을 연결한다. 토큰·비밀번호·개인정보가 포함된 화면이나 로그는 공개 자료에서 제거한다.


### 재사용 가능한 검증 예시


설명용 시나리오: 기술 문서 사이트에서 검색어 입력 → 결과 표시 대기 → 예상 문서 존재 확인 → 결과 클릭 → 문서 제목 확인. 이 절차는 제안이며 해당 사이트에서 실행·통과한 시험 결과가 아니다.


### 공식 출처


WebDriver 안내: https://www.selenium.dev/documentation/webdriver/


대기 전략: https://www.selenium.dev/documentation/webdriver/waits/


### 실습: 기술 문서의 검색 결과 검증


Python Selenium 4를 사용하는 예제다. 실제 사이트의 선택자를 개발자 도구로 확인해 SEARCH·RESULT·TITLE을 채운다.


```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SEARCH = "input#search-input"
RESULT = ".search-result a"
TITLE = "h1"
driver = webdriver.Chrome()
try:
    driver.get("https://autosar.dev/")
    wait = WebDriverWait(driver, 10)
    search = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, SEARCH)))
    search.send_keys("Dcm")
    result = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, RESULT)))
    result.click()
    wait.until(lambda d: "Dcm" in d.find_element(By.CSS_SELECTOR, TITLE).text)
finally:
    driver.quit()
```



선택자는 설명용이며 현재 DOM과 다르면 수정한다. 첫 결과가 원하는 문서인지도 확인하도록 조건을 보강한다. Timeout 발생 시 screenshot·현재 URL·실패 단계·선택자를 저장하고 고정 sleep 증가로만 해결하지 않는다.


## 이해를 확인하는 질문


> Click이 성공하면 사용자의 작업도 완료된 것인가?


결과 상태나 데이터가 반영됐는지 확인해야 한다. Click은 입력 동작의 수행만 나타낼 수 있다.

