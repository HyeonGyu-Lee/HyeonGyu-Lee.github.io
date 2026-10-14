---
layout: default
title: "REST API"
has_children: false
published_date: 2026-10-13T23:24:00.000Z
last_modified_date: 2026-10-14T13:25:00.000Z
nav_order: 6
parent: "기타"
permalink: '/기타/REST_API'
redirect_from:
 - "/3f81b412900a81f297e0de21b1ee3596"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


> REST API는 리소스를 URI로 식별하고 HTTP의 메서드·상태 코드·헤더를 활용하는 인터페이스 설계 방식이다. 실무에서는 URL 형태뿐 아니라 인증, 입력 검증, 오류 계약, 재시도, 관측 가능성을 함께 설계해야 클라이언트와 서버가 안정적으로 협업할 수 있다.


## 적용 범위와 실습 전제


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
아래 예제는 작업 관리 API /v1/tasks를 가정한 요청·응답 계약이다. 예제 서버를 제공하는 것은 아니므로 실제 호출 시 구현된 개발 서버 주소와 토큰으로 바꾼다. 운영 데이터 대신 테스트 계정을 사용하고, 예시 상태 코드·필드·제한 정책을 팀의 API 명세와 맞춘다.
</div>
</div>
</blockquote>



## 1. 리소스와 HTTP 메서드 설계

- GET /v1/tasks — 목록 조회. GET /v1/tasks/{id} — 단건 조회. 조회 요청은 서버 상태를 변경하지 않도록 구현한다.
- POST /v1/tasks — 작업 생성. 성공 시 201 Created와 생성 리소스의 Location 헤더를 반환한다.
- PUT /v1/tasks/{id} — 표현 전체 교체. 누락 필드 처리와 생성 허용 여부를 계약으로 정한다. PATCH는 일부 변경이며 패치 형식에 따라 멱등성이 달라진다.
- DELETE /v1/tasks/{id} — 삭제. 응답이 204이면 본문을 보내지 않는다. 반복 호출 시 404가 나와도 최종 상태가 같으면 멱등성에 어긋나지 않는다.

명사 중심 경로를 사용하되 모든 행위를 CRUD에 억지로 맞추지는 않는다. 장시간 실행 작업은 POST /v1/jobs로 생성하고 202 Accepted와 상태 조회 URI를 제공할 수 있다. REST의 무상태성은 서버에 데이터가 없다는 뜻이 아니라 각 요청에 처리에 필요한 인증·문맥이 포함된다는 뜻이다.


## 2. curl로 생성 → 조회 → 수정 → 삭제


bash 환경에서 API_BASE와 API_TOKEN을 사전에 설정한다. 토큰을 소스 코드나 공유 문서에 직접 넣지 않는다. --fail-with-body는 HTTP 오류에서 종료 코드를 실패로 만들면서 응답 본문을 보존한다(curl 7.76 이상).


```bash
# 사전에 환경변수 설정: API_BASE는 개발 서버, API_TOKEN은 테스트 토큰
: "${API_BASE:?개발 서버 주소를 설정하세요}"
: "${API_TOKEN:?테스트 토큰을 설정하세요}"

curl --fail-with-body -i --connect-timeout 5 --max-time 15   -X POST "$API_BASE/v1/tasks"   -H "Authorization: Bearer $API_TOKEN"   -H 'Content-Type: application/json'   -H 'Accept: application/json'   --data '{"title":"CAN 로그 분석","status":"todo"}'
```



```text
HTTP/1.1 201 Created
Content-Type: application/json
Location: /v1/tasks/task_123

{"id":"task_123","title":"CAN 로그 분석","status":"todo"}
```



다음 task_123은 예시 ID다. 생성 응답의 실제 id로 치환한다. PATCH는 이 예제에서 정의한 JSON 필드 부분 갱신 계약이며 JSON Patch 문법과는 다르다.


```bash
TASK_ID=task_123
curl --fail-with-body -i --max-time 15   "$API_BASE/v1/tasks/$TASK_ID" -H "Authorization: Bearer $API_TOKEN"

curl --fail-with-body -i --max-time 15   -X PATCH "$API_BASE/v1/tasks/$TASK_ID"   -H "Authorization: Bearer $API_TOKEN"   -H 'Content-Type: application/json' --data '{"status":"done"}'

curl --fail-with-body -i --max-time 15   -X DELETE "$API_BASE/v1/tasks/$TASK_ID"   -H "Authorization: Bearer $API_TOKEN"
```



## 3. 필터링과 페이지네이션


```bash
curl --fail-with-body --get --max-time 15 "$API_BASE/v1/tasks"   -H "Authorization: Bearer $API_TOKEN"   --data-urlencode 'status=todo'   --data-urlencode 'limit=20'   --data-urlencode 'sort=-created_at'
```



```json
{
  "items": [{"id":"task_123","title":"CAN 로그 분석","status":"todo"}],
  "next_cursor": "opaque-cursor-value"
}
```



후속 요청에는 cursor=next_cursor를 전달하고 필터·정렬 조건을 유지한다. next_cursor가 null이면 종료한다. 서버는 limit 상한을 검증하고 created_at+id처럼 동률을 해소할 정렬 기준을 사용한다. 커서는 불투명 값으로 취급한다. 변경이 많은 데이터에서 오프셋 방식은 누락·중복이 발생하기 쉬우며, 커서 방식도 스냅샷 보장 여부를 별도로 정의해야 한다.


## 4. 오류 응답을 계약으로 다루기

- 400: 잘못된 JSON·요청 형식. 401: 인증 정보 누락 또는 유효하지 않음. 403: 인증되었지만 접근 권한 부족. 필요하면 리소스 존재 노출을 막기 위해 일관된 404 정책을 사용한다.
- 404: 리소스 없음. 409: 현재 상태와 충돌. 412: If-Match 같은 사전 조건 실패. 422: 요청 형식은 읽을 수 있지만 필드 값이 유효하지 않음. 429: 요청 한도 초과. 5xx: 서버 측 처리 실패.

오류는 RFC 9457 Problem Details의 application/problem+json 형태로 통일할 수 있다. 클라이언트 분기에는 안정된 오류 코드나 type을 사용하고, 사람이 읽는 detail 문자열에 의존하지 않는다. 스택 트레이스·토큰·내부 SQL은 반환하지 않는다.


```json
{
  "type": "https://example.com/problems/validation",
  "title": "입력값 검증 실패",
  "status": 422,
  "detail": "title은 비어 있을 수 없습니다.",
  "instance": "/v1/tasks",
  "errors": [{"field":"title","code":"required"}],
  "request_id": "req-example-001"
}
```



## 5. 타임아웃·재시도·중복 생성 방지


연결 시간과 전체 요청 시간을 제한한다. GET 등 재시도 가능한 요청에서 일시적인 연결 실패, 429, 502·503·504를 대상으로 제한된 횟수의 지수 백오프와 지터를 적용한다. Retry-After가 있으면 초 또는 HTTP 날짜를 파싱한다. 400·401·403을 무조건 재시도하면 해결되지 않고 부하만 늘어난다.


POST는 타임아웃이 나도 서버에서 생성되었을 수 있다. 재전송이 필요하다면 서버가 지원하는 Idempotency-Key 계약을 사용한다. 서버는 키와 요청 해시·결과를 원자적으로 관리하고 동일 키의 다른 본문을 거부해야 한다. 보관 기간·동시 요청 처리를 명세한다. 이 헤더를 붙이는 것만으로 자동 멱등성이 생기지 않는다.


```bash
# 서버가 Idempotency-Key를 지원할 때만 사용한다.
# 같은 생성 작업의 재시도에는 같은 키와 본문을 유지한다.
REQUEST_KEY=$(python3 -c 'import uuid; print(uuid.uuid4())')
curl --fail-with-body -i --max-time 15 -X POST "$API_BASE/v1/tasks"   -H "Authorization: Bearer $API_TOKEN"   -H "Idempotency-Key: $REQUEST_KEY"   -H 'Content-Type: application/json'   --data '{"title":"진단 결과 정리","status":"todo"}'
```



## 6. 동시 수정과 캐시


GET 응답에 ETag를 제공하고 PATCH·PUT 요청에 If-Match를 요구하면 오래된 화면이 다른 사용자의 변경을 덮어쓰는 문제를 막을 수 있다. ETag 불일치는 412로 응답하고 클라이언트는 최신 데이터를 조회해 병합한다. 조회 캐시는 If-None-Match와 304를 활용한다. 인증된 민감 데이터는 Cache-Control: private 또는 no-store 등 의도한 정책을 명시한다.


```bash
# 먼저 GET 응답에서 얻은 실제 ETag를 사용한다.
curl --fail-with-body -i --max-time 15 -X PATCH   "$API_BASE/v1/tasks/$TASK_ID"   -H "Authorization: Bearer $API_TOKEN"   -H 'If-Match: "task-version-3"'   -H 'Content-Type: application/json' --data '{"status":"done"}'
```



## 7. 인증·인가와 브라우저 연동

- HTTPS를 사용하고 사용자 인증과 리소스별 인가를 분리한다. 로그인에 성공했더라도 다른 사용자의 task ID를 넣어 조회·수정하지 못하도록 서버에서 소유권을 검증한다.
- 외부 로그인은 OAuth 2.0/OIDC 흐름과 토큰 만료·갱신 정책을 사용한다. 브라우저나 Electron 렌더러에 서버용 비밀 키를 넣지 않는다. JWT는 인코딩된 데이터이며 기본적으로 암호화된 비밀 저장소가 아니다.
- CORS는 브라우저의 교차 출처 접근 정책이며 인증 수단이 아니다. 허용 Origin·메서드·헤더와 OPTIONS preflight를 확인한다. 자격 증명 요청에서 Allow-Origin: *를 사용하지 않는다.
- 쿠키 인증은 HttpOnly·Secure·SameSite와 CSRF 방어를 함께 설계한다. 브라우저 저장소 토큰은 XSS 노출을 고려한다. 로그에 Authorization 헤더나 개인정보를 그대로 기록하지 않는다.

## 8. 자동 검증 예제


Node.js 24의 내장 fetch와 node:test로 개발 API의 생성·조회·삭제 계약을 확인한다. 아래 파일을 rest-api.test.mjs로 저장하고 API_BASE·API_TOKEN을 설정한 뒤 node --test rest-api.test.mjs를 실행한다. 이 테스트는 실제 테스트 데이터를 생성하므로 격리된 개발 환경에서 실행한다.


```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE?.replace(/\/$/, '');
const token = process.env.API_TOKEN;
if (!base || !token) throw new Error('API_BASE와 API_TOKEN이 필요합니다.');

async function request(path, options = {}) {
  return fetch(`${base}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(10000)
  });
}

test('작업 생성·조회·삭제 계약', async () => {
  let id;
  try {
    const created = await request('/v1/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'API 계약 테스트', status: 'todo' })
    });
    assert.equal(created.status, 201);
    const task = await created.json();
    assert.ok(task.id);
    id = encodeURIComponent(task.id);
    assert.ok(created.headers.get('location'));
    const response = await request(`/v1/tasks/${id}`);
    assert.equal(response.status, 200);
    const loaded = await response.json();
    assert.equal(loaded.title, 'API 계약 테스트');
    assert.equal(loaded.status, 'todo');
  } finally {
    if (id) {
      const removed = await request(`/v1/tasks/${id}`, { method: 'DELETE' });
      assert.equal(removed.status, 204);
    }
  }
});
```



## 9. 검증 시나리오와 운영 확인


| **항목**    | **설명 및 적용 기준**                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| **정상**    | 생성 201·Location, 조회 200·스키마, 수정 반영, 삭제 204·빈 본문을 확인한다. 날짜·시간대·null·빈 배열의 표현도 계약에 포함한다.                                  |
| **입력 경계** | 빈 제목, 최대 길이 초과, 잘못된 enum, 깨진 JSON, 미지원 Content-Type, 비정상 limit를 보낸다. 서버가 5xx 대신 정의한 4xx를 반환하는지 확인한다.                    |
| **보안**    | 토큰 누락·만료, 다른 사용자 ID, 권한 없는 메서드, 임의 필드 추가를 검증한다. 서버가 수정 허용 필드를 명시적으로 제한하는지 확인한다.                                         |
| **경합·장애** | 같은 멱등 키 중복 요청, 오래된 ETag, 429와 Retry-After, 응답 지연, 네트워크 단절을 검증한다. 실제 서버에 장애를 유발하기보다 테스트 서버·모의 응답을 활용한다.                  |
| **운영**    | 요청 ID로 클라이언트 오류와 서버 로그를 연결한다. 엔드포인트별 요청 수, 4xx·5xx 비율, p95·p99 지연, 제한 초과 횟수를 관찰한다. 메트릭 레이블에 사용자 ID 같은 고유 값을 무제한 넣지 않는다. |


## 10. 팀에서 적용하는 순서


리소스·권한 모델 정의 → OpenAPI 3.1로 요청·응답·오류·인증 명세 → 모의 서버로 프론트엔드 연동 → 서버 구현 → 계약·권한·장애 테스트 → 개발 환경 검증 → 운영 지표 확인 순으로 진행한다. 필드 삭제·의미 변경은 호환성을 깨뜨리므로 버전·폐기 일정과 마이그레이션 경로를 제공한다. 문서의 예제를 CI에서 검증하면 구현과 명세의 차이를 줄일 수 있다.
