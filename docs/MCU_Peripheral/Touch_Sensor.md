---
layout: default
title: "Touch Sensor"
has_children: false
published_date: 2026-10-14T06:25:00.000Z
last_modified_date: 2026-10-14T13:55:00.000Z
nav_order: 4
parent: "MCU Peripheral"
permalink: '/MCU_Peripheral/Touch_Sensor'
redirect_from:
 - "/3f91b412900a81d09942c1e319a88c65"
---

## 손을 대지 않았는데 터치가 검출되는 상황

Touch 판단에는 raw measurement, 장기 baseline, 차이값과 hysteresis가 관여한다. 주변 습도와 접지, 전극 형상이 측정값을 바꾸므로 threshold만 조절해서 모든 문제를 해결하기 어렵다.

> 정전용량 터치는 손가락 접근에 따른 전극의 정전용량 변화를 측정한다. raw 값을 baseline과 비교해 delta를 계산하고 threshold·hysteresis·debounce로 안정된 이벤트를 만든다. 부품명과 전극 구조가 확정되지 않은 상태에서 특정 레지스터나 감도 값을 고정하지 않는다.


## 구현 방식 선택

- 외부 터치 IC: 전극 측정과 보정을 IC가 담당한다. MCU는 I2C/SPI 설정, IRQ, 상태·raw 값 읽기와 제품 이벤트를 구현한다. 데이터시트에서 재보정·습기·stuck 처리 옵션을 확인한다.
- MCU 직접 측정: GPIO·timer·ADC 등의 충방전 측정 방식과 아날로그 회로를 직접 설계한다. 일반 ADC가 정전용량을 곧바로 출력하는 것은 아니다. S32K312에 원하는 전용 touch IP가 있다고 가정하지 않는다.

실무에서는 먼저 센서 부품, 전극 크기·간격, overlay 재질·두께, 접지·shield 구조와 목표 환경을 확정한다. 센서 감도만 올리는 방식으로 두꺼운 패널·긴 배선·물방울 문제를 해결하려 하지 않는다.


## 외부 터치 IC 연결·설정 절차

- 전원·I/O 레벨·RESET·IRQ 극성과 pull 요구를 확인하고 I2C 주소 또는 SPI mode·최대 클록을 설정한다. 공통 버스에는 중복 주소·CS 충돌이 없어야 한다.
- chip ID 또는 상태 register 읽기로 통신을 검증한 뒤 채널 enable, acquisition/scan period, sensitivity와 threshold를 설정한다. 설정값 readback을 지원하면 비교한다.
- IRQ 의미가 edge인지 level인지, status 읽기가 flag를 지우는지 확인한다. ISR에서는 이벤트를 알리고 task에서 버스 읽기·상태 처리를 수행한다.
- 시작 시 손가락이 닿아 있는 경우, startup calibration 실패, 장시간 누름, 통신 timeout과 센서 reset을 상태 머신에 포함한다.

## raw·baseline·delta 분리


<figure><a href="/assets/images/diagrams/touch-timing.png" data-fslightbox="touch"><img src="/assets/images/diagrams/touch-timing.png" width="1983" height="793" loading="lazy" decoding="async" alt="Delta=raw−baseline, ON threshold=50, OFF threshold=30, 연속 3회 판정의 설명용 그래프다. Sample 3~5에서 ON 조건이 유지되어 5에서 pressed가 되고, 8~10에서 OFF 조건이 유지되어 10에서 해제된다. 실제 측정 파형이 아니다."></a><figcaption>Delta=raw−baseline, ON threshold=50, OFF threshold=30, 연속 3회 판정의 설명용 그래프다. Sample 3~5에서 ON 조건이 유지되어 5에서 pressed가 되고, 8~10에서 OFF 조건이 유지되어 10에서 해제된다. 실제 측정 파형이 아니다.</figcaption></figure>


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
그림 읽기와 실측 확인: Threshold 사이에서는 현재 상태를 유지한다. 본문 C 예제의 ON 조건은 delta\>50, OFF 조건은 delta\<=30이다. 그림의 scan period와 threshold는 실제 센서 보장값이 아니며, baseline 추적과 filtering을 포함한 실측 데이터로 보정한다.
</div>
</div>
</blockquote>



센서마다 touch가 raw 증가 또는 감소로 나타날 수 있다. delta를 항상 raw−baseline으로 가정하지 말고 부품의 표현을 확인한다. 비터치 상태에서는 baseline이 느린 온도·습도 변화를 따라가게 하되, 터치 중에는 baseline이 손가락 신호를 흡수하지 않도록 업데이트 정책을 둔다.


```c
#include <assert.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
typedef struct { double baseline; bool pressed; unsigned count; } Touch;
static bool update(Touch *s, double raw) {
 double delta = raw - s->baseline;
 bool wanted = delta > (s->pressed ? 30.0 : 50.0);
 if (wanted != s->pressed) {
  if (++s->count >= 3) { s->pressed = wanted; s->count = 0; }
 } else s->count = 0;
 if (!s->pressed && delta < 30.0) s->baseline += 0.01 * (raw - s->baseline);
 return s->pressed;
}
int main(void) {
 Touch s = {1000.0,false,0};
 assert(!update(&s,1100)); assert(!update(&s,1100)); assert(update(&s,1100));
 assert(update(&s,1000)); assert(update(&s,1000)); assert(!update(&s,1000));
 return 0;
}
```


threshold 50/30, 연속 3회, 계수 0.01은 알고리즘 설명용이다. 실제 센서 raw 범위·샘플 주기·비터치 분산·최약 터치 delta를 측정해 정한다. 외부 IC가 이미 filtering과 debounce를 제공하면 MCU가 추가한 지연까지 합산해 응답시간을 평가한다.


## 직접 정전용량 측정 시


저항과 전극 capacitance의 RC 충방전 시간을 timer로 측정하거나 정해진 충전 시간 후 전압을 ADC로 측정하는 방법이 있다. 핀 구동·high-impedance 전환, ADC sample capacitance, 누설과 외부 보호 회로가 측정에 영향을 준다. 검증된 회로 없이 GPIO 방향 전환 코드만으로 제품 수준의 터치를 구현했다고 판단하지 않는다.


## 오검출과 사용자 경험

- 물·장갑·습도·온도·접지 상태·충전기·인접 PWM·ESD 조건에서 false touch와 missed touch를 구분해 기록한다.
- 인접 전극 간 동시 터치·palm·슬라이더 처리 정책을 정의한다. 클릭·길게 누름 이벤트는 안정화된 touch 상태에서 생성한다.
- stuck timeout은 고장 판단과 장시간 사용자 누름을 구분해야 한다. 무조건 baseline을 즉시 재설정하면 누른 손가락을 비터치로 학습할 수 있다.

## 검증 결과에 남길 값


IC·firmware 버전, 전극·overlay 조건, scan period, raw/baseline/delta 분포, on/off threshold, debounce 시간, 응답시간과 false/missed 비율을 함께 기록한다. 통신 성공, 센서 감지 성공, 사용자 이벤트 품질을 별도로 검증한다.


## Touch Pad 구현 방식과 Peripheral 선택


| 방식                 | 사용하는 기능                                                    | 확인할 점                                                                             |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| RC 시간 측정           | GPIO drive/high-impedance 전환 + Timer/Capture 또는 Comparator | 전극 capacitance·저항·입력 threshold·시간 해상도·leakage가 측정에 영향을 준다.                        |
| ADC 기반 측정          | GPIO 제어 + charge transfer/분압 등 회로 + ADC                    | 전용 analog 회로와 acquisition sequence가 필요하다. 단순 analogRead만으로 touch가 검출된다고 가정하지 않는다. |
| 전용 Touch IC/engine | 전극 + 해당 sensor engine, MCU I2C/SPI·IRQ                     | Sensor가 raw/baseline/filter를 제공하는지 확인하고 MCU에서 중복 filtering 지연을 계산한다.              |
| Resistive touch    | 전극 drive GPIO + ADC                                        | 접촉 좌표를 전압으로 읽는 방식이다. Capacitive pad와 물리 원리가 다르다.                                  |


S32K312에서 사용할 방식은 실제 회로와 지원 Peripheral로 결정한다. GPIO·ADC를 모두 써야 하는 것이 아니며, 어느 조합이든 전극/overlay·ESD·noise·baseline 추적·hysteresis·debounce 검증이 필요하다.

## 이해를 확인하는 질문

> Baseline을 빠르게 추종시키면 항상 안정적일까?

실제 touch까지 baseline에 흡수할 수 있다. Touch 상태에서의 갱신 정책과 환경 변화 추종 속도를 구분한다.
