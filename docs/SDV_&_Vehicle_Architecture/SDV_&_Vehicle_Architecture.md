---
layout: default
title: SDV & Vehicle Architecture
has_children: true
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 8
permalink: '/SDV_&_Vehicle_Architecture'
redirect_from:
 - /3f91b412900a81cb839fcf8ff38a7cce
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


차량 구조, Service 설계, Middleware, 배포·운영을 연결하는 학습 경로다. 기존 차량 통신 문서의 CAN·Ethernet·SOME/IP·TSN은 전송과 설정을 다루고, 이 목차는 시스템 전체에서 어떤 역할로 조합하는지 다룬다. S32K312는 MCU 주변 제어 예시이며 Linux·ROS 2 실행 환경과 동일하다고 가정하지 않는다.


## Learning Path


```mermaid
flowchart TD
 A[SDV] --> B[E/E Architecture]
 B --> C[Zonal Architecture]
 C --> D[Service-Oriented Architecture]
 D --> E[ROS 2 / DDS / Zenoh]
 E --> F[Time Synchronization / End-to-End Latency]
 F --> G[OTA / Diagnostics / Fault Recovery]
```



## Practice Scenario


Zone MCU가 버튼·온도 입력을 수집하고 Central Compute가 조명 정책을 계산한 뒤 Zone MCU가 RGB 출력에 반영하는 가상 시스템을 사용한다. 실제 차량 구현 경험이나 안전 인증을 의미하지 않는다. 메시지 단위·유효기간·Sequence·명령 ACK·오류 시 동작을 먼저 정하고 Middleware를 선택한다.


## Environment


MCU 쪽 구현 예제는 C를 우선한다. ROS 2 CLI·운영 명령은 셸 코드로 제공한다. ROS 2 실습은 설치된 배포판의 demo_nodes_cpp를 전제로 하며 실제 차량 제어 장치 대신 격리된 테스트 네트워크에서 진행한다. ROS 2의 RMW·Zenoh API는 설치 버전을 기록하고 해당 버전 문서에 맞춘다.

