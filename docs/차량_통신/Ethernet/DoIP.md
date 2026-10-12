---
layout: default
title: DoIP
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 6
parent: 'Ethernet'
permalink: '/차량_통신/Ethernet/DoIP'
redirect_from:
 - /3f71b412900a81a3a5e1fc467ddd2058
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


IP 네트워크에서 진단 장비·게이트웨이·ECU 사이의 진단 전달을 이해한다.


## 적용 범위


ISO 13400 시리즈의 적용 판과 ECU 논리 주소·라우팅 정책을 확인한다.


## 본문


### 역할


DoIP은 Diagnostics over Internet Protocol의 약자다. UDS 서비스 데이터의 의미와 IP 기반 진단 전달·연결 절차를 구분한다.


### 발견과 연결


차량 식별·발견과 실제 진단 연결은 다른 단계다. 일반적으로 UDP 기반 발견과 TCP 기반 진단 연결을 고려하며 세부 동작은 적용 규격을 따른다.


Routing activation, source/target logical address, 연결 상태와 게이트웨이 경로를 확인한다. IP 주소와 진단 논리 주소는 동일한 식별자가 아니다.


### 오류 해석


네트워크 연결 실패, DoIP 수준 acknowledgement·negative acknowledgement, UDS NRC를 구분한다. DoIP acknowledgement가 UDS 서비스의 성공을 의미하지 않는다.


### 보안과 운용


DoIP이라는 이유만으로 인증·암호화가 자동 제공된다고 가정하지 않는다. TLS 등 보안 지원과 실제 정책, 외부 접근·gateway 라우팅·세션 자원 제한을 확인한다.


### 검증 항목

- 차량 발견·식별과 네트워크 설정.
- routing activation 허용·거절.
- 잘못된 source/target 주소.
- 연결 종료·재접속과 요청 처리.
- 진단 payload·응답 시간과 UDS 결과.

### 실습: 발견부터 UDS 응답까지


시험용 ECU·gateway·진단 도구의 IP와 logical address를 설정한다. 차량 식별 → TCP 연결 → routing activation → 진단 요청 → DoIP acknowledgement → UDS 응답을 각각 캡처한다.


Wireshark에서 doip 필터를 적용하고, 기본 포트가 아닌 시스템에서는 실제 transport 포트와 decode-as를 확인한다.


### 실패 분석 예제


TCP 연결은 됐지만 진단이 실패하면 routing activation 결과, source/target logical address, gateway 경로와 세션 상태를 확인한다. 잘못된 logical address의 DoIP NACK와 ECU가 반환한 UDS NRC를 다른 결과로 기록한다.


연결을 강제로 종료한 뒤 재접속·routing activation·기존 요청의 처리 정책을 확인한다. 변경·초기화 서비스는 승인된 시험 대상에서만 실행한다.

