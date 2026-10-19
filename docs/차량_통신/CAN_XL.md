---
layout: default
title: "CAN XL"
has_children: false
published_date: 2026-10-12T04:26:00.000Z
last_modified_date: 2026-10-14T13:25:00.000Z
nav_order: 3
parent: "차량 통신"
permalink: '/차량_통신/CAN_XL'
redirect_from:
 - "/3f71b412900a813da3e5f539116b266e"
---

## 큰 데이터와 기존 CAN traffic의 수용 방법을 비교하는 상황

Payload와 전송 효율의 확장은 controller와 physical layer, 분석 도구의 지원을 함께 요구한다. 최대 속도 숫자보다 traffic 종류와 구성 요소의 호환성을 기준으로 판단해야 한다.

> CAN 계열에서 대용량 페이로드 전송을 다루는 CAN XL의 목적과 호환 조건을 소개한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
CAN XL의 개념 안내. 규격 판·컨트롤러·PHY의 실제 지원을 확인하기 전에는 제품 호환성을 주장하지 않는다.
</div>
</div>
</blockquote>





### 목적과 특징


CAN XL은 Classic CAN·CAN FD보다 큰 페이로드를 제공하며 최대 2048바이트 데이터 길이를 지원하는 프레임을 정의한다. 높은 데이터 처리량을 위한 데이터 구간과 프레임 메타데이터를 고려한다.


### 비교할 관점


페이로드 크기, 중재, 오류 검출, 상위 데이터 운반 방식, 지원 PHY를 비교한다. CAN FD보다 큰 프레임이 모든 제어 메시지에 유리한 것은 아니며 지연·배선·비용과 함께 판단한다.


### 호환성


같은 CAN 계열이라는 이유로 Classic CAN 또는 CAN FD 노드가 CAN XL 프레임을 해석할 수 있다고 가정하지 않는다. 혼합 네트워크 운용 조건과 오류 동작은 적용 규격과 제품 지원을 확인한다.


### 도입 시 구성


컨트롤러·트랜시버·분석 도구·게이트웨이의 지원 버전, 데이터 구간 타이밍, 배선 조건, 상위 프로토콜과 전송 단위의 매핑을 기록한다.


### 검증 항목

- 페이로드 길이 경계와 프레임 오류 처리.
- 지원 프레임 형식과 혼합 운용 조건.
- 처리량·최악 지연·재전송에 따른 영향.
- 게이트웨이와 분석 도구의 프레임 해석.

### 실무 적용 검토 예제


예제: gateway가 1500바이트 데이터를 전달해야 한다. CAN XL을 선택하기 전에 컨트롤러·PHY·분석 도구의 지원, 페이로드 매핑, 주기와 최대 지연을 표로 정리한다.


비교 시험은 64·512·1500·2048바이트 입력과 경쟁 트래픽을 포함한다. 송신 시각부터 수신 애플리케이션 처리까지 측정하고 오류·재전송·메모리 사용을 기록한다. 장치별 API가 달라 공통 명령만으로 모든 CAN XL 장비를 시험할 수는 없다.

## 이해를 확인하는 질문

> Payload가 크면 작은 주기 message에도 항상 유리할까?

우선순위, blocking 시간, frame overhead와 구현 제약을 함께 비교해야 한다. 큰 payload의 이점이 모든 traffic의 지연 감소를 뜻하지 않는다.
