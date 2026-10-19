---
layout: default
title: MOST
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 6
parent: '차량 통신'
permalink: '/차량_통신/MOST'
redirect_from:
 - "/3f71b412900a81e1984edd688374dd6d"
---
## 음성·영상 stream과 control data를 함께 다루는 상황


MOST는 multimedia 전달의 시간·자원 배분을 network 구조와 연결한다. 서로 다른 세대의 physical 조건과 channel 구성을 같은 대역폭 숫자로 비교해서는 안 된다.


> 차량 멀티미디어 network의 대역폭·연결 관리 관점에서 MOST를 소개한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
MOST 세대와 사용하는 PHY·node 제품을 먼저 확인한다. 현재 차량에 적용됐다는 의미는 아니다.
</div>
</div>
</blockquote>



### 목적


MOST는 오디오·비디오 등 멀티미디어 데이터와 제어를 전달하기 위한 network 계열이다. MOST25·MOST50·MOST150처럼 세대별 전송 능력과 구성 차이를 구분한다.


### 구조와 데이터


링 등의 network 구성, network 타이밍, 제어 데이터와 미디어 데이터 경로, 연결·대역폭 할당을 함께 읽는다. 모든 세대가 같은 매체나 기능을 사용하는 것은 아니다.


### 분석 관점


연결 상태와 미디어 스트림의 상태를 분리한다. network 동기화, node 합류·제거, 스트림 경로, buffer와 시간 정보를 확인한다.


### 검증 항목

- startup와 topology 변경.
- 스트림 연결·해제와 자원 부족.
- 오디오·비디오 연속성 및 end-to-end 지연.
- link 손실과 복구 후 상태.

### 다른 network와 비교


Ethernet 기반 미디어 전송과 비교할 때 세대·기능·topology·동기화·기존 시스템 호환성을 함께 검토한다. 특정 network가 모든 차량에서 완전히 대체됐다고 단정하지 않는다.


### 실습: 미디어 경로 점검


예제 경로: 오디오 소스 → network → 앰프 node. node의 연결 상태, network lock, stream 연결, 채널 할당, 재생 상태를 각각 기록한다.


스트림 시작·종료를 반복하고 node를 재시작해 연결 복구와 오디오 끊김을 확인한다. 끊김 발생 시 network 상태와 buffer underrun 등 application 상태를 같은 시간축으로 비교한다.


protocol 분석 장비의 설정과 원본 캡처를 보존하고, 실제 제품의 MOST 세대와 PHY에 맞는 시험 절차를 사용한다.


## 이해를 확인하는 질문


> 평균 대역폭만 맞으면 stream 품질도 보장될까?


연속 공급, 지연·jitter와 자원 할당이 함께 맞아야 한다. Burst나 clock 문제는 평균값에 드러나지 않을 수 있다.

