---
layout: default
title: "Debugging & Performance"
has_children: false
published_date: 2026-10-14T12:52:00.000Z
last_modified_date: 2026-10-14T12:54:00.000Z
nav_order: 5
parent: "Embedded Linux"
permalink: '/Embedded_Linux/Debugging_&_Performance'
redirect_from:
 - "/3f91b412900a819e8471ee8bd29d7b5d"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Investigation Order


증상과 재현 조건 → 정상/실패 로그 비교 → Process·Thread 상태 → system call → CPU·메모리·I/O → driver·하드웨어 순서로 범위를 좁힌다. 처음부터 우선순위나 cache 설정을 바꾸지 않는다.


## Practical Commands


```bash
ps -eLf
free -h
vmstat 1
# 실제 PID로 치환, 권한과 도구 설치 필요
# strace -f -tt -p PID
# gdb -p PID
# perf stat -p PID
```



## C Build Diagnostics


```bash
# PC에서 독립 실행 예제 검사
cc -std=c11 -Wall -Wextra -Werror -g -O1   -fsanitize=address,undefined example.c -o example
./example
```



## Interpretation


CPU 사용률이 낮아도 lock·I/O wait로 응답이 느릴 수 있다. 평균 지연과 tail latency를 함께 본다. sanitizer·tracing·debugger는 timing에 영향을 주므로 측정용 빌드와 결함 탐지용 빌드를 구분한다. ThreadSanitizer 지원 환경의 결과도 MCU ISR/DMA 오류를 검증하지 않는다.


## Field Diagnostics


boot/session ID, build ID, request ID, monotonic timestamp와 오류 코드를 남긴다. 로그의 개인정보·키를 제거하고 rate limiting을 적용한다. crash dump는 실행 binary와 symbol version을 맞춰 분석한다.
