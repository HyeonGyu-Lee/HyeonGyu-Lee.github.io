---
layout: default
title: ISO-TP
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 8
parent: '차량 통신'
permalink: '/차량_통신/ISO-TP'
redirect_from:
 - "/3f71b412900a81c79699d4171ad95281"
---
## 한 CAN frame보다 긴 UDS 데이터를 보내는 상황


ISO-TP는 payload를 분할하고 receiver의 FlowControl에 맞춰 전송을 진행한다. CAN arbitration과 transport pacing은 다른 시간 제약이며 timeout의 발생 계층도 구분해야 한다.


> CAN에서 큰 진단 데이터를 분할·흐름 제어·재조립하는 전송 protocol을 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
ISO 15765-2 적용 판과 Classic CAN·CAN FD link 계층 설정을 확인한다.
</div>
</div>
</blockquote>



### 역할과 frame


ISO-TP는 UDS 자체가 아니라 CAN 위에서 진단 데이터를 전달하는 전송 계층이다. Single Frame, First Frame, Consecutive Frame, Flow Control을 구분한다.


### 흐름 제어


Flow Control의 상태, Block Size, STmin을 읽는다. 수신 측 처리 능력과 전송 간격·블록 단위 제어를 연결한다. Sequence Number는 분할 frame의 순서 확인에 사용된다.


### 주소와 길이


주소 지정 방식, CAN ID, 추가 주소 바이트, CAN FD 데이터 길이와 패딩을 확인한다. 모든 Single Frame의 최대 길이가 항상 동일하다고 가정하지 않는다.


### timeout 구분


ISO-TP 전송 계층의 timeout과 UDS P2/P2* 응답 시간을 구분한다. 전송 실패인지 유효한 UDS 부정 응답인지 먼저 판단한다.


### 검증 항목

- 단일·분할 전송과 데이터 길이 경계.
- Flow Control의 허용·대기·overflow 처리.
- 블록 크기·전송 간격과 sequence 오류.
- frame 누락·전송 중단·동시 통신.
- 재조립 완료와 UDS 서비스의 결과를 분리해 판정.

### 실습: can-utils 전송 도구


동일 vcan0에서 송신 ID 0x700, 수신 ID 0x708의 설명용 구성이다. 도구의 송신·수신 옵션은 해당 버전의 도움말로 확인한다.


```bash
# 터미널 A: 반대 방향 주소로 수신
isotprecv -s 708 -d 700 vcan0
# 터미널 B: 10바이트 payload 전송
printf '01 02 03 04 05 06 07 08 09 0A
' | isotpsend -s 700 -d 708 vcan0
```



candump를 함께 실행해 First Frame, Flow Control, Consecutive Frame을 관찰하고 수신 payload가 원본과 일치하는지 확인한다. 실제 ECU의 주소·CAN FD·패딩 정책은 별도 설정한다.


### 분석 예제


First Frame 이후 진행되지 않으면 Flow Control 수신 여부 → 주소 방향 → timeout → Block Size·STmin 순서로 본다. UDS 0x78 응답과 전송 계층의 Flow Control을 혼동하지 않는다.


## 이해를 확인하는 질문


> FlowControl의 STmin이 CAN bit time과 같은가?


STmin은 consecutive frame 사이의 transport 간격이다. Bus bitrate와 arbitration 지연은 별도로 전송 시간에 영향을 준다.

