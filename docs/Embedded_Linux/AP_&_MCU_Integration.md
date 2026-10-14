---
layout: default
title: AP & MCU Integration
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 1
parent: 'Embedded Linux'
permalink: '/Embedded_Linux/AP_&_MCU_Integration'
redirect_from:
 - /3f91b412900a816b8512da5b51f9d2fd
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


Linux AP의 큰 연산·정책 처리와 MCU의 로컬 제어를 분리할 때 IPC의 메시지 계약과 장애 격리가 핵심이다. AP가 멈추더라도 필요한 MCU 동작이 무엇인지 먼저 정의한다.


## OS and AUTOSAR


AUTOSAR Classic은 정적 구성·MCAL·BSW·RTE·OS를 포함하는 플랫폼 규격이다. RTOS 제품 이름과 같은 계층으로 비교하지 않는다. AUTOSAR Adaptive는 POSIX 기반 실행 환경에서 고성능 ECU 서비스를 제공하는 별도 플랫폼이며 일반 Linux 프로그램을 실행한다고 자동으로 Adaptive가 되는 것은 아니다.


## Transport Selection


UART/SPI/CAN/Ethernet 또는 동일 SoC의 shared memory·mailbox를 고려한다. RPMsg/OpenAMP는 지원되는 remote processor·BSP·메모리 구성이 전제이며 별도 S32K312를 연결한다고 자동으로 쓸 수 있는 기능이 아니다.


## Protocol Design


요청에 version·length·sequence·operation·deadline·payload를, 응답에 request ID·status·적용 여부를 정의한다. reset마다 session/generation을 갱신하여 이전 부팅의 응답을 새 요청에 적용하지 않는다. 구조체 raw memory 대신 명시적인 serialization을 사용한다.


## Recovery


AP service restart, MCU reset, cable disconnect를 별도로 시험한다. 재접속 시 capability와 현재 상태를 조회한 뒤 필요한 명령만 다시 적용한다. 만료된 Actuator 명령을 Queue에서 일괄 재전송하지 않는다.


## Verification


응답시간·유효 데이터 Age·메시지 손실·CPU 부하·재연결 시간을 기록한다. Linux 평균 지연이 작아도 최악 스케줄링 지연이 제어 요구를 만족하는지는 별도 검증한다. PREEMPT_RT도 모든 하드웨어·드라이버의 deadline을 자동 보장하지 않는다.

