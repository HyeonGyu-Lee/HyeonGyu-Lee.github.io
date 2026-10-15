---
layout: default
title: "Memory Architecture"
has_children: true
published_date: 2026-10-14T13:02:00.000Z
last_modified_date: 2026-10-14T13:46:00.000Z
nav_order: 15
parent: "MCU Peripheral"
permalink: '/MCU_Peripheral/Memory_Architecture'
redirect_from:
 - "/3f91b412900a81c6a41bfbb44afb6399"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


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
