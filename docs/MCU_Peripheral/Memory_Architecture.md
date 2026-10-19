---
layout: default
title: Memory Architecture
has_children: true
published_date: 2026-10-14-22-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 15
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Memory_Architecture'
redirect_from:
 - "/3f91b412900a81c6a41bfbb44afb6399"
---
## 저장 매체와 실행 중 객체의 위치를 연결하는 상황


Memory map, linker section, runtime allocation과 bus 접근은 서로 다른 관점이다. Data가 어느 영역에 놓이는지와 누가 언제 접근하는지를 연결해야 reset·DMA·multicore 문제를 설명할 수 있다.


> 주소 공간, 물리적 메모리, linker 배치, runtime 수명을 연결해 이해한다. RAM/ROM이라는 이름만으로 속도·보안·DMA 접근성·cache 속성을 판단하지 않는다.


## Software Sections


```mermaid
flowchart LR
 F[Flash image] --> T[Code / rodata]
 F --> D[Initial data bytes]
 D -->|Startup copy| R[RAM data]
 Z[Startup zeroing] --> B[RAM bss]
 R --> A[Application state]
 B --> A
 S[Stack / Heap / DMA buffers] --> A
```



## Learning Path


RAM, ROM & Flash는 저장 매체, Linker Script & Startup은 메모리 배치와 초기화, Stack, Heap & Memory Safety는 실행 중 할당과 수명을 다룬다. DMA & Buffer Ownership과 Multi-Core & Memory Ordering은 공유 메모리의 접근 규칙을 다룬다.


## S32K312 Scope


정확한 SRAM·Flash 크기, 접근 가능한 master, ECC 초기화, cache/TCM 존재와 영역은 대상 부품의 memory map을 기준으로 확인한다. 다른 S32K3 모델의 linker 주소와 크기를 그대로 사용하지 않는다.


## 이해를 확인하는 질문


> RAM에 있는 값은 reset 뒤 항상 같은 상태일까?


Reset 종류와 startup 초기화, retention 정책에 따라 달라진다. 물리 보존과 software 초기화를 구분한다.

