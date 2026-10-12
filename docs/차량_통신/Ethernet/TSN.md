---
layout: default
title: TSN
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 16
parent: 'Ethernet'
permalink: '/차량_통신/Ethernet/TSN'
redirect_from:
 - /3f71b412900a8161b3e8f37cbcf99cea
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


시간 동기화와 큐·스케줄·자원 관리를 통해 Ethernet의 시간 특성을 다루는 TSN 기능을 정리한다.


## 적용 범위


IEEE 802.1 표준 기능별 적용과 자동차 프로파일을 구분한다. 모든 TSN 기능의 지원을 가정하지 않는다.


## 본문


### 기능 모음


TSN은 하나의 전송 프로토콜이 아니라 시간 민감 통신을 위한 표준 기능 모음이다. IEEE 802.1AS 시간 동기화, 802.1Qbv scheduled traffic, 802.1Qbu와 802.3br frame preemption, 802.1Qci per-stream filtering/policing 등을 구분한다.


### 시간과 스케줄


Clock 동기화 상태와 time-aware gate 스케줄을 연결해 확인한다. 스케줄만 설정하고 clock 오차·guard band·호스트 처리·전체 경로를 무시하면 end-to-end 요구를 충족하지 못할 수 있다.


### 구성 항목


Stream의 주기·최대 프레임·지연 요구, 토폴로지, 큐·우선순위, 스위치·NIC 지원, 스케줄과 clock 역할을 기록한다. 자동차 프로파일은 적용 판과 구현 적합성을 따로 확인한다.


### 검증 항목

- 동기화 획득·손실·복구와 시간 오차.
- 경쟁 트래픽 아래의 지연·지터.
- gate 스케줄·stream 구성 오류.
- 경로·노드 변경의 영향.
- 네트워크 구간과 애플리케이션 end-to-end 측정 분리.

### 실습: 시간 동기화와 큐 정책


먼저 지원 장치에서 timestamp 능력과 큐 구성을 확인한다.


```bash
ethtool -T eth0
tc -s qdisc show dev eth0
```



LinuxPTP·gPTP 구성은 장비 지원과 802.1AS 프로파일에 맞춘다. 일반 PTP 설정을 사용했다는 사실만으로 gPTP 적합성이 확인되는 것은 아니다.


### 실습: 경쟁 트래픽 시험


주기 stream과 bulk stream을 함께 전송하고 clock offset, enqueue·송신·수신 시각과 deadline miss를 기록한다. Qbv 사용 전후 조건을 동일하게 유지해 비교한다.


Gate schedule은 주기·큐·전송 시간·guard band를 포함해 검토한다. 설정 명령 성공, 하드웨어 offload 지원, 실제 end-to-end deadline 충족을 별개로 판정한다.


## 연결 문서·참고 자료


### 문서 탐색


[상위 문서: Ethernet](https://app.notion.com/p/Ethernet-3f71b412900a817b9e99f6616ada2231)


[IEEE TSN Task Group](https://www.ieee802.org/1/pages/tsn.html)


[IEEE 802.1](https://www.ieee802.org/1/)

