---
layout: default
title: Memory Architecture
has_children: true
published_date: 2026-10-14-22-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 9
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Memory_Architecture'
redirect_from:
 - /3f91b412900a81c6a41bfbb44afb6399
 - /undefined
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


RAM, ROM & Flash → Linker Script & Startup → Stack, Heap & Memory Safety 순서로 학습한다. 이미 작성된 DMA & Buffer Ownership과 Multi-Core & Memory Ordering은 runtime 접근 규칙을 보완한다.


## S32K312 Scope


정확한 SRAM·Flash 크기, 접근 가능한 master, ECC 초기화, cache/TCM 존재와 영역은 대상 부품의 memory map을 기준으로 확인한다. 다른 S32K3 모델의 linker 주소와 크기를 그대로 사용하지 않는다.

