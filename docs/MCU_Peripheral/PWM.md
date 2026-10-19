---
layout: default
title: PWM
has_children: false
published_date: 2026-10-14-22-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 6
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/PWM'
redirect_from:
 - "/3f91b412900a816b83f7e67afc9a7236"
---
## LED 밝기와 motor 구동을 같은 duty 값으로 제어하는 상황


PWM은 주기와 active 시간의 비율을 표현한다. Clock, prescaler, counter mode가 주기를 정하고 compare 값이 출력 전환 시점을 정한다. Load의 전기적 특성에 따라 같은 duty도 다른 효과를 낸다.


> PWM은 period와 active time으로 출력을 제어한다. Frequency·duty뿐 아니라 polarity·edge alignment·update 시점·fault 시 output 상태를 함께 설정한다.


## S32K312 Configuration


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
사용 가능한 timer/PWM IP, channel, pin mux, output polarity는 S32K312 패키지와 설치 RTD의 예제로 확정한다. 다른 S32K 제품의 timer 이름·register 주소를 그대로 가져오지 않는다.
</div>
</div>
</blockquote>



| 항목     | 실무 설정                                                                 |
| ------ | --------------------------------------------------------------------- |
| Clock  | Functional clock source·divider·gate를 확인하고 저전력 복귀 후 변화를 검증한다.         |
| Mode   | Edge-aligned와 center-aligned를 구분한다. 동일 MOD에서 frequency가 같다고 가정하지 않는다. |
| Period | Counter의 endpoint 포함 여부와 실제 divider 값을 기준으로 계산한다.                     |
| Duty   | Active polarity와 compare 동작, 0%·100%의 특수 처리를 확인한다.                    |
| Update | Shadow register에 쓰고 reload 시점에 반영하여 짧은 glitch를 피한다.                   |
| Output | Pin mux·pad·driver enable·fault override·부팅 시 안전 레벨을 정의한다.            |


## Frequency and Duty

<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="/_images/MCU_Peripheral/PWM/1.webp" href="/_images/MCU_Peripheral/PWM/1.webp" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" decoding="async" width="1774" height="887" alt="" src="/_images/MCU_Peripheral/PWM/1.webp" />
<figcaption>Period=1 ms, duty=25%, active time=250 μs의 설명용 PWM·Input Capture 그림. 실제 측정 파형이 아니다.</figcaption>
</figure>
</a>
</div>
</div>
</div>



상향 counter가 0..MOD를 포함하는 edge-aligned 모델이면 period tick=MOD+1이다. 예를 들어 f_input=80 MHz, divider=80이면 tick=1 μs이고 MOD=999이면 1 kHz다. 250 tick 동안 active이면 duty=25%다. 이 모델을 center-aligned나 다른 reload 정의에 그대로 적용하지 않는다.


## Duty Calculation in C


아래 함수는 active tick을 계산할 뿐이며 실제 register 값이나 0/100% 출력 모드를 결정하지 않는다. Driver adapter가 endpoint 동작과 polarity를 처리해야 한다.


```c
#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
#include <stddef.h>
static bool active_ticks(uint32_t period, uint32_t permille,
                         uint32_t *active) {
    if (!active || period == 0 || permille > 1000) return false;
    *active = (uint32_t)(((uint64_t)period * permille + 500) / 1000);
    return true;
}
int main(void) {
    uint32_t n;
    assert(active_ticks(1000,250,&n) && n==250);
    assert(active_ticks(1000,0,&n) && n==0);
    assert(active_ticks(1000,1000,&n) && n==1000);
    assert(!active_ticks(0,500,&n));
    assert(!active_ticks(1000,1001,&n));
    return 0;
}
```



## Runtime Update


Period와 compare를 함께 변경할 때 어느 값이 먼저 적용되는지 확인한다. 더 작은 period로 변경하면서 이전 compare가 period를 넘지 않게 구성한다. 필요한 여러 channel은 지원되는 synchronization/reload mechanism으로 함께 갱신한다.


## Complementary Output and Dead Time


Motor·half bridge처럼 complementary output을 사용하는 경우 두 스위치가 동시에 켜지지 않도록 dead time·interlock·hardware fault path가 필요하다. Dead time 지원 여부와 단위, gate driver 지연을 확인한다. 단순 GPIO 반전이나 ISR 지연으로 안전한 complementary PWM을 구현했다고 가정하지 않는다.


## Measurement


Scope로 frequency·active width·jitter·update glitch·0/100%·start/stop·fault 상태를 측정한다. LED 밝기는 duty에 선형으로 보이지 않을 수 있으며 gamma/전류 제어는 별도 요구사항이다. Input Capture로 되읽을 때는 출력 검증 경로와 독립적인 clock 오차도 고려한다.


## 이해를 확인하는 질문


> Duty 50%를 설정하면 출력 전압이 항상 절반일까?


Digital pin은 high와 low를 반복한다. 평균값·전류·부하 응답은 filter, 주파수, 회로와 측정 방식에 따라 달라진다.

