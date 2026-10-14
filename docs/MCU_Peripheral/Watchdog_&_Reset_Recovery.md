---
layout: default
title: "Watchdog & Reset Recovery"
has_children: false
published_date: 2026-10-14T12:52:00.000Z
last_modified_date: 2026-10-14T13:46:00.000Z
nav_order: 13
parent: "MCU Peripheral"
permalink: '/MCU_Peripheral/Watchdog_&_Reset_Recovery'
redirect_from:
 - "/3f91b412900a81698454d9c0fc69a03a"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}


## Overview


> Watchdog은 software progress가 멈췄을 때 복구를 시작하는 수단이다. 무조건 주기적으로 feed하는 코드만 넣으면 일부 task가 멈춰도 fault를 숨길 수 있다.


## Supervision Design


각 필수 task가 주기 안에 progress counter를 갱신하고 supervisor가 모두 충족됐을 때 feed하는 구조를 검토한다. counter 갱신 시점은 loop 진입이 아니라 요구 작업의 실제 진행을 반영한다. window watchdog은 너무 빠른 feed도 오류가 될 수 있다.


## Reset Record


reset reason, boot count, 마지막 유효 상태와 fault 요약을 보존 정책에 따라 기록한다. retained RAM·flash의 보존 범위는 reset 종류별로 다르다. flash에 매 tick 기록하여 수명을 소모하지 않는다.


## Recovery Policy


반복 reset이면 진단 가능 상태나 제한 기능으로 진입할 수 있도록 요구사항을 정의한다. 정상 상태로 보이게 watchdog을 비활성화하는 것을 해결책으로 삼지 않는다. debugger 연결 시 watchdog 정지 옵션은 실차 실행과 다를 수 있다.


## Fault Injection


task 정지, interrupt storm, deadlock, clock 변경, 초기화 실패와 reset 직후 전원 차단을 시험한다. reset 후 output 초기값·pending command 폐기·통신 재동기화까지 확인한다.


## S32K312 Watchdog Setup


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
실제 watchdog IP·clock source·timeout·window·unlock/refresh sequence는 S32K312 매뉴얼과 설치 RTD를 기준으로 확인한다. 아래 health gate는 feed 여부를 판단하는 예제이며 hardware refresh sequence를 구현하지 않는다.
</div>
</div>
</blockquote>



| 단계               | 확인할 내용                                                                    |
| ---------------- | ------------------------------------------------------------------------- |
| Reset cause      | Startup에서 reset status를 읽고 clear 전에 필요한 원인을 보존한다.                         |
| Clock            | 독립 clock 여부·허용 오차·저전력 동작을 확인한다. CPU clock으로 timeout을 계산하지 않는다.            |
| Timeout / Window | 최악 작업 지연보다 여유를 두되 요구 복구 시간 안에 있도록 선택한다. 너무 빠른 refresh 금지 조건도 확인한다.        |
| Initialization   | Boot ROM·Bootloader·Application 사이 watchdog 상태와 첫 refresh deadline을 인계한다. |
| Lock / Debug     | 설정 lock 후 변경 가능 여부와 debugger 연결 시 freeze 동작을 검증한다.                        |
| Reset output     | Reset 직후 actuator GPIO·통신 buffer·명령 queue가 요구 상태로 초기화되는지 확인한다.            |


## Progress Supervision in C


각 task가 실제 일을 완료했을 때 progress counter를 갱신한다. 아래 함수에 전달하는 snapshot은 task/ISR 사이의 보호된 복사 또는 검증된 Atomic/RTOS mechanism으로 확보해야 한다.


```c
#include <stdbool.h>
#include <stdint.h>
#include <stddef.h>
#define TASKS 3u
typedef struct { uint32_t last[TASKS]; } Health;
bool all_progressed(Health *h, const uint32_t now[TASKS]) {
    if (!h || !now) return false;
    for (size_t i=0;i<TASKS;i++)
        if (now[i]==h->last[i]) return false;
    for (size_t i=0;i<TASKS;i++) h->last[i]=now[i];
    return true;
}
```


모든 task가 매 supervision interval마다 진행해야 한다는 예제다. 서로 다른 주기 task는 각자의 deadline·alive count 범위로 감독한다. all_progressed가 true여도 window open 여부를 확인한 뒤 하나의 supervisor만 feed한다. 부팅 초기 last 값은 첫 유효 snapshot으로 초기화하고 첫 deadline을 별도로 관리한다.


## Failure Diagnosis


ISR에서 무조건 feed하면 main/task deadlock을 숨길 수 있다. Supervisor 자체가 멈췄을 때 watchdog이 실제 reset하는지 확인한다. Reset loop가 발생하면 watchdog을 끄기 전에 boot deadline·retained state·clock·계속되는 외부 fault를 분석한다.
