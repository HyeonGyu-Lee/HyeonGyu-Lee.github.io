---
layout: default
title: "Adaptive AUTOSAR"
has_children: true
published_date: 2024-06-03T04:50:00.000Z
last_modified_date: 2026-10-14T16:00:00.000Z
nav_order: 2
parent: "AUTOSAR"
permalink: '/AUTOSAR/Adaptive_AUTOSAR'
redirect_from:
 - "/420a299530e5405fb9ca1c2680cc8386"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Adaptive AUTOSAR가 등장한 배경
> Adaptive Platform은 고성능 차량 컴퓨팅에서 application을 process와 service 단위로 구성하고, 실행·통신·데이터·software lifecycle을 관리하기 위한 표준이다.
차량 기능이 고정된 주기 제어를 넘어 복잡한 연산과 외부 연결, 장기간 software 변경을 요구하면서, 제어 중심의 Classic과는 다른 실행·배포 관점이 필요해졌다. Adaptive는 Classic을 대체하기보다 이 요구 영역을 맡으며 차량 내부에서 두 platform이 공존할 수 있다.
## Classic과 다른 아키텍처 관점

| 관점 | Classic | Adaptive |
| --- | --- | --- |
| 기능 단위 | SWC와 runnable을 RTE·OS 구성에 연결 | Application process와 service interface |
| 통합의 중심 | ECU configuration과 생성된 RTE/BSW 구성 | Application 실행 설정과 service deployment |
| 통신의 관점 | Signal/PDU와 SWC interface의 mapping | Service instance의 제공·발견·이용 |
| 변경의 관점 | 통합된 ECU software 구성 | Application과 platform의 version·lifecycle 관계 |
| OS와 API | AUTOSAR OS/BSW interface | POSIX 관련 OS 요구와 ara API 등 platform interface |

Adaptive는 Linux의 다른 이름이 아니며 모든 POSIX application이 Adaptive application인 것도 아니다. 또한 service discovery가 가능하다는 사실이 interface·배포·실행 설정이 필요 없다는 뜻은 아니다.
## Functional Cluster 지도

| 영역 | 책임과 다른 영역과의 관계 |
| --- | --- |
| Execution Management | Process 실행과 종료, 실행 상태에 관련된 기능. Application의 업무상 준비 상태와 구분 |
| State Management | Machine/Function Group 등의 상태와 전환에 대한 조정. 개별 process 실행과 system 상태를 연결 |
| Communication Management | Service 제공·탐색·event/method/field 통신을 application에 제공 |
| Persistency | Application이 유지해야 하는 데이터의 저장·접근에 관한 기능 |
| Diagnostics | 외부 진단 요구와 application/platform의 진단 기능 연결 |
| Log and Trace | 동작 상태와 문제 분석을 위한 관찰 정보 |
| Platform Health Management | 감시 대상의 동작과 health 관련 supervision |
| Update and Configuration Management | Software package와 update lifecycle 관련 기능 |
| Security 관련 기능 | Identity·권한·암호 기능 등 신뢰 경계와 접근 통제에 필요한 기능 |

Functional cluster의 구성과 interface는 적용 release에 따라 달라진다.
## Service-oriented architecture의 의미
Interface는 어떤 data·operation을 교환하는지, instance는 그 기능의 어떤 제공 대상을 뜻하는지, deployment는 그 instance가 어느 실행·통신 환경에 놓이는지를 나타낸다. Service availability와 데이터의 유효성은 별개다. Field, event, method는 같은 정보를 전달하더라도 접근 방식과 계약이 다르다.
## 실행과 상태를 분리하는 이유
Process가 실행 중이라는 사실만으로 기능이 준비됐다고 볼 수 없다. 초기화·resource·기능 의존성이 존재하기 때문이다. Execution Management와 State Management는 서로 다른 수준의 책임을 담당하며, health supervision은 또 다른 관찰 관점이다. 이 구분은 software 기능을 독립적으로 구성하면서 system 전체 상태를 일관되게 유지하려는 목적과 연결된다.
## Manifest와 배포 정보
Application binary만으로는 어떤 process가 어떤 instance를 제공하고 어느 상태에서 실행될지 알 수 없다. Manifest와 관련 모델은 application의 실행·통신·machine 연결을 기술한다. Interface 정의와 deployment 설정을 구분하는 것은 같은 기능 정의를 다른 machine과 통신 환경에 배치하기 위한 기반이다.
## 장기 유지와 update 관점
Software가 바뀌면 binary뿐 아니라 interface, persistency data 형식, package dependency와 권한도 영향을 받는다. Adaptive의 lifecycle 관점은 설치 여부를 넘어 실행 가능한 조합과 application/platform 관계를 다룬다. Update 전달 경로, package 검증, activation과 boot 검증은 동일한 기능이 아니다.
## 릴리스 흐름을 읽는 방법
2017년의 초기 Adaptive release 계열은 process·service 기반 platform이라는 새로운 방향을 이해하는 출발점이다. 이후 연도별 baseline은 여러 functional cluster의 요구사항과 관계를 비교해 읽어야 한다. R17-10은 Adaptive 최초 release와 동일하지 않으며, R17-03과 구분한다.
Release는 표준 문서 집합의 기준 버전이다. 공급사 runtime과 application의 버전은 별도로 관리한다.
