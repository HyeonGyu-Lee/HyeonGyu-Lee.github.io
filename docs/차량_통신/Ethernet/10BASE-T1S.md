---
layout: default
title: 10BASE-T1S
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 9
parent: 'Ethernet'
permalink: '/차량_통신/Ethernet/10BASE-T1S'
redirect_from:
 - /3f71b412900a81a6a543d4e1f5c8fa9f
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


단거리 single-pair Ethernet의 10 Mbit/s 통신과 multidrop·PLCA를 설명한다.


## 적용 범위


IEEE 802.3cg-2019에서 정의된 10BASE-T1S를 중심으로 설명한다. 실제 거리·노드 수·매체 조건은 표준과 PHY 사양을 확인한다.


## 본문


### 핵심 특성


10BASE-T1S는 10 Mbit/s의 single-pair Ethernet PHY로 short-reach 환경을 다룬다. Multidrop 구성에서는 여러 노드가 같은 매체를 공유하는 half-duplex 운용을 고려한다.


Point-to-point와 multidrop 지원은 PHY와 적용 구성에서 확인한다. 공유 매체의 10 Mbit/s는 각 노드가 동시에 독립적인 10 Mbit/s를 얻는다는 의미가 아니다.


### PLCA의 역할


Physical Layer Collision Avoidance는 참여 노드에 송신 기회를 부여해 매체 접근을 조정한다. Coordinator와 local node ID, 참여 구성과 송신 관련 파라미터를 일치시켜야 한다.


PLCA를 활성화했다는 사실만으로 end-to-end 지연과 대역폭이 보장되지는 않는다. 트래픽·프레임 길이·노드 수·설정과 상위 처리를 함께 분석한다.


### 비교


100BASE-T1·1000BASE-T1의 일반적인 point-to-point full-duplex 링크와 공유 multidrop 구성을 구분한다. 10BASE-T1L은 다른 장거리 지향 PHY이며 T1S의 배선·거리 규칙과 혼용하지 않는다.


### 설정과 배선


Node ID, coordinator 지정, PLCA 참여 조건, 종단과 stub, 케이블·커넥터·EMC 조건을 확인한다. 노드 수와 길이의 한계는 구현과 표준의 조건 없이 단일 숫자로 적용하지 않는다.


### 검증 항목

- 중복 node ID·coordinator 구성 오류.
- 노드 합류·제거와 전원 재인가.
- 여러 노드의 동시 트래픽과 송신 대기 시간.
- coordinator 손실과 실제 복구 동작.
- 배선·종단·EMC 조건에 따른 오류.

### 실습: PLCA 설정표


예제 구성은 coordinator ID 0, 참여 노드 ID 1·2·3이다. 각 장치에서 PLCA 활성화, local ID, 참여 구성과 coordinator 설정을 제품 문서에 따라 기록한다.


Linux와 드라이버가 해당 기능을 지원하는 경우:


```bash
ethtool --get-plca-cfg eth0
ethtool --get-plca-status eth0
```



Unsupported 응답이면 PHY·드라이버 지원 여부를 먼저 확인한다. 명령이 제공되지 않는 장치는 제조사 도구로 같은 설정을 확인한다.


### 검증 실습


노드별로 동일 크기 프레임을 전송하고 ID·timestamp·손실을 기록한다. 단일 송신, 동시 송신, 노드 제거·복귀, coordinator 재시작을 구분한다. 공유 매체 처리량과 각 노드의 최악 대기 시간을 각각 측정한다.


## 연결 문서·참고 자료


### 문서 탐색


[상위 문서: Ethernet](https://app.notion.com/p/Ethernet-3f71b412900a817b9e99f6616ada2231)


[IEEE 802.3cg 프로젝트](https://www.ieee802.org/3/cg/)


[OPEN Alliance](https://opensig.org/)

