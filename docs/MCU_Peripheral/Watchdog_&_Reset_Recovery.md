---
layout: default
title: Watchdog & Reset Recovery
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-21-10-00
nav_order: 7
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Watchdog_&_Reset_Recovery'
redirect_from:
 - /3f91b412900a81698454d9c0fc69a03a
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


Watchdog은 software progress가 멈췄을 때 복구를 시작하는 수단이다. 무조건 주기적으로 feed하는 코드만 넣으면 일부 task가 멈춰도 fault를 숨길 수 있다.


## Supervision Design


각 필수 task가 주기 안에 progress counter를 갱신하고 supervisor가 모두 충족됐을 때 feed하는 구조를 검토한다. counter 갱신 시점은 loop 진입이 아니라 요구 작업의 실제 진행을 반영한다. window watchdog은 너무 빠른 feed도 오류가 될 수 있다.


## Reset Record


reset reason, boot count, 마지막 유효 상태와 fault 요약을 보존 정책에 따라 기록한다. retained RAM·flash의 보존 범위는 reset 종류별로 다르다. flash에 매 tick 기록하여 수명을 소모하지 않는다.


## Recovery Policy


반복 reset이면 진단 가능 상태나 제한 기능으로 진입할 수 있도록 요구사항을 정의한다. 정상 상태로 보이게 watchdog을 비활성화하는 것을 해결책으로 삼지 않는다. debugger 연결 시 watchdog 정지 옵션은 실차 실행과 다를 수 있다.


## Fault Injection


task 정지, interrupt storm, deadlock, clock 변경, 초기화 실패와 reset 직후 전원 차단을 시험한다. reset 후 output 초기값·pending command 폐기·통신 재동기화까지 확인한다.

