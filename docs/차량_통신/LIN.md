---
layout: default
title: LIN
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 4
parent: '차량 통신'
permalink: '/차량_통신/LIN'
redirect_from:
 - /3f71b412900a819d9d81cb75e7f4da79
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


> 스케줄과 헤더·응답 역할을 중심으로 LIN의 저속 통신과 진단을 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
LIN 2.x 및 ISO 17987 시리즈의 일반 개념. 프로젝트의 적용 판과 LDF·트랜시버 사양을 확인한다.
</div>
</div>
</blockquote>



## 본문


### 통신 구조


Commander가 스케줄에 따라 헤더를 보내고 지정된 publisher가 응답한다. Commander/responder 용어와 기존 문서의 master/slave 용어를 구분해 읽는다.


LIN은 전형적으로 단일 신호선과 기준 접지를 사용하는 저속 네트워크이며 최대 20 kbit/s 범위를 다룬다. 전원·접지·배선·PHY 조건은 구현 사양을 확인한다.


### 프레임 읽기


헤더는 break, sync, protected identifier로 구성된다. 응답은 데이터와 checksum을 포함한다. 데이터 길이는 최대 8바이트다.


Protected identifier의 패리티와 classic/enhanced checksum의 적용 범위를 확인한다. 진단 프레임 등은 일반 데이터 프레임과 checksum 규칙이 다를 수 있다.


### 스케줄과 신호


LDF에서 노드, 프레임, publisher, 신호 배치, 스케줄과 타이밍을 확인한다. 스케줄 테이블의 전환과 슬롯 시간은 응답 시간·데이터 신선도에 영향을 준다.


### 진단과 전원 상태


LIN 진단은 진단 프레임과 주소 지정·전송 절차를 함께 읽는다. sleep/wakeup 동작은 버스 상태, 노드 전원 상태와 트랜시버 조건을 구분한다.


### 검증 항목

- 헤더·응답의 송신 주체와 길이·checksum.
- 슬롯 시간, 스케줄 전환과 응답 누락.
- sleep 진입, wakeup 요청과 통신 복구.
- 진단 주소·분할 전송·타임아웃.

### 실습: 프레임 스케줄 설계


예제: commander가 액추에이터 명령 프레임을 20 ms마다, 상태 프레임을 100 ms마다 요청한다. publisher와 데이터 길이, 슬롯 시간을 LDF 정의와 연결한다.


ID 0x12의 protected identifier를 계산하는 예시:


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
static uint8_t lin_pid(uint8_t id) {
 id &= 0x3FU;
 uint8_t p0 = ((id >> 0) ^ (id >> 1) ^ (id >> 2) ^ (id >> 4)) & 1U;
 uint8_t p1 = (1U ^ (id >> 1) ^ (id >> 3) ^ (id >> 4) ^ (id >> 5)) & 1U;
 return (uint8_t)(id | (p0 << 6) | (p1 << 7));
}
int main(void) { assert(lin_pid(0x12) == 0x92); return 0; }
```



### checksum 계산 예시


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
static uint8_t checksum(const uint8_t *data, size_t size) {
 unsigned sum = 0;
 for (size_t i = 0; i < size; ++i) {
  sum += data[i];
  if (sum > 255U) sum -= 255U;
 }
 return (uint8_t)(~sum & 0xFFU);
}
int main(void) {
 const uint8_t classic[] = {0x10, 0x20};
 const uint8_t enhanced[] = {0x92, 0x10, 0x20};
 assert(checksum(classic, sizeof classic) == 0xCF);
 assert(checksum(enhanced, sizeof enhanced) == 0x3D);
 return 0;
}
```



첫 결과는 데이터만 포함한 classic 예제, 둘째는 PID를 포함한 enhanced 예제다. 실제 프레임의 적용 checksum 종류를 확인한다. 응답을 한 슬롯 누락시켜 timeout 처리와 다음 스케줄의 동작도 확인한다.

