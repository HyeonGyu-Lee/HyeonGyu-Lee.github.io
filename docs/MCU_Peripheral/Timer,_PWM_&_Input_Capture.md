---
layout: default
title: Timer, PWM & Input Capture
has_children: false
published_date: 2026-10-14-21-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 6
parent: 'MCU Peripheral'
permalink: '/MCU_Peripheral/Timer,_PWM_&_Input_Capture'
redirect_from:
 - /3f91b412900a819a80c1c169cf52d6b9
 - /undefined
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


설명용 입력 80 MHz, divider 80이면 tick은 1 us다. MOD=999이면 period는 1 ms, frequency는 1 kHz다. edge-aligned high time 250 tick을 지원하는 설정이면 25% duty다. 실제 레지스터가 divider 자체인지 divider−1인지 확인한다.


## Capture and Overflow


입력 capture는 edge 시각을 하드웨어에서 기록하여 ISR 진입 지연의 영향을 줄인다. 같은 timer의 unsigned 차이로 짧은 간격을 계산할 수 있지만 한 번 이상 wrap되는 긴 구간에는 overflow 확장 counter가 필요하다. 측정 주파수와 duty를 edge polarity별로 구분한다.


## Update and Verification


PWM compare를 주기 중간에 바꾸면 glitch가 생길 수 있으므로 shadow register와 reload 시점을 확인한다. scope로 frequency·duty·jitter·0/100%·runtime update와 저전력 복귀를 검증한다. ISR에서 긴 작업 대신 event만 전달한다.

