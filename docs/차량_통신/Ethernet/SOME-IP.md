---
layout: default
title: SOME/IP
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 5
parent: 'Ethernet'
permalink: '/차량_통신/Ethernet/SOME-IP'
redirect_from:
 - "/3f71b412900a81ef8662f3595c5c474b"
---
## 서비스의 method를 호출하고 event를 구독하는 상황


Service ID와 instance, method·event, request ID는 의미와 응답 관계를 표현한다. Discovery와 application data의 경로를 나누고 serialization과 version을 계약으로 관리해야 한다.


> SOME/IP의 서비스·메서드·이벤트와 서비스 탐색을 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
표기는 SOME/IP. AUTOSAR 적용 릴리스의 SOME/IP·SOME/IP-SD 규격과 deployment 설정을 확인한다.
</div>
</div>
</blockquote>



### 서비스 구조


서비스와 인스턴스, 메서드와 이벤트·eventgroup을 구분한다. 제공자·소비자, 요청·응답, 이벤트 발행·구독과 인터페이스 버전을 연결해 읽는다.


### 메시지와 직렬화


Service ID·Method/Event ID, Client ID·Session ID, Message Type, Return Code 등 메시지 식별·처리 정보를 확인한다. Payload 직렬화는 인터페이스와 타입 정의에 따라 해석한다.


Transport가 UDP인지 TCP인지, 서비스 deployment와 포트·주소가 무엇인지 확인한다. SOME/IP가 언제나 TCP 또는 언제나 UDP만 사용한다고 가정하지 않는다.


### 서비스 탐색


SOME/IP-SD의 제공·탐색·구독 절차, TTL, endpoint와 eventgroup 구성을 확인한다. 서비스를 찾았다는 사실과 호출·구독 데이터의 정상 처리 여부를 구분한다.


### 검증 항목

- 제공 전·후 탐색과 TTL 만료.
- 인터페이스 버전·서비스·인스턴스 불일치.
- 요청·응답 상관관계와 오류 응답.
- 구독·해제·제공자 재시작과 복구.
- 직렬화 경계값·길이와 미지원 입력.

### 실습: 서비스 제공·구독 점검


설명용 설정: Service ID 0x1234, instance 0x0001, method 0x0001, event 0x8001, eventgroup 0x0001. 식별자는 실제 시스템 값이 아니다.


제공자 시작 → OfferService 캡처 → 소비자 탐색 → 메서드 요청·응답의 Request ID 비교 → 이벤트 구독·acknowledgement → 이벤트 수신 순으로 확인한다.


### 실패 분석 예제


Offer가 보이는데 호출이 실패하면 interface version, instance·endpoint·transport·포트를 확인한다. 구독은 성공했는데 이벤트가 없으면 eventgroup 매핑과 실제 publish 조건을 확인한다.


제공자를 재시작한 뒤 TTL·재탐색·재구독과 오래된 상태의 정리를 확인한다. Wireshark의 someip·someipsd dissector 지원과 decode-as 설정도 확인한다.


## 이해를 확인하는 질문


> Service가 발견되면 event를 즉시 받을 수 있을까?


Subscription, endpoint·QoS에 해당하는 transport 조건, service state와 payload 호환성이 추가로 필요하다.

