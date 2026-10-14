---
layout: default
title: "Timer/Counter & Input Capture"
has_children: false
published_date: 2026-10-14T12:52:00.000Z
last_modified_date: 2026-10-14T13:46:00.000Z
nav_order: 5
parent: "MCU Peripheral"
permalink: '/MCU_Peripheral/Timer-Counter_&_Input_Capture'
redirect_from:
 - "/3f91b412900a819a80c1c169cf52d6b9"
 - "/MCU_Peripheral/Timer,_PWM_&_Input_Capture"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}


## Overview


> Timer는 주기 작업·timeout·PWM·edge timestamp의 기반이다. S32K312에서 사용할 timer IP와 channel·pin은 RTD 예제와 Reference Manual로 확정한다. 서로 다른 timer의 prescaler·reload 의미를 혼용하지 않는다.


## Calculation


상향 카운터가 0부터 MOD까지 포함하고 한 주기에 한 번 반복하는 모델이면 f_tick=f_input/divider, period=(MOD+1)/f_tick이다. Center-aligned PWM은 카운트 왕복과 endpoint 처리에 따라 식이 달라진다. Duty 0/100%의 compare 특수 동작도 확인한다.


## Worked Example


<figure><a href="/assets/images/diagrams/pwm-timing.png" data-fslightbox="pwm"><img src="/assets/images/diagrams/pwm-timing.png" width="1774" height="887" loading="lazy" decoding="async" alt="Edge-aligned PWM 1 kHz, duty 25%의 설명용 파형이다. Period=1 ms, High time=250 μs이며 Input Capture의 rising/falling timestamp로 period와 duty를 계산한다. 실제 측정 파형이 아니다."></a><figcaption>Edge-aligned PWM 1 kHz, duty 25%의 설명용 파형이다. Period=1 ms, High time=250 μs이며 Input Capture의 rising/falling timestamp로 period와 duty를 계산한다. 실제 측정 파형이 아니다.</figcaption></figure>


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
그림 읽기와 실측 확인: 실제 scope에서 period·High time·jitter를 확인한다. timer tick 단위, counter wraparound, edge polarity를 기록하고 center-aligned PWM에는 같은 계산식을 그대로 적용하지 않는다.
</div>
</div>
</blockquote>



설명용 입력 80 MHz, divider 80이면 tick은 1 us다. MOD=999이면 period는 1 ms, frequency는 1 kHz다. edge-aligned high time 250 tick을 지원하는 설정이면 25% duty다. 실제 레지스터가 divider 자체인지 divider−1인지 확인한다.


## Capture and Overflow


입력 capture는 edge 시각을 하드웨어에서 기록하여 ISR 진입 지연의 영향을 줄인다. 같은 timer의 unsigned 차이로 짧은 간격을 계산할 수 있지만 한 번 이상 wrap되는 긴 구간에는 overflow 확장 counter가 필요하다. 측정 주파수와 duty를 edge polarity별로 구분한다.


## Update and Verification


PWM compare를 주기 중간에 바꾸면 glitch가 생길 수 있으므로 shadow register와 reload 시점을 확인한다. scope로 frequency·duty·jitter·0/100%·runtime update와 저전력 복귀를 검증한다. ISR에서 긴 작업 대신 event만 전달한다.


## Timer/Counter Configuration


| 기능                     | 설정과 적용 예                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| Periodic timer         | Clock·prescaler·reload·IRQ를 설정해 주기 event를 만든다. ISR에서 긴 작업을 하지 않는다. |
| Free-running counter   | Timestamp·timeout에 사용한다. Counter 폭과 wrap 주기를 명시한다.                 |
| External event counter | 외부 pulse 입력·edge·filter·최대 input rate를 확인한다. 모든 timer가 지원하지는 않는다.  |
| Input Capture          | rising/falling edge의 counter 값을 latch하여 period·pulse width를 계산한다.  |
| Output Compare         | Counter match로 event/output을 만든다. PWM은 별도 PWM 문서에서 다룬다.            |


## S32K312 Setup Checklist


사용 목적을 먼저 정하고 해당 S32K312/RTD에서 지원하는 timer IP를 선택한다. Clock source·gate·divider → counter mode·reload → channel/pin → event routing·IRQ/DMA → 시작 순서로 구성한다. Core clock을 timer 입력으로 가정하지 않는다. Compare/capture flag의 clear 방식과 freeze/debug/low-power 동작을 확인한다.


## Wrap-safe Elapsed Time in C


32-bit free-running counter의 두 관측 사이에 최대 한 번 wrap되고 실제 간격이 2^32 tick 미만인 경우 unsigned subtraction으로 elapsed를 계산할 수 있다. 16-bit timer를 32-bit 변수에 읽었다면 별도 16-bit modular 연산이나 overflow 확장이 필요하다.


```c
#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
static bool expired(uint32_t now, uint32_t start, uint32_t timeout) {
    return (uint32_t)(now-start) >= timeout;
}
int main(void) {
    assert((uint32_t)(0x10u-0xfffffff0u)==32u);
    assert(expired(0x10u,0xfffffff0u,32u));
    assert(!expired(0x0fu,0xfffffff0u,32u));
    return 0;
}
```


한 번 이상의 full counter cycle 동안 상태를 확인하지 않으면 이 함수만으로 실제 경과시간을 복원할 수 없다. Overflow ISR과 high word를 조합할 때도 capture와 overflow가 동시에 발생하는 race를 처리해야 한다.


## Capture Data Path


Edge timestamp를 ISR에서 소프트웨어로 읽는 것과 hardware capture register를 읽는 것은 다르다. Hardware capture도 다음 edge가 오면 덮어쓸 수 있으므로 FIFO/DMA·overcapture flag를 확인한다. CPU가 읽는 순서와 flag clear가 캡처 데이터를 버리지 않는지 확인한다.


## Timer Verification


기준 신호로 period·pulse width·wrap 경계·누락된 edge·IRQ 지연·저전력 복귀를 시험한다. 32-bit 1 MHz counter는 약 71.6분마다 wrap된다. Counter 폭과 tick frequency가 바뀌면 timeout의 유효 범위도 다시 계산한다.
