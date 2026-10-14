---
layout: default
title: "Stack, Heap & Memory Safety"
has_children: false
published_date: 2026-10-14T13:02:00.000Z
last_modified_date: 2026-10-14T13:24:00.000Z
nav_order: 3
parent: "Memory Architecture"
permalink: '/MCU_Peripheral/Memory_Architecture/Stack,_Heap_&_Memory_Safety'
redirect_from:
 - "/3f91b412900a81fdbcf9efb9db920246"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## Overview


> Stack은 호출 프레임·지역 객체, Heap은 allocator가 관리하는 동적 객체에 사용된다. RTOS task별 stack과 interrupt stack 구성은 port마다 다르다. static allocation은 runtime allocation 실패를 줄일 수 있지만 bounds·공유 상태·수명 오류를 자동 해결하지 않는다.


## Lifetime Example


함수 내부 지역 배열의 주소를 반환하거나 비동기 DMA에 넘긴 뒤 반환하면 수명이 끝날 수 있다. 호출자가 소유한 buffer를 받거나 pool/static 객체와 명시적인 완료 반환 규칙을 사용한다. static buffer 하나를 여러 요청이 동시에 쓰면 별도 ownership 문제가 생긴다.


## Bounds-safe Copy in C


```c
#include <assert.h>
#include <stdbool.h>
#include <stddef.h>
#include <string.h>
static bool copy_text(char *dst, size_t capacity, const char *src) {
    /* src는 유효한 null-terminated 문자열, 영역은 겹치지 않는다는 계약 */
    if (!dst || !src || capacity==0) return false;
    size_t n=strlen(src);
    if (n >= capacity) return false;
    memcpy(dst,src,n+1);
    return true;
}
int main(void) {
    char text[4];
    assert(copy_text(text,sizeof text,"CAN"));
    assert(!copy_text(text,sizeof text,"UART"));
    assert(!copy_text(text,0,""));
    return 0;
}
```



## Untrusted Input


위 함수는 src가 유효한 문자열이라는 전제가 있다. 외부 수신 buffer에는 별도 length를 전달하고 최대 길이 안에서 parsing한다. null terminator를 기대하며 strlen으로 수신 영역 밖을 읽지 않는다. pointer·length·capacity·ownership을 API 계약에 포함한다.


## Stack Budget


최악 호출 깊이, 큰 지역 배열, printf 계열, library call과 IRQ nesting을 고려한다. RTOS high-water mark는 실제 실행한 경로의 관측값이지 모든 경로의 최대 사용량 증명은 아니다. stack overflow hook·guard·MPU 지원을 적절히 구성한다.


## Heap Policy


실시간 task에서는 allocator 지연·fragmentation·실패 처리를 검토한다. 고정 크기 memory pool과 초기화 단계 allocation을 대안으로 고려한다. free 후 포인터를 null로 바꿔도 다른 alias의 dangling pointer는 남을 수 있다.


## Verification


PC 빌드의 AddressSanitizer/UndefinedBehaviorSanitizer와 경계 테스트, 보드의 fault status·stack trace·map을 함께 사용한다. 잘못된 길이·pool 소진·동시 요청·cancel 후 늦은 callback을 시험한다. 보안 경계의 입력 검증에 assert만 사용하지 않는다.
