---
layout: default
title: CAN FD
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 3
parent: '차량 통신'
permalink: '/차량_통신/CAN_FD'
redirect_from:
 - /3f71b412900a815caa45ee26fd52198f
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


Classic CAN 대비 확장된 데이터 길이와 선택적인 데이터 구간 속도 전환을 이해한다.


## 적용 범위


CAN FD 공통 개념. 실제 허용 비트레이트·배선·혼합 노드 조건은 ISO 11898과 하드웨어 사양을 따른다.


## 본문


### Classic CAN과의 차이


CAN FD는 데이터 페이로드를 최대 64바이트로 확장한다. BRS를 사용할 경우 중재 구간과 데이터 구간에 서로 다른 비트 타이밍을 적용할 수 있다. 모든 CAN FD 프레임이 고속 데이터 구간을 사용하는 것은 아니다.


CAN FD는 Classic CAN과 프레임 형식이 다르며 원격 프레임을 지원하지 않는다. 기존 노드가 물리적으로 연결된다는 사실만으로 CAN FD 프레임을 안전하게 처리한다고 가정하지 않는다.


### 길이와 프레임 해석


DLC는 8바이트를 초과하면 데이터 길이와 일대일 선형 대응하지 않는다. 12·16·20·24·32·48·64바이트로 매핑되는 구간을 실제 프레임 해석에서 확인한다.


### 설정 항목


Nominal/Data bit timing, BRS, 컨트롤러와 트랜시버의 지원, 필요 시 transmitter delay compensation을 확인한다. ISO CAN FD와 초기 비-ISO 구현의 차이도 제품 문서에서 확인한다.


### 성능 판단


페이로드 증가와 데이터 구간 가속은 처리량에 영향을 주지만, 중재·프레임 오버헤드·재전송·애플리케이션 주기가 전체 성능을 좌우한다. 비트레이트만으로 진단 전송 시간을 단정하지 않는다.


### 검증 항목

- BRS 사용·미사용 프레임과 다양한 DLC 길이.
- 정상·최대 페이로드, 패딩과 신호 정의.
- nominal/data 타이밍의 불일치와 오류.
- 기존 노드·게이트웨이·로깅 도구의 호환성.
- ISO-TP 사용 시 링크 계층 길이에 맞는 전송 설정.

### 실습: 12바이트 FD 프레임


can-utils와 vcan을 사용하는 API·프레임 해석 예제다. ## 뒤의 첫 숫자 1은 BRS 플래그를 나타낸다.


```bash
candump -tz vcan0
cansend vcan0 123##1112233445566778899AABBCC
```



ID 0x123, FD 형식, 12바이트 데이터와 BRS 표시를 확인한다. 실제 버스의 data bitrate는 vcan 실습에서 검증되지 않는다.


### 물리 버스 설정 예시


지원하는 실제 CAN FD 장치에서 사용할 예시 값이다. 차량 사양에 맞는 비트 타이밍을 확인한 후 적용한다.


```bash
sudo ip link set can0 down
sudo ip link set can0 type can bitrate 500000 dbitrate 2000000 fd on
sudo ip link set can0 up
ip -details -statistics link show can0
```



상대 노드·트랜시버의 지원과 종단을 확인하고 8·12·64바이트 프레임에서 오류 카운터·주기·지터를 비교한다.


## 연결 문서·참고 자료


### 문서 탐색


[상위 문서: 차량 통신](https://app.notion.com/p/3f71b412900a813ebd67db8632a81945)


[CiA CAN FD](https://www.can-cia.org/can-knowledge)


[ISO 11898](https://www.iso.org/search.html?q=ISO%2011898)

