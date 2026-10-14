---
layout: default
title: "CAN"
has_children: false
published_date: 2026-10-12T04:26:00.000Z
last_modified_date: 2026-10-14T13:52:00.000Z
nav_order: 1
parent: "차량 통신"
permalink: '/차량_통신/CAN'
redirect_from:
 - "/3f71b412900a81f7b0bbfba3a142389f"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}


## 핵심 요약


> 공유 버스에서 식별자 기반 중재로 메시지를 전송하는 CAN의 프레임·신호·오류 처리를 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
Classic CAN의 일반 개념. ISO 11898 시리즈의 적용 판과 트랜시버 사양을 별도로 확인한다.
</div>
</div>
</blockquote>



## 본문


### 통신 원리


CAN은 메시지 중심의 브로드캐스트 통신이다. 식별자는 메시지 의미와 중재 우선순위에 사용되며 송신 노드의 고유 주소와 동일하지 않다.


여러 노드가 동시에 전송하면 dominant/recessive 비트와 비트별 중재로 우선순위가 결정된다. 같은 프레임 형식에서는 더 작은 수치의 ID가 일반적으로 높은 우선순위를 갖지만, 기본·확장 프레임 등의 중재 필드 차이도 확인한다.


### 프레임과 데이터


11비트 기본 식별자와 29비트 확장 식별자 형식을 구분한다. Classic CAN 데이터 프레임의 페이로드는 최대 8바이트다. 데이터 값은 신호 정의 없이 물리량으로 해석할 수 없다.


DBC 등 신호 정의에서 시작 비트·길이·바이트 순서·부호·스케일·오프셋·단위·무효값을 확인한다. 프레임 식별자와 신호 정의의 버전도 함께 기록한다.


### 물리 연결과 구성


고속 CAN의 전형적인 선형 버스는 양 끝의 종단과 제한된 stub을 고려한다. 모든 CAN 물리 계층이 동일한 종단 구성을 사용하는 것은 아니다. 비트레이트·샘플 포인트·배선·노드 수를 실제 PHY와 함께 확인한다.


### 오류 처리와 한계


오류 검출·오류 프레임·재전송과 error-active, error-passive, bus-off 상태를 구분한다. ACK는 적어도 한 수신 노드의 프로토콜 수준 수신을 뜻하며 목적 애플리케이션의 처리가 완료됐다는 보장은 아니다.


높은 우선순위 메시지가 많으면 낮은 우선순위의 응답 시간이 늘 수 있다. 평균 버스 부하뿐 아니라 최악 응답 시간과 주기·지터를 분석한다.


### 검증과 분석

- 정상·경계 신호값과 신호 변환.
- 메시지 주기·지터·버스 부하와 중재 지연.
- 메시지 누락·타임아웃·재시작 후 복구.
- bus-off 진입·복구 정책과 애플리케이션 상태.
- 게이트웨이 전달과 신호 정의 불일치.

### 실습: SocketCAN으로 프레임 송수신


Linux의 can-utils와 vcan 모듈을 사용하는 가상 버스 예제다. 실제 배선·중재 타이밍·bus-off를 재현하는 시험은 아니다.


```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set vcan0 up
# 터미널 A
candump -tz vcan0
# 터미널 B
cansend vcan0 123#11223344
```


수신 로그에서 ID 0x123과 데이터 11 22 33 44를 확인한다. 응용 신호 정의가 없다면 이 데이터를 온도·속도 등으로 임의 해석하지 않는다.


### 실습: 신호 변환


예제 신호 정의는 첫 2바이트 unsigned little-endian, factor 0.1, offset -40이다. Raw 0x012C는 300이고 물리값은 -10이다.


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
int main(void) {
 const uint8_t payload[] = {0x2C, 0x01};
 uint16_t raw = (uint16_t)payload[0] | ((uint16_t)payload[1] << 8);
 /* 0.1 단위 고정소수점: physical = raw*0.1 - 40 */
 int32_t physical_tenths = (int32_t)raw - 400;
 assert(physical_tenths == -100);
 printf("physical = %.1f\n", physical_tenths / 10.0);
 return 0;
}
```


신호 정의와 실제 로그의 바이트 순서·단위를 먼저 대조한다. Raw 최소·최대값과 무효값 처리를 추가해 시험한다.


## MCU 구현과의 연결


차량 네트워크에서는 ECU 간 메시지 계약·주기·부하·호환성과 복구 정책을 확인한다. Controller의 clock·register·buffer·driver 구현은 [CAN Bit Timing & FlexCAN](https://autosar.dev/3f91b412900a819aacb9e115a3cb0ba0) 문서에서 별도로 다룬다.
